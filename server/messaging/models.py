from django.db import models
from django.conf import settings
from django.utils import timezone
import uuid


class Conversation(models.Model):
    """المحادثات"""
    conversation_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    
    # Participants
    participants = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='conversations')
    
    # Project reference (optional)
    project = models.ForeignKey(
        'projects.Project', 
        on_delete=models.CASCADE, 
        related_name='conversations',
        null=True, 
        blank=True
    )
    
    # Contract reference (optional)
    contract = models.ForeignKey(
        'contracts.Contract', 
        on_delete=models.CASCADE, 
        related_name='conversations',
        null=True, 
        blank=True
    )
    
    # Conversation metadata
    title = models.CharField(max_length=255, blank=True)
    is_group = models.BooleanField(default=False)
    is_archived = models.BooleanField(default=False)
    
    # Last activity
    last_message_at = models.DateTimeField(auto_now_add=True)
    last_message = models.TextField(blank=True)
    last_message_sender = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='last_messages_sent'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'conversations'
        verbose_name = 'Conversation'
        verbose_name_plural = 'Conversations'
        ordering = ['-last_message_at']
    
    def __str__(self):
        if self.title:
            return self.title
        elif self.project:
            return f"Conversation for {self.project.title}"
        else:
            participants = list(self.participants.all())
            if len(participants) >= 2:
                return f"{participants[0].get_full_name()} & {participants[1].get_full_name()}"
            return f"Conversation {self.conversation_id}"
    
    def get_other_participant(self, user):
        """Get the other participant in a 2-person conversation"""
        if not self.is_group:
            return self.participants.exclude(id=user.id).first()
        return None
    
    def get_unread_count(self, user):
        """Get unread message count for a user"""
        return self.messages.filter(
            created_at__gt=user.last_read_times.get(
                conversation=self, 
                defaults={'last_read_at': timezone.now()}
            ).last_read_at
        ).exclude(sender=user).count()


class Message(models.Model):
    """Messages"""
    MESSAGE_TYPES = [
        ('text', 'Text'),
        ('image', 'Image'),
        ('file', 'File'),
        ('voice', 'Voice'),
        ('video', 'Video'),
        ('system', 'System'),
        ('payment_request', 'Payment Request'),
        ('appointment', 'Appointment'),
    ]
    
    message_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_messages')
    
    # Message content
    content = models.TextField(blank=True)
    message_type = models.CharField(max_length=20, choices=MESSAGE_TYPES, default='text')
    
    # Reply/Thread
    reply_to = models.ForeignKey(
        'self', 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True,
        related_name='replies'
    )
    
    # Status
    is_edited = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    edited_at = models.DateTimeField(null=True, blank=True)
    
    # Metadata
    metadata = models.JSONField(default=dict, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'messages'
        verbose_name = 'Message'
        verbose_name_plural = 'Messages'
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['conversation', 'created_at']),
            models.Index(fields=['sender']),
            models.Index(fields=['message_type']),
        ]
    
    def __str__(self):
        return f"{self.sender.get_full_name()}: {self.content[:50]}..."


class MessageAttachment(models.Model):
    """مرفقات الرسائل"""
    ATTACHMENT_TYPES = [
        ('image', 'Image'),
        ('document', 'Document'),
        ('video', 'Video'),
        ('audio', 'Audio'),
        ('other', 'Other'),
    ]
    
    message = models.ForeignKey(Message, on_delete=models.CASCADE, related_name='attachments')
    
    # File details
    file = models.FileField(upload_to='message_attachments/%Y/%m/%d/')
    original_filename = models.CharField(max_length=255)
    file_size = models.PositiveIntegerField()  # in bytes
    file_type = models.CharField(max_length=20, choices=ATTACHMENT_TYPES)
    mime_type = models.CharField(max_length=100)
    
    # Image/Video specific
    width = models.PositiveIntegerField(null=True, blank=True)
    height = models.PositiveIntegerField(null=True, blank=True)
    duration = models.PositiveIntegerField(null=True, blank=True)  # in seconds
    
    # Thumbnail for videos/images
    thumbnail = models.ImageField(upload_to='message_thumbnails/%Y/%m/%d/', null=True, blank=True)
    
    # Security
    is_scanned = models.BooleanField(default=False)
    is_safe = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'message_attachments'
        verbose_name = 'Message Attachment'
        verbose_name_plural = 'Message Attachments'
    
    def __str__(self):
        return f"{self.original_filename} ({self.file_type})"
    
    @property
    def file_size_formatted(self):
        """Format file size in human readable format"""
        size = self.file_size
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size < 1024.0:
                return f"{size:.1f} {unit}"
            size /= 1024.0
        return f"{size:.1f} TB"


class MessageReadStatus(models.Model):
    """Message read status"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='read_statuses')
    message = models.ForeignKey(Message, on_delete=models.CASCADE, related_name='read_statuses')
    read_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'message_read_status'
        verbose_name = 'Message Read Status'
        verbose_name_plural = 'Message Read Statuses'
        unique_together = ['user', 'message']
    
    def __str__(self):
        return f"{self.user.get_full_name()} read message at {self.read_at}"


class ConversationReadTime(models.Model):
    """آخر وقت قراءة للمحادثة"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='last_read_times')
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='read_times')
    last_read_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        db_table = 'conversation_read_times'
        verbose_name = 'Conversation Read Time'
        verbose_name_plural = 'Conversation Read Times'
        unique_together = ['user', 'conversation']
    
    def __str__(self):
        return f"{self.user.get_full_name()} - {self.conversation}"


class MessageReaction(models.Model):
    """Message reactions"""
    REACTION_TYPES = [
        ('👍', 'Thumbs Up'),
        ('❤️', 'Heart'),
        ('😂', 'Laugh'),
        ('😮', 'Wow'),
        ('😢', 'Sad'),
        ('😠', 'Angry'),
        ('✅', 'Check'),
        ('❌', 'Cross'),
    ]
    
    message = models.ForeignKey(Message, on_delete=models.CASCADE, related_name='reactions')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='message_reactions')
    reaction = models.CharField(max_length=10, choices=REACTION_TYPES)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'message_reactions'
        verbose_name = 'Message Reaction'
        verbose_name_plural = 'Message Reactions'
        unique_together = ['message', 'user', 'reaction']
    
    def __str__(self):
        return f"{self.user.get_full_name()} reacted {self.reaction} to message"


class BlockedUser(models.Model):
    """المستخدمون المحظورون"""
    blocker = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='blocked_users')
    blocked = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='blocked_by')
    reason = models.TextField(blank=True)
    
    blocked_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'blocked_users'
        verbose_name = 'Blocked User'
        verbose_name_plural = 'Blocked Users'
        unique_together = ['blocker', 'blocked']
    
    def __str__(self):
        return f"{self.blocker.get_full_name()} blocked {self.blocked.get_full_name()}"


class ConversationSettings(models.Model):
    """إعدادات المحادثة"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='conversation_settings')
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='user_settings')
    
    # Notification settings
    notifications_enabled = models.BooleanField(default=True)
    sound_enabled = models.BooleanField(default=True)
    
    # Display settings
    is_pinned = models.BooleanField(default=False)
    is_muted = models.BooleanField(default=False)
    custom_name = models.CharField(max_length=255, blank=True)
    
    # Privacy settings
    typing_indicator_enabled = models.BooleanField(default=True)
    read_receipts_enabled = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'conversation_settings'
        verbose_name = 'Conversation Settings'
        verbose_name_plural = 'Conversation Settings'
        unique_together = ['user', 'conversation']
    
    def __str__(self):
        return f"{self.user.get_full_name()} settings for {self.conversation}"


class TypingIndicator(models.Model):
    """مؤشر الكتابة"""
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='typing_indicators')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='typing_indicators')
    
    started_at = models.DateTimeField(auto_now_add=True)
    last_activity = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'typing_indicators'
        verbose_name = 'Typing Indicator'
        verbose_name_plural = 'Typing Indicators'
        unique_together = ['conversation', 'user']
    
    def __str__(self):
        return f"{self.user.get_full_name()} is typing in {self.conversation}"
