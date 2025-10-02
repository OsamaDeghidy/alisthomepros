from celery import shared_task
from django.utils import timezone
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from django.contrib.auth import get_user_model
from .models import Notification
import logging
from .views import broadcast_notification_ws

User = get_user_model()
logger = logging.getLogger(__name__)


@shared_task
def send_project_notifications_async(project_id):
    """
    مهمة خلفية لإرسال الإشعارات لمقدمي الخدمة عند إنشاء مشروع جديد
    """
    try:
        from projects.models import Project
        
        project = Project.objects.get(id=project_id)
        
        # Get required roles from project
        required_roles = project.required_roles or []
        
        logger.info(f"🔍 Processing notifications for project: {project.title}")
        logger.info(f"🔍 Required roles: {required_roles}")
        
        if not required_roles:
            logger.warning(f"⚠️ No required roles specified for project: {project.title}")
            return {'status': 'skipped', 'reason': 'no_required_roles', 'count': 0}
        
        # Convert frontend role format to backend format
        # Frontend uses 'home-pro', 'crew-member' but database has 'home_pro', 'crew_member'
        converted_roles = []
        for role in required_roles:
            if role == 'home-pro':
                converted_roles.append('home_pro')
            elif role == 'crew-member':
                converted_roles.append('crew_member')
            else:
                converted_roles.append(role)
        
        logger.info(f"🔄 Converted roles: {converted_roles}")
        
        # Find service providers whose user_type matches required roles
        matching_providers = User.objects.filter(
            user_type__in=converted_roles,
            is_active=True,
            email_verified=True
        ).exclude(
            id=project.client.id
        ).exclude(
            user_type='client'
        )
        
        logger.info(f"👥 Found {matching_providers.count()} matching providers")
        
        notification_count = 0
        email_count = 0
        
        for provider in matching_providers:
            try:
                # Create database notification
                notification = Notification.objects.create(
                    user=provider,
                    type='new_project',
                    title=f'مشروع جديد: {project.title}',
                    message=f'تم نشر مشروع جديد يتطلب خبرتك في {provider.user_type}. الميزانية: ${project.budget_min} - ${project.budget_max}',
                    data={
                        'project_id': project.id,
                        'project_title': project.title,
                        'client_name': project.client.get_full_name() or project.client.username,
                        'budget_range': f'${project.budget_min} - ${project.budget_max}',
                        'location': project.location,
                        'required_roles': project.required_roles
                    }
                )
                notification_count += 1

                # Broadcast via WebSocket for real-time delivery
                try:
                    broadcast_notification_ws(notification)
                except Exception as ws_err:
                    logger.warning(f"WS broadcast failed for user {provider.id}: {ws_err}")
                
                # Send email notification
                try:
                    context = {
                        'provider_name': provider.get_full_name() or provider.username,
                        'project_title': project.title,
                        'project_description': project.description[:200] + '...' if len(project.description) > 200 else project.description,
                        'client_name': project.client.get_full_name() or project.client.username,
                        'budget_range': f'${project.budget_min} - ${project.budget_max}',
                        'location': project.location,
                        'project_url': f'{settings.FRONTEND_URL}/projects/{project.id}',
                        'deadline': project.deadline.strftime('%Y-%m-%d') if project.deadline else 'غير محدد'
                    }
                    
                    html_message = render_to_string('emails/new_project_notification.html', context)
                    plain_message = strip_tags(html_message)
                    
                    send_mail(
                        subject=f'مشروع جديد متاح: {project.title}',
                        message=plain_message,
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[provider.email],
                        html_message=html_message,
                        fail_silently=False
                    )
                    email_count += 1
                    logger.info(f"📧 Email sent to {provider.email}")
                    
                except Exception as email_error:
                    logger.error(f"❌ Failed to send email to {provider.email}: {str(email_error)}")
                    # Continue with other providers even if email fails
                    
            except Exception as provider_error:
                logger.error(f"❌ Failed to create notification for {provider.email}: {str(provider_error)}")
                # Continue with other providers
        
        logger.info(f"✅ Notifications processed: {notification_count} database, {email_count} emails")
        
        return {
            'status': 'success',
            'project_id': project.id,
            'project_title': project.title,
            'notifications_created': notification_count,
            'emails_sent': email_count,
            'providers_found': matching_providers.count()
        }
        
    except Exception as e:
        logger.error(f"❌ Error in send_project_notifications_async: {str(e)}")
        return {
            'status': 'error',
            'error': str(e),
            'project_id': project_id
        }


@shared_task
def send_bulk_notifications_async(notification_data_list):
    """
    مهمة خلفية لإرسال إشعارات متعددة
    """
    try:
        created_count = 0
        
        for notification_data in notification_data_list:
            try:
                user = User.objects.get(id=notification_data['user_id'])
                
                notification = Notification.objects.create(
                    user=user,
                    type=notification_data['type'],
                    title=notification_data['title'],
                    message=notification_data['message'],
                    data=notification_data.get('data', {})
                )
                created_count += 1

                # Broadcast each created notification
                try:
                    broadcast_notification_ws(notification)
                except Exception as ws_err:
                    logger.warning(f"WS broadcast failed for user {user.id}: {ws_err}")
                
            except Exception as e:
                logger.error(f"Failed to create notification for user {notification_data.get('user_id')}: {str(e)}")
        
        logger.info(f"✅ Bulk notifications created: {created_count}/{len(notification_data_list)}")
        
        return {
            'status': 'success',
            'created_count': created_count,
            'total_requested': len(notification_data_list)
        }
        
    except Exception as e:
        logger.error(f"❌ Error in send_bulk_notifications_async: {str(e)}")
        return {
            'status': 'error',
            'error': str(e)
        }