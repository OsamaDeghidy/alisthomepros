from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Notification(models.Model):
    """Notifications Model for managing user notifications"""
    TYPE_CHOICES = [
        ('project_update', 'Project Update'),
        ('project_created', 'Project Created'),
        ('new_message', 'New Message'),
        ('payment_received', 'Payment Received'),
        ('contract_signed', 'Contract Signed'),
        ('review_received', 'Review Received'),
        ('system', 'System Notification'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications', verbose_name='User')
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, verbose_name='Notification Type')
    title = models.CharField(max_length=255, verbose_name='Title')
    message = models.TextField(verbose_name='Message')
    is_read = models.BooleanField(default=False, verbose_name='Is Read')
    data = models.JSONField(default=dict, blank=True, verbose_name='Additional Data')
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Created At')
    read_at = models.DateTimeField(null=True, blank=True, verbose_name='Read At')
    
    class Meta:
        db_table = 'notifications'
        verbose_name = 'Notification'
        verbose_name_plural = 'Notifications'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Notification for {self.user.username}: {self.title}"