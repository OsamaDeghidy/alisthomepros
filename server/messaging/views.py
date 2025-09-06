from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q, Count, Max, Prefetch
from django.utils import timezone
from django.contrib.auth import get_user_model
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Conversation, Message, MessageReadStatus, ConversationReadTime, MessageReaction, MessageAttachment
from .serializers import (
    ConversationSerializer, ConversationDetailSerializer, ConversationCreateSerializer,
    MessageSerializer, MessageCreateSerializer, MessageResponseSerializer, ConversationStatsSerializer,
    MessageBulkActionSerializer, ConversationSearchSerializer, MessageReactionSerializer, MessageAttachmentSerializer
)

User = get_user_model()


class ConversationListView(generics.ListAPIView):
    """قائمة المحادثات"""
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['participants__first_name', 'participants__last_name', 'project__title']
    ordering = ['-updated_at']
    
    def get_queryset(self):
        """Get user's conversations with optimized queries"""
        return Conversation.objects.filter(
            participants=self.request.user
        ).select_related('project').prefetch_related(
            'participants',
            Prefetch(
                'messages',
                queryset=Message.objects.select_related('sender').order_by('-created_at')[:1],
                to_attr='latest_message'
            )
        ).annotate(
            last_message_time=Max('messages__created_at')
        ).order_by('-last_message_time')
    
    @extend_schema(
        operation_id="list_conversations",
        summary="List Conversations",
        description="Get current user's conversations list",
        tags=["Messaging"],
        parameters=[
            OpenApiParameter(
                name="search",
                description="البحث في أسماء المشاركين أو عناوين المشاريع",
                required=False,
                type=OpenApiTypes.STR
            ),
        ]
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class ConversationDetailView(generics.RetrieveAPIView):
    """تفاصيل المحادثة"""
    serializer_class = ConversationDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Conversation.objects.filter(
            participants=self.request.user
        ).select_related('project').prefetch_related(
            'participants',
            Prefetch(
                'messages',
                queryset=Message.objects.select_related('sender').order_by('created_at'),
                to_attr='ordered_messages'
            )
        )
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Mark messages as read for current user
        unread_messages = Message.objects.filter(
            conversation=instance
        ).exclude(sender=request.user).exclude(
            read_statuses__user=request.user
        )
        
        # Create read status for unread messages
        read_statuses_to_create = [
            MessageReadStatus(user=request.user, message=message)
            for message in unread_messages
        ]
        
        if read_statuses_to_create:
            MessageReadStatus.objects.bulk_create(read_statuses_to_create, ignore_conflicts=True)
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    @extend_schema(
        operation_id="get_conversation_detail",
        summary="Conversation Details",
        description="Get specific conversation details with messages",
        tags=["Messaging"],
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class ConversationCreateView(generics.CreateAPIView):
    """إنشاء محادثة جديدة"""
    serializer_class = ConversationCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @extend_schema(
        operation_id="create_conversation",
        summary="Create New Conversation",
        description="Create new conversation with another user",
        tags=["Messaging"],
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class MessageListView(generics.ListAPIView):
    """قائمة رسائل المحادثة"""
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [OrderingFilter]
    ordering = ['created_at']
    
    def get_queryset(self):
        conversation_id = self.kwargs['conversation_id']
        return Message.objects.filter(
            conversation_id=conversation_id,
            conversation__participants=self.request.user
        ).select_related('sender').prefetch_related('attachments', 'reactions')
    
    @extend_schema(
        operation_id="list_conversation_messages",
        summary="List Conversation Messages",
        description="Get messages list for specific conversation",
        tags=["Messaging"],
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class MessageCreateView(generics.CreateAPIView):
    """إنشاء رسالة جديدة"""
    serializer_class = MessageCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        
        # Get conversation and validate user access
        conversation_id = self.kwargs['conversation_id']
        try:
            conversation = Conversation.objects.get(
                id=conversation_id,
                participants=self.request.user
            )
            context['conversation'] = conversation
        except Conversation.DoesNotExist:
            raise permissions.PermissionDenied("Conversation not found or access denied")
        
        return context
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Create the message
        message = serializer.save()
        
        # Refetch message with related objects to avoid RelatedManager issues
        message = Message.objects.select_related('sender').prefetch_related('attachments', 'reactions').get(id=message.id)
        
        # Update conversation timestamp
        conversation = message.conversation
        conversation.updated_at = timezone.now()
        conversation.save()
        
        # Send real-time notification via WebSocket
        channel_layer = get_channel_layer()
        if channel_layer:
            # Create simplified message data for WebSocket
            message_data = {
                'id': message.id,
                'conversation': message.conversation.id,
                'sender': {
                    'id': message.sender.id,
                    'username': message.sender.username,
                    'first_name': message.sender.first_name,
                    'last_name': message.sender.last_name,
                    'avatar': message.sender.avatar.url if message.sender.avatar else None,
                    'user_type': getattr(message.sender, 'user_type', 'user'),
                    'is_verified': getattr(message.sender, 'is_verified', False),
                    'is_available': getattr(message.sender, 'is_available', True)
                },
                'content': message.content,
                'message_type': message.message_type,
                'is_read': False,
                'is_edited': message.is_edited,
                'is_deleted': message.is_deleted,
                'attachments': [],
                'reactions': [],
                'created_at': message.created_at.isoformat(),
                'updated_at': message.updated_at.isoformat()
            }
            
            # Send to conversation group
            conversation_group_name = f'chat_{conversation.id}'
            async_to_sync(channel_layer.group_send)(
                conversation_group_name,
                {
                    'type': 'new_message',
                    'message': message_data
                }
            )
        
        # Use MessageResponseSerializer for the response to properly handle related fields
        response_serializer = MessageResponseSerializer(message, context={'request': request})
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
    
    @extend_schema(
        operation_id="create_message",
        summary="Create New Message",
        description="Create new message in conversation",
        tags=["Messaging"],
    )
    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


class MessageUpdateView(generics.UpdateAPIView):
    """Update message"""
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Message.objects.filter(
            sender=self.request.user,
            conversation__participants=self.request.user
        )
    
    def update(self, request, *args, **kwargs):
        # Only allow updating within 5 minutes of sending
        instance = self.get_object()
        time_diff = timezone.now() - instance.created_at
        
        if time_diff.total_seconds() > 300:  # 5 minutes
            return Response({
                'error': 'Messages can only be edited within 5 minutes of sending'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        return super().update(request, *args, **kwargs)
    
    @extend_schema(
        operation_id="update_message",
        summary="Update Message",
        description="Update message (within 5 minutes of sending)",
        tags=["Messaging"],
    )
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)
    
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)


class MessageDeleteView(generics.DestroyAPIView):
    """حذف الرسالة"""
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Message.objects.filter(
            sender=self.request.user,
            conversation__participants=self.request.user
        )
    
    def destroy(self, request, *args, **kwargs):
        # Only allow deleting within 10 minutes of sending
        instance = self.get_object()
        time_diff = timezone.now() - instance.created_at
        
        if time_diff.total_seconds() > 600:  # 10 minutes
            return Response({
                'error': 'Messages can only be deleted within 10 minutes of sending'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        return super().destroy(request, *args, **kwargs)
    
    @extend_schema(
        operation_id="delete_message",
        summary="Delete Message",
        description="Delete message (within 10 minutes of sending)",
        tags=["Messaging"],
    )
    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)


class MarkMessagesReadView(APIView):
    """Mark messages as read"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MessageSerializer
    
    @extend_schema(
        operation_id="mark_messages_read",
        summary="Mark messages as read",
        description="Mark all conversation messages as read",
        tags=["Messages"],
    )
    def post(self, request, conversation_id):
        try:
            conversation = Conversation.objects.get(
                id=conversation_id,
                participants=request.user
            )
            
            # Get unread messages (not sent by user and not already read)
            unread_messages = Message.objects.filter(
                conversation=conversation
            ).exclude(sender=request.user).exclude(
                read_statuses__user=request.user
            )
            
            # Create read status for unread messages
            read_statuses_to_create = [
                MessageReadStatus(user=request.user, message=message)
                for message in unread_messages
            ]
            
            created_count = 0
            if read_statuses_to_create:
                MessageReadStatus.objects.bulk_create(read_statuses_to_create, ignore_conflicts=True)
                created_count = len(read_statuses_to_create)
            
            return Response({
                'message': f'{created_count} messages marked as read',
                'updated_count': created_count
            })
            
        except Conversation.DoesNotExist:
            return Response({
                'error': 'Conversation not found'
            }, status=status.HTTP_404_NOT_FOUND)


class MessageBulkActionView(APIView):
    """إجراءات متعددة على الرسائل"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MessageBulkActionSerializer
    
    @extend_schema(
        operation_id="message_bulk_action",
        summary="إجراءات متعددة على الرسائل",
        description="تنفيذ إجراءات متعددة على مجموعة من الرسائل",
        tags=["Messages"],
        request=MessageBulkActionSerializer,
    )
    def post(self, request):
        serializer = MessageBulkActionSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            message_ids = serializer.validated_data['message_ids']
            action = serializer.validated_data['action']
            
            # Get messages that belong to user's conversations
            messages = Message.objects.filter(
                id__in=message_ids,
                conversation__participants=request.user
            )
            
            if action == 'mark_read':
                # Create read statuses for messages not already read by user
                unread_messages = messages.exclude(read_statuses__user=request.user)
                read_statuses_to_create = [
                    MessageReadStatus(user=request.user, message=message)
                    for message in unread_messages
                ]
                created_count = 0
                if read_statuses_to_create:
                    MessageReadStatus.objects.bulk_create(read_statuses_to_create, ignore_conflicts=True)
                    created_count = len(read_statuses_to_create)
                message = f'{created_count} messages marked as read'
                updated_count = created_count
                
            elif action == 'mark_unread':
                # Remove read statuses for messages
                deleted_count = MessageReadStatus.objects.filter(
                    user=request.user,
                    message__in=messages
                ).delete()[0]
                message = f'{deleted_count} messages marked as unread'
                updated_count = deleted_count
                
            elif action == 'delete':
                # Only allow deleting own messages
                user_messages = messages.filter(sender=request.user)
                deleted_count = user_messages.count()
                user_messages.delete()
                message = f'{deleted_count} messages deleted'
                updated_count = deleted_count
            
            return Response({
                'message': message,
                'action': action,
                'processed_count': updated_count
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    operation_id="conversation_stats",
    summary="إحصائيات المحادثات",
    description="عرض إحصائيات المحادثات للمستخدم الحالي",
    tags=["Conversations"],
    responses={200: ConversationStatsSerializer}
)
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def conversation_stats(request):
    """إحصائيات المحادثات"""
    user = request.user
    
    # Get user's conversations
    conversations = Conversation.objects.filter(participants=user)
    
    # Calculate stats
    total_conversations = conversations.count()
    
    # Conversations with unread messages
    unread_conversations = conversations.filter(
        messages__isnull=False
    ).exclude(
        messages__read_statuses__user=user
    ).exclude(messages__sender=user).distinct().count()
    
    # Total messages
    total_messages = Message.objects.filter(
        conversation__participants=user
    ).count()
    
    # Unread messages
    unread_messages = Message.objects.filter(
        conversation__participants=user
    ).exclude(
        read_statuses__user=user
    ).exclude(sender=user).count()
    
    # Active conversations (with messages in last 30 days)
    thirty_days_ago = timezone.now() - timezone.timedelta(days=30)
    active_conversations = conversations.filter(
        messages__created_at__gte=thirty_days_ago
    ).distinct().count()
    
    # Recent activity (last 7 days)
    seven_days_ago = timezone.now() - timezone.timedelta(days=7)
    recent_messages = Message.objects.filter(
        conversation__participants=user,
        created_at__gte=seven_days_ago
    ).extra(
        select={'day': 'date(created_at)'}
    ).values('day').annotate(count=Count('id')).order_by('day')
    
    recent_activity = {item['day']: item['count'] for item in recent_messages}
    
    stats = {
        'total_conversations': total_conversations,
        'unread_conversations': unread_conversations,
        'total_messages': total_messages,
        'unread_messages': unread_messages,
        'active_conversations': active_conversations,
        'recent_activity': recent_activity
    }
    
    serializer = ConversationStatsSerializer(stats)
    return Response(serializer.data)


@extend_schema(
    operation_id="conversation_search",
    summary="البحث في المحادثات",
    description="البحث في المحادثات بمعايير مختلفة",
    tags=["Conversations"],
    parameters=[
        OpenApiParameter(name="query", type=OpenApiTypes.STR, required=False),
        OpenApiParameter(name="participant", type=OpenApiTypes.STR, required=False),
        OpenApiParameter(name="project_id", type=OpenApiTypes.INT, required=False),
        OpenApiParameter(name="has_unread", type=OpenApiTypes.BOOL, required=False),
        OpenApiParameter(name="date_from", type=OpenApiTypes.DATE, required=False),
        OpenApiParameter(name="date_to", type=OpenApiTypes.DATE, required=False),
    ],
    responses={200: ConversationSerializer(many=True)}
)
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def conversation_search(request):
    """البحث في المحادثات"""
    serializer = ConversationSearchSerializer(data=request.query_params)
    
    if serializer.is_valid():
        data = serializer.validated_data
        
        # Start with user's conversations
        queryset = Conversation.objects.filter(
            participants=request.user
        ).select_related('project').prefetch_related('participants')
        
        # Apply search filters
        if data.get('query'):
            queryset = queryset.filter(
                Q(messages__content__icontains=data['query']) |
                Q(participants__first_name__icontains=data['query']) |
                Q(participants__last_name__icontains=data['query']) |
                Q(project__title__icontains=data['query'])
            ).distinct()
        
        if data.get('participant'):
            queryset = queryset.filter(
                participants__username__icontains=data['participant']
            )
        
        if data.get('project_id'):
            queryset = queryset.filter(project_id=data['project_id'])
        
        if data.get('has_unread'):
            if data['has_unread']:
                queryset = queryset.filter(
                    messages__isnull=False
                ).exclude(
                    messages__read_statuses__user=request.user
                ).exclude(messages__sender=request.user).distinct()
            else:
                # Conversations with no unread messages
                queryset = queryset.exclude(
                    messages__isnull=False,
                    messages__read_statuses__user__isnull=True
                ).exclude(messages__sender=request.user).distinct()
        
        if data.get('date_from'):
            queryset = queryset.filter(
                messages__created_at__date__gte=data['date_from']
            )
        
        if data.get('date_to'):
            queryset = queryset.filter(
                messages__created_at__date__lte=data['date_to']
            )
        
        # Order by last message
        queryset = queryset.annotate(
            last_message_time=Max('messages__created_at')
        ).order_by('-last_message_time')
        
        # Paginate results
        from rest_framework.pagination import PageNumberPagination
        paginator = PageNumberPagination()
        paginator.page_size = 20
        
        page = paginator.paginate_queryset(queryset, request)
        if page is not None:
            serializer = ConversationSerializer(page, many=True, context={'request': request})
            return paginator.get_paginated_response(serializer.data)
        
        serializer = ConversationSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    operation_id="start_conversation_with_user",
    summary="بدء محادثة مع مستخدم",
    description="بدء محادثة جديدة مع مستخدم محدد أو العثور على محادثة موجودة",
    tags=["Conversations"],
    responses={200: ConversationSerializer, 201: ConversationSerializer}
)
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def start_conversation_with_user(request, user_id):
    """بدء محادثة مع مستخدم محدد"""
    try:
        recipient = User.objects.get(id=user_id)
        project_id = request.data.get('project_id')
        
        if recipient == request.user:
            return Response({
                'error': 'Cannot start conversation with yourself'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if conversation already exists for this project
        if project_id:
            existing_conversation = Conversation.objects.filter(
                participants__in=[request.user, recipient],
                project_id=project_id
            ).annotate(
                participant_count=Count('participants')
            ).filter(participant_count=2).first()
        else:
            # Check if conversation already exists without project
            existing_conversation = Conversation.objects.filter(
                participants__in=[request.user, recipient],
                project__isnull=True
            ).annotate(
                participant_count=Count('participants')
            ).filter(participant_count=2).first()
        
        if existing_conversation:
            serializer = ConversationSerializer(
                existing_conversation,
                context={'request': request}
            )
            return Response({
                'conversation': serializer.data,
                'created': False
            })
        
        # Create new conversation
        conversation_data = {}
        if project_id:
            try:
                from projects.models import Project
                project = Project.objects.get(id=project_id)
                conversation_data['project'] = project
                conversation_data['title'] = f"Project: {project.title}"
            except Project.DoesNotExist:
                pass
        
        conversation = Conversation.objects.create(**conversation_data)
        conversation.participants.add(request.user, recipient)
        
        # Send initial message if provided
        initial_message = request.data.get('initial_message')
        if initial_message:
            Message.objects.create(
                conversation=conversation,
                sender=request.user,
                content=initial_message
            )
        
        serializer = ConversationSerializer(
            conversation,
            context={'request': request}
        )
        return Response({
            'conversation': serializer.data,
            'created': True
        }, status=status.HTTP_201_CREATED)
        
    except User.DoesNotExist:
        return Response({
            'error': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)


@extend_schema(
    operation_id="delete_conversation",
    summary="Delete Conversation",
    description="Delete existing conversation",
    tags=["Messaging"],
    request={
        'type': 'object',
        'properties': {}
    }
)
@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def delete_conversation(request, conversation_id):
    """حذف المحادثة"""
    try:
        conversation = Conversation.objects.get(
            id=conversation_id,
            participants=request.user
        )
        
        # Delete all messages first
        Message.objects.filter(conversation=conversation).delete()
        
        # Delete the conversation
        conversation.delete()
        
        return Response({
            'message': 'Conversation deleted successfully'
        }, status=status.HTTP_200_OK)
        
    except Conversation.DoesNotExist:
        return Response({
            'error': 'Conversation not found'
        }, status=status.HTTP_404_NOT_FOUND)


@extend_schema(
    operation_id="message_stats",
    summary="Message Statistics",
    description="Get message statistics for current user",
    tags=["Messaging"],
    responses={200: {
        'type': 'object',
        'properties': {
            'total_messages': {'type': 'integer'},
            'unread_messages': {'type': 'integer'},
            'total_conversations': {'type': 'integer'},
            'active_conversations': {'type': 'integer'},
            'messages_this_week': {'type': 'integer'},
            'messages_this_month': {'type': 'integer'},
            'average_response_time': {'type': 'number'},
            'most_active_conversation': {'type': 'object'},
            'recent_activity': {'type': 'array'}
        }
    }}
)
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def message_stats(request):
    """Get message statistics for current user"""
    try:
        user = request.user
        
        # Get basic stats
        total_messages = Message.objects.filter(sender=user).count()
        unread_messages = Message.objects.filter(
            conversation__participants=user
        ).exclude(sender=user).exclude(
            read_statuses__user=user
        ).count()
        
        total_conversations = Conversation.objects.filter(participants=user).count()
        active_conversations = Conversation.objects.filter(
            participants=user,
            updated_at__gte=timezone.now() - timezone.timedelta(days=7)
        ).count()
        
        # Get time-based stats
        week_ago = timezone.now() - timezone.timedelta(days=7)
        month_ago = timezone.now() - timezone.timedelta(days=30)
        
        messages_this_week = Message.objects.filter(
            sender=user,
            created_at__gte=week_ago
        ).count()
        
        messages_this_month = Message.objects.filter(
            sender=user,
            created_at__gte=month_ago
        ).count()
        
        # Calculate average response time (simplified)
        # This would need more complex logic for actual response time calculation
        average_response_time = 2.5  # Placeholder value in hours
        
        # Get most active conversation
        most_active_conversation = None
        try:
            most_active = Conversation.objects.filter(
                participants=user
            ).annotate(
                message_count=Count('messages')
            ).order_by('-message_count').first()
            
            if most_active:
                most_active_conversation = {
                    'id': most_active.id,
                    'title': most_active.title or f"Conversation {most_active.id}",
                    'message_count': most_active.message_count,
                    'last_activity': most_active.updated_at
                }
        except Exception as e:
            print(f"Error getting most active conversation: {e}")
        
        # Get recent activity
        recent_activity = []
        try:
            recent_messages = Message.objects.filter(
                conversation__participants=user
            ).select_related('sender', 'conversation').order_by('-created_at')[:5]
            
            for message in recent_messages:
                recent_activity.append({
                    'id': message.id,
                    'sender': {
                        'id': message.sender.id,
                        'name': f"{message.sender.first_name} {message.sender.last_name}"
                    },
                    'conversation': {
                        'id': message.conversation.id,
                        'title': message.conversation.title or f"Conversation {message.conversation.id}"
                    },
                    'content': message.content[:50] + '...' if len(message.content) > 50 else message.content,
                    'created_at': message.created_at,
                    'is_sender': message.sender == user
                })
        except Exception as e:
            print(f"Error getting recent activity: {e}")
        
        stats = {
            'total_messages': total_messages,
            'unread_messages': unread_messages,
            'total_conversations': total_conversations,
            'active_conversations': active_conversations,
            'messages_this_week': messages_this_week,
            'messages_this_month': messages_this_month,
            'average_response_time': average_response_time,
            'most_active_conversation': most_active_conversation,
            'recent_activity': recent_activity
        }
        
        return Response(stats, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"Error in message_stats: {e}")
        return Response({
            'error': 'Failed to get message statistics',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@extend_schema(
    operation_id="send_message",
    summary="Send Message",
    description="Send a message to a user and create or find conversation",
    tags=["Messages"],
    request={
        'type': 'object',
        'properties': {
            'recipient': {'type': 'integer', 'description': 'Recipient user ID'},
            'conversation_id': {'type': 'integer', 'description': 'Conversation ID'},
            'message': {'type': 'string', 'description': 'Message content'},
            'project_id': {'type': 'integer', 'description': 'Project ID (optional)'},
            'attachments': {'type': 'array', 'items': {'type': 'file'}, 'description': 'Message attachments'}
        },
        'required': ['message']
    },
    responses={200: MessageSerializer, 201: MessageSerializer}
)
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def send_message(request):
    """إرسال رسالة لمستخدم محدد مع دعم المرفقات"""
    try:
        print(f"DEBUG: Request data: {request.data}")
        print(f"DEBUG: Request files: {request.FILES}")
        print(f"DEBUG: Request user: {request.user}")
        
        recipient_id = request.data.get('recipient')
        conversation_id = request.data.get('conversation_id')
        message_text = request.data.get('message', '')
        project_id = request.data.get('project_id')
        attachments = request.FILES.getlist('attachments')
        
        print(f"DEBUG: recipient_id: {recipient_id}")
        print(f"DEBUG: conversation_id: {conversation_id}")
        print(f"DEBUG: message_text: {message_text}")
        print(f"DEBUG: project_id: {project_id}")
        print(f"DEBUG: attachments count: {len(attachments)}")
        
        # Check if we have either recipient or conversation_id
        if not recipient_id and not conversation_id:
            print(f"DEBUG: Missing required fields - recipient_id: {recipient_id}, conversation_id: {conversation_id}")
            return Response({
                'error': 'Either recipient or conversation_id is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not message_text and not attachments:
            print(f"DEBUG: Missing message text and attachments")
            return Response({
                'error': 'Message content or attachments are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # If conversation_id is provided, use existing conversation
        if conversation_id:
            try:
                conversation = Conversation.objects.get(id=conversation_id)
                # Check if user is participant
                if request.user not in conversation.participants.all():
                    return Response({
                        'error': 'You are not a participant in this conversation'
                    }, status=status.HTTP_403_FORBIDDEN)
            except Conversation.DoesNotExist:
                return Response({
                    'error': 'Conversation not found'
                }, status=status.HTTP_404_NOT_FOUND)
        else:
            # Get recipient user
            try:
                recipient = User.objects.get(id=recipient_id)
            except User.DoesNotExist:
                return Response({
                    'error': 'Recipient user not found'
                }, status=status.HTTP_404_NOT_FOUND)
            
            if recipient == request.user:
                return Response({
                    'error': 'Cannot send message to yourself'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Find or create conversation
            conversation = Conversation.objects.filter(
                participants__in=[request.user, recipient]
            ).annotate(
                participant_count=Count('participants')
            ).filter(participant_count=2).first()
            
            if not conversation:
                # Create new conversation
                conversation = Conversation.objects.create()
                conversation.participants.add(request.user, recipient)
        
        # Add project to conversation if provided
        if project_id:
            try:
                from projects.models import Project
                project = Project.objects.get(id=project_id)
                conversation.project = project
                conversation.save()
            except Project.DoesNotExist:
                pass  # Continue without project if not found
        
        # Create message
        message = Message.objects.create(
            conversation=conversation,
            sender=request.user,
            content=message_text or ''
        )
        
        # Create attachments if any
        for attachment_file in attachments:
            # Validate file size
            if attachment_file.size > 10 * 1024 * 1024:  # 10MB limit
                continue  # Skip oversized files
            
            # Validate file type
            allowed_types = [
                'image/jpeg', 'image/png', 'image/gif', 'image/webp',
                'application/pdf', 'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'text/plain', 'video/mp4', 'video/avi', 'video/mov',
                'audio/mpeg', 'audio/wav', 'audio/mp3'
            ]
            
            if attachment_file.content_type not in allowed_types:
                continue  # Skip unsupported file types
            
            # Create attachment
            MessageAttachment.objects.create(
                message=message,
                file=attachment_file,
                original_filename=attachment_file.name,
                file_size=attachment_file.size,
                file_type='image' if attachment_file.content_type.startswith('image/') else 'document',
                mime_type=attachment_file.content_type
            )
        
        # Update conversation timestamp
        conversation.updated_at = timezone.now()
        conversation.save()
        
        # Return message with attachments
        serializer = MessageSerializer(message)
        return Response({
            'message': serializer.data,
            'conversation_id': conversation.id
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        print(f"DEBUG: Exception in send_message: {str(e)}")
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def add_message_reaction(request, message_id):
    """Add reaction to a message"""
    try:
        message = Message.objects.get(id=message_id)
        
        # Check if user is participant in conversation
        if request.user not in message.conversation.participants.all():
            return Response(
                {'error': 'You are not a participant in this conversation'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        reaction_type = request.data.get('reaction')
        if not reaction_type:
            return Response(
                {'error': 'Reaction type is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate reaction type
        valid_reactions = [choice[0] for choice in MessageReaction.REACTION_TYPES]
        if reaction_type not in valid_reactions:
            return Response(
                {'error': 'Invalid reaction type'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create or update reaction
        reaction, created = MessageReaction.objects.get_or_create(
            message=message,
            user=request.user,
            defaults={'reaction': reaction_type}
        )
        
        if not created:
            # Update existing reaction
            reaction.reaction = reaction_type
            reaction.save()
        
        serializer = MessageReactionSerializer(reaction)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
    except Message.DoesNotExist:
        return Response(
            {'error': 'Message not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def remove_message_reaction(request, message_id, reaction_id):
    """Remove reaction from a message"""
    try:
        reaction = MessageReaction.objects.get(id=reaction_id, message_id=message_id)
        
        # Check if user owns the reaction
        if reaction.user != request.user:
            return Response(
                {'error': 'You can only remove your own reactions'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        reaction.delete()
        return Response({'message': 'Reaction removed'}, status=status.HTTP_200_OK)
        
    except MessageReaction.DoesNotExist:
        return Response(
            {'error': 'Reaction not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def upload_message_attachment(request, conversation_id):
    """Upload attachment for a message"""
    try:
        conversation = Conversation.objects.get(id=conversation_id)
        
        # Check if user is participant
        if request.user not in conversation.participants.all():
            return Response(
                {'error': 'You are not a participant in this conversation'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        file = request.FILES.get('file')
        if not file:
            return Response(
                {'error': 'File is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate file
        if file.size > 10 * 1024 * 1024:  # 10MB limit
            return Response(
                {'error': 'File size cannot exceed 10MB'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        allowed_types = [
            'image/jpeg', 'image/png', 'image/gif', 'image/webp',
            'application/pdf', 'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain', 'video/mp4', 'video/avi', 'video/mov',
            'audio/mpeg', 'audio/wav', 'audio/mp3'
        ]
        
        if file.content_type not in allowed_types:
            return Response(
                {'error': 'File type not allowed'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create attachment
        attachment = MessageAttachment.objects.create(
            message=None,  # Will be set when message is created
            file=file,
            original_filename=file.name,
            file_size=file.size,
            file_type='image' if file.content_type.startswith('image/') else 'document',
            mime_type=file.content_type
        )
        
        serializer = MessageAttachmentSerializer(attachment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
    except Conversation.DoesNotExist:
        return Response(
            {'error': 'Conversation not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def mark_conversation_as_read(request, conversation_id):
    """Mark all messages in a conversation as read for the current user"""
    try:
        conversation = Conversation.objects.get(id=conversation_id)
        
        # Check if user is a participant
        if request.user not in conversation.participants.all():
            return Response(
                {'error': 'You are not a participant in this conversation'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Mark all unread messages as read
        unread_messages = Message.objects.filter(
            conversation=conversation,
            created_at__gt=ConversationReadTime.objects.get_or_create(
                user=request.user,
                conversation=conversation,
                defaults={'last_read_at': timezone.now()}
            )[0].last_read_at
        ).exclude(sender=request.user)
        
        # Create read status for all unread messages
        read_statuses = []
        for message in unread_messages:
            read_statuses.append(MessageReadStatus(
                user=request.user,
                message=message
            ))
        
        if read_statuses:
            MessageReadStatus.objects.bulk_create(read_statuses, ignore_conflicts=True)
        
        # Update last read time
        ConversationReadTime.objects.update_or_create(
            user=request.user,
            conversation=conversation,
            defaults={'last_read_at': timezone.now()}
        )
        
        return Response({'message': 'Conversation marked as read'}, status=status.HTTP_200_OK)
        
    except Conversation.DoesNotExist:
        return Response(
            {'error': 'Conversation not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
