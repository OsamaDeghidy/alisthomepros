from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from drf_spectacular.utils import extend_schema
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from django.contrib.auth import get_user_model
from .models import Notification
from .serializers import NotificationSerializer, NotificationUpdateSerializer

User = get_user_model()


class NotificationListView(generics.ListAPIView):
    """قائمة الإشعارات"""
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['type', 'is_read']
    ordering = ['-created_at']
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)
    
    @extend_schema(
        operation_id="list_notifications",
        summary="List Notifications",
        description="Get user's notifications list",
        tags=["Notifications"],
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class NotificationDetailView(generics.RetrieveAPIView):
    """تفاصيل الإشعار"""
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)
    
    @extend_schema(
        operation_id="get_notification_detail",
        summary="Notification Details",
        description="Get specific notification details",
        tags=["Notifications"],
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class NotificationUpdateView(generics.UpdateAPIView):
    """تحديث الإشعار"""
    serializer_class = NotificationUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)
    
    def perform_update(self, serializer):
        if serializer.validated_data.get('is_read'):
            serializer.save(read_at=timezone.now())
        else:
            serializer.save()
    
    @extend_schema(
        operation_id="update_notification",
        summary="Update Notification",
        description="Update notification status",
        tags=["Notifications"],
    )
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def mark_all_read(request):
    """وضع علامة مقروء على جميع الإشعارات"""
    updated_count = Notification.objects.filter(
        user=request.user,
        is_read=False
    ).update(is_read=True, read_at=timezone.now())
    
    return Response({
        'message': f'{updated_count} notifications marked as read',
        'updated_count': updated_count
    })


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def notification_stats(request):
    """إحصائيات الإشعارات"""
    notifications = Notification.objects.filter(user=request.user)
    
    stats = {
        'total_notifications': notifications.count(),
        'unread_notifications': notifications.filter(is_read=False).count(),
        'read_notifications': notifications.filter(is_read=True).count(),
        'notifications_by_type': {}
    }
    
    # Group by type
    for notification_type in Notification.TYPE_CHOICES:
        type_code = notification_type[0]
        type_count = notifications.filter(type=type_code).count()
        stats['notifications_by_type'][type_code] = type_count
    
    return Response(stats)


def send_email_notification(user_email, subject, message, notification_type='system', html_template=None, template_context=None):
    """
    إرسال إشعار عبر البريد الإلكتروني
    """
    try:
        html_message = None
        if html_template and template_context:
            html_message = render_to_string(html_template, template_context)
            # Create plain text version from HTML
            message = strip_tags(html_message)
        
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user_email],
            fail_silently=False,
            html_message=html_message,
        )
        return True
    except Exception as e:
        print(f"خطأ في إرسال البريد الإلكتروني: {e}")
        return False


def send_project_created_notification(user, project):
    """
    إرسال إشعار إنشاء مشروع جديد مع قالب HTML
    """
    try:
        # إنشاء الإشعار في قاعدة البيانات
        notification_title = "Project Created Successfully"
        notification_message = f"Your project '{project.title}' has been successfully created and published."
        
        notification = Notification.objects.create(
            user=user,
            type='project_created',
            title=notification_title,
            message=notification_message,
            data={'project_id': project.id, 'project_slug': project.slug}
        )
        
        # إرسال البريد الإلكتروني مع قالب HTML
        if user.email:
            template_context = {
                'user': user,
                'project': project,
            }
            
            send_email_notification(
                user_email=user.email,
                subject=f"Project Created: {project.title}",
                message=notification_message,
                notification_type='project_created',
                html_template='emails/project_created.html',
                template_context=template_context
            )
            print(f"✅ Project creation notification sent for: {project.title}")
        
        return notification
    except Exception as e:
        print(f"⚠️ Failed to send project creation notification: {str(e)}")
        return None


def send_new_project_notifications_to_providers(project):
    """
    Send notifications to service providers whose user_type matches project required_roles
    """
    try:
        # Get required roles from project
        required_roles = project.required_roles or []
        
        print(f"🔍 Project: {project.title}")
        print(f"🔍 Required roles: {required_roles}")
        print(f"🔍 Project client: {project.client.email} (ID: {project.client.id})")
        
        if not required_roles:
            print(f"⚠️ No required roles specified for project: {project.title}")
            return 0
        
        # Find service providers whose user_type matches required roles
        # Exclude clients and the project creator
        matching_providers = User.objects.filter(
            user_type__in=required_roles,
            is_active=True,
            email_verified=True
        ).exclude(
            id=project.client.id
        ).exclude(
            user_type='client'
        )
        
        print(f"🔍 Found {matching_providers.count()} matching providers")
        for provider in matching_providers:
            print(f"  - {provider.email} ({provider.user_type})")
        
        notification_count = 0
        
        for provider in matching_providers:
            try:
                # Create notification in database
                notification_title = "New Project Available in Your Specialty"
                notification_message = f"A new project '{project.title}' has been published that matches your expertise. Check it out!"
                
                notification = Notification.objects.create(
                    user=provider,
                    type='project_created',
                    title=notification_title,
                    message=notification_message,
                    data={'project_id': project.id, 'project_slug': project.slug}
                )
                
                # Send email notification
                if provider.email:
                    template_context = {
                        'provider': provider,
                        'project': project,
                        'project_url': f"http://localhost:3000/projects/{project.slug}"
                    }
                    
                    send_email_notification(
                        user_email=provider.email,
                        subject="New Project Available in Your Specialty",
                        message=notification_message,
                        notification_type='project_created',
                        html_template='emails/new_project_for_providers.html',
                        template_context=template_context
                    )
                    
                    notification_count += 1
                    
            except Exception as e:
                print(f"⚠️ Failed to send notification to provider {provider.email}: {str(e)}")
                continue
        
        print(f"✅ Sent {notification_count} notifications to matching service providers for project: {project.title}")
        return notification_count
        
    except Exception as e:
        print(f"⚠️ Failed to send project notifications to providers: {str(e)}")
        return 0


def create_and_send_notification(user, title, message, notification_type='system', send_email=True, email_subject=None):
    """
    إنشاء إشعار في قاعدة البيانات وإرساله عبر البريد الإلكتروني
    """
    # إنشاء الإشعار في قاعدة البيانات
    notification = Notification.objects.create(
        user=user,
        type=notification_type,
        title=title,
        message=message
    )
    
    # إرسال البريد الإلكتروني إذا كان مطلوباً
    if send_email and user.email:
        email_subject = email_subject or title
        send_email_notification(
            user_email=user.email,
            subject=email_subject,
            message=message,
            notification_type=notification_type
        )
    
    return notification


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def send_test_notification(request):
    """
    إرسال إشعار تجريبي
    """
    email = request.data.get('email')
    subject = request.data.get('subject', 'إشعار تجريبي من A-List Home Professionals')
    message = request.data.get('message', 'هذا إشعار تجريبي من نظام A-List Home Professionals')
    
    if not email:
        return Response(
            {'error': 'البريد الإلكتروني مطلوب'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    success = send_email_notification(
        user_email=email,
        subject=subject,
        message=message
    )
    
    if success:
        return Response(
            {'message': 'تم إرسال الإشعار بنجاح'},
            status=status.HTTP_200_OK
        )
    else:
        return Response(
            {'error': 'فشل في إرسال الإشعار'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
