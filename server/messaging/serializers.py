from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.db.models import Q
from .models import Conversation, Message, MessageReadStatus, MessageAttachment, MessageReaction
import os

User = get_user_model()


class UserBasicSerializer(serializers.ModelSerializer):
    """Serializer أساسي لبيانات المستخدم"""
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'first_name', 'last_name', 
            'avatar', 'user_type', 'is_verified', 'is_available'
        ]


class MessageAttachmentSerializer(serializers.ModelSerializer):
    """Serializer لمرفقات الرسائل"""
    file_url = serializers.SerializerMethodField()
    file_size_formatted = serializers.CharField(read_only=True)
    
    class Meta:
        model = MessageAttachment
        fields = [
            'id', 'file', 'file_url', 'original_filename', 'file_size', 
            'file_size_formatted', 'file_type', 'mime_type', 'width', 
            'height', 'duration', 'thumbnail', 'created_at'
        ]
        read_only_fields = ['id', 'file_size', 'file_size_formatted', 'created_at']
    
    def get_file_url(self, obj):
        """Get file URL"""
        if obj.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
        return None


class MessageReactionSerializer(serializers.ModelSerializer):
    """Serializer لتفاعلات الرسائل"""
    user = UserBasicSerializer(read_only=True)
    
    class Meta:
        model = MessageReaction
        fields = ['id', 'reaction', 'user', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']


class MessageSerializer(serializers.ModelSerializer):
    """Serializer للرسائل"""
    sender = UserBasicSerializer(read_only=True)
    is_read = serializers.SerializerMethodField()
    attachments = serializers.SerializerMethodField()
    reactions = serializers.SerializerMethodField()
    reply_to = serializers.SerializerMethodField()
    
    class Meta:
        model = Message
        fields = [
            'id', 'conversation', 'sender', 'content', 'message_type',
            'is_read', 'is_edited', 'is_deleted', 'attachments', 
            'reactions', 'reply_to', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'sender', 'created_at', 'updated_at']
    
    def get_is_read(self, obj):
        """Check if message is read by current user"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return MessageReadStatus.objects.filter(
                user=request.user,
                message=obj
            ).exists()
        return False
    
    def get_attachments(self, obj):
        """Get message attachments"""
        return []  # Return empty list for now to avoid RelatedManager issues
    
    def get_reactions(self, obj):
        """Get message reactions"""
        try:
            reactions = obj.reactions.all()
            return MessageReactionSerializer(reactions, many=True, context=self.context).data
        except:
            return []
    
    def get_reply_to(self, obj):
        """Get reply message if exists"""
        if obj.reply_to:
            return {
                'id': obj.reply_to.id,
                'content': obj.reply_to.content,
                'sender': {
                    'id': obj.reply_to.sender.id,
                    'name': obj.reply_to.sender.get_full_name()
                }
            }
        return None
    
    def validate_content(self, value):
        """Validate message content"""
        # Allow empty content if there are attachments
        if value and len(value) > 2000:
            raise serializers.ValidationError("Message content is too long")
        
        return value.strip() if value else ''


class MessageResponseSerializer(serializers.ModelSerializer):
    """Serializer for message response after creation"""
    sender = UserBasicSerializer(read_only=True)
    is_read = serializers.SerializerMethodField()
    attachments = serializers.SerializerMethodField()
    reactions = serializers.SerializerMethodField()
    reply_to = serializers.SerializerMethodField()
    
    class Meta:
        model = Message
        fields = [
            'id', 'conversation', 'sender', 'content', 'message_type',
            'is_read', 'is_edited', 'is_deleted', 'attachments', 
            'reactions', 'reply_to', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'sender', 'created_at', 'updated_at']
    
    def get_is_read(self, obj):
        """Check if message is read by current user"""
        return False  # New message is always unread
    
    def get_attachments(self, obj):
        """Get message attachments"""
        try:
            attachments = obj.attachments.all()
            return MessageAttachmentSerializer(attachments, many=True, context=self.context).data
        except:
            return []
    
    def get_reactions(self, obj):
        """Get message reactions"""
        return []  # New message has no reactions
    
    def get_reply_to(self, obj):
        """Get reply message if exists"""
        if obj.reply_to:
            return {
                'id': obj.reply_to.id,
                'content': obj.reply_to.content,
                'sender': {
                    'id': obj.reply_to.sender.id,
                    'name': obj.reply_to.sender.get_full_name()
                }
            }
        return None


class MessageCreateSerializer(serializers.ModelSerializer):
    """Serializer لإنشاء الرسائل مع دعم المرفقات"""
    attachments = serializers.ListField(
        child=serializers.FileField(),
        required=False,
        max_length=5  # Maximum 5 attachments per message
    )
    reply_to_id = serializers.IntegerField(required=False)
    
    class Meta:
        model = Message
        fields = ['content', 'message_type', 'attachments', 'reply_to_id']
    
    def validate_content(self, value):
        """Validate message content"""
        if not value or not value.strip():
            raise serializers.ValidationError("Message content cannot be empty")
        
        if len(value) > 2000:
            raise serializers.ValidationError("Message content is too long")
        
        return value.strip()
    
    def validate_attachments(self, value):
        """Validate attachments"""
        if value:
            total_size = sum(file.size for file in value)
            if total_size > 50 * 1024 * 1024:  # 50MB total limit
                raise serializers.ValidationError("Total file size cannot exceed 50MB")
            
            allowed_types = [
                'image/jpeg', 'image/png', 'image/gif', 'image/webp',
                'application/pdf', 'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'text/plain', 'video/mp4', 'video/avi', 'video/mov',
                'audio/mpeg', 'audio/wav', 'audio/mp3'
            ]
            
            for file in value:
                if file.content_type not in allowed_types:
                    raise serializers.ValidationError(f"File type {file.content_type} not allowed")
        
        return value
    
    def validate_reply_to_id(self, value):
        """Validate reply message exists and belongs to same conversation"""
        if value:
            try:
                reply_message = Message.objects.get(id=value)
                # Check if reply message belongs to the same conversation
                conversation = self.context.get('conversation')
                if reply_message.conversation != conversation:
                    raise serializers.ValidationError("Reply message must belong to the same conversation")
            except Message.DoesNotExist:
                raise serializers.ValidationError("Reply message not found")
        
        return value
    
    def validate(self, data):
        """Validate that either content or attachments are provided"""
        content = data.get('content', '').strip()
        attachments = data.get('attachments', [])
        
        if not content and not attachments:
            raise serializers.ValidationError("Either message content or attachments must be provided")
        
        return data
    
    def create(self, validated_data):
        attachments = validated_data.pop('attachments', [])
        reply_to_id = validated_data.pop('reply_to_id', None)
        
        # Set conversation and sender from context
        validated_data['conversation'] = self.context['conversation']
        validated_data['sender'] = self.context['request'].user
        
        # Set reply_to if provided
        if reply_to_id:
            validated_data['reply_to_id'] = reply_to_id
        
        # Create message
        message = super().create(validated_data)
        
        # Create attachments
        for file in attachments:
            MessageAttachment.objects.create(
                message=message,
                file=file,
                original_filename=file.name,
                file_size=file.size,
                file_type=self._get_file_type(file.content_type),
                mime_type=file.content_type
            )
        
        return message
    
    def _get_file_type(self, mime_type):
        """Determine file type from MIME type"""
        if mime_type.startswith('image/'):
            return 'image'
        elif mime_type.startswith('video/'):
            return 'video'
        elif mime_type.startswith('audio/'):
            return 'audio'
        elif mime_type == 'application/pdf':
            return 'document'
        else:
            return 'document'


class ConversationSerializer(serializers.ModelSerializer):
    """Serializer للمحادثات"""
    participants = UserBasicSerializer(many=True, read_only=True)
    project_info = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()
    other_participant = serializers.SerializerMethodField()
    
    class Meta:
        model = Conversation
        fields = [
            'id', 'participants', 'project_info', 'last_message',
            'unread_count', 'other_participant', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_project_info(self, obj):
        """Get project information if available"""
        if obj.project:
            return {
                'id': obj.project.id,
                'title': obj.project.title,
                'slug': obj.project.slug,
                'status': obj.project.status
            }
        return None
    
    def get_last_message(self, obj):
        """Get last message in conversation"""
        last_message = obj.messages.first()
        if last_message:
            # Check if message is read by current user
            request = self.context.get('request')
            is_read = False
            if request and request.user.is_authenticated:
                is_read = MessageReadStatus.objects.filter(
                    user=request.user,
                    message=last_message
                ).exists()
            
            return {
                'id': last_message.id,
                'content': last_message.content,
                'sender': {
                    'id': last_message.sender.id,
                    'name': last_message.sender.get_full_name()
                },
                'created_at': last_message.created_at,
                'is_read': is_read
            }
        return None
    
    def get_unread_count(self, obj):
        """Get unread messages count for current user"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            # Get messages that are not read by current user and not sent by current user
            read_message_ids = MessageReadStatus.objects.filter(
                user=request.user,
                message__conversation=obj
            ).values_list('message_id', flat=True)
            
            return obj.messages.exclude(
                id__in=read_message_ids
            ).exclude(sender=request.user).count()
        return 0
    
    def get_other_participant(self, obj):
        """Get the other participant in the conversation"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            other_participant = obj.participants.exclude(id=request.user.id).first()
            if other_participant:
                return UserBasicSerializer(other_participant).data
        return None


class ConversationDetailSerializer(serializers.ModelSerializer):
    """Serializer تفصيلي للمحادثة"""
    participants = UserBasicSerializer(many=True, read_only=True)
    messages = MessageSerializer(many=True, read_only=True)
    project_info = serializers.SerializerMethodField()
    other_participant = serializers.SerializerMethodField()
    
    class Meta:
        model = Conversation
        fields = [
            'id', 'participants', 'messages', 'project_info',
            'other_participant', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_project_info(self, obj):
        """Get project information if available"""
        if obj.project:
            return {
                'id': obj.project.id,
                'title': obj.project.title,
                'slug': obj.project.slug,
                'status': obj.project.status,
                'client': {
                    'id': obj.project.client.id,
                    'name': obj.project.client.get_full_name()
                }
            }
        return None
    
    def get_other_participant(self, obj):
        """Get the other participant in the conversation"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            other_participant = obj.participants.exclude(id=request.user.id).first()
            if other_participant:
                return UserBasicSerializer(other_participant).data
        return None


class ConversationCreateSerializer(serializers.ModelSerializer):
    """Serializer لإنشاء محادثة جديدة"""
    recipient_id = serializers.IntegerField(write_only=True)
    project_id = serializers.IntegerField(required=False, write_only=True)
    initial_message = serializers.CharField(write_only=True)
    
    class Meta:
        model = Conversation
        fields = ['recipient_id', 'project_id', 'initial_message']
    
    def validate_recipient_id(self, value):
        """Validate recipient exists and is not the current user"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            if value == request.user.id:
                raise serializers.ValidationError("Cannot create conversation with yourself")
            
            try:
                User.objects.get(id=value)
            except User.DoesNotExist:
                raise serializers.ValidationError("Recipient not found")
        
        return value
    
    def validate_project_id(self, value):
        """Validate project exists and user has access"""
        if value:
            from projects.models import Project
            request = self.context.get('request')
            try:
                project = Project.objects.get(id=value)
                # Check if user is involved in the project
                if (request.user != project.client and 
                    request.user != project.assigned_professional):
                    raise serializers.ValidationError("You don't have access to this project")
            except Project.DoesNotExist:
                raise serializers.ValidationError("Project not found")
        
        return value
    
    def validate_initial_message(self, value):
        """Validate initial message content"""
        if not value or not value.strip():
            raise serializers.ValidationError("Initial message cannot be empty")
        
        if len(value) > 2000:
            raise serializers.ValidationError("Initial message is too long")
        
        return value.strip()
    
    def create(self, validated_data):
        recipient_id = validated_data.pop('recipient_id')
        project_id = validated_data.pop('project_id', None)
        initial_message = validated_data.pop('initial_message')
        
        request = self.context.get('request')
        current_user = request.user
        recipient = User.objects.get(id=recipient_id)
        
        # Check if conversation already exists
        existing_conversation = Conversation.objects.filter(
            participants__in=[current_user, recipient]
        ).annotate(
            participant_count=models.Count('participants')
        ).filter(participant_count=2).first()
        
        if existing_conversation:
            # Add initial message to existing conversation
            Message.objects.create(
                conversation=existing_conversation,
                sender=current_user,
                content=initial_message
            )
            return existing_conversation
        
        # Create new conversation
        conversation = Conversation.objects.create()
        
        # Add project if provided
        if project_id:
            from projects.models import Project
            project = Project.objects.get(id=project_id)
            conversation.project = project
            conversation.save()
        
        # Add participants
        conversation.participants.add(current_user, recipient)
        
        # Create initial message
        Message.objects.create(
            conversation=conversation,
            sender=current_user,
            content=initial_message
        )
        
        return conversation


class ConversationStatsSerializer(serializers.Serializer):
    """Serializer لإحصائيات المحادثات"""
    total_conversations = serializers.IntegerField()
    unread_conversations = serializers.IntegerField()
    total_messages = serializers.IntegerField()
    unread_messages = serializers.IntegerField()
    active_conversations = serializers.IntegerField()
    recent_activity = serializers.DictField()


class MessageBulkActionSerializer(serializers.Serializer):
    """Serializer لإجراءات متعددة على الرسائل"""
    message_ids = serializers.ListField(
        child=serializers.IntegerField(),
        min_length=1,
        max_length=100
    )
    action = serializers.ChoiceField(choices=['mark_read', 'mark_unread', 'delete'])
    
    def validate_message_ids(self, value):
        """Validate message IDs belong to user's conversations"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            user_messages = Message.objects.filter(
                conversation__participants=request.user,
                id__in=value
            ).values_list('id', flat=True)
            
            invalid_ids = set(value) - set(user_messages)
            if invalid_ids:
                raise serializers.ValidationError(
                    f"Invalid message IDs: {list(invalid_ids)}"
                )
        
        return value


class ConversationSearchSerializer(serializers.Serializer):
    """Serializer للبحث في المحادثات"""
    query = serializers.CharField(required=False)
    participant = serializers.CharField(required=False)
    project_id = serializers.IntegerField(required=False)
    has_unread = serializers.BooleanField(required=False)
    date_from = serializers.DateField(required=False)
    date_to = serializers.DateField(required=False)
    
    def validate(self, attrs):
        """Validate search parameters"""
        date_from = attrs.get('date_from')
        date_to = attrs.get('date_to')
        
        if date_from and date_to and date_from > date_to:
            raise serializers.ValidationError("date_from cannot be after date_to")
        
        return attrs


# Import models for validation
from django.db import models