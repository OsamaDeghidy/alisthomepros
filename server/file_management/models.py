from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import FileExtensionValidator
from django.utils import timezone
import uuid
import os

User = get_user_model()


class FileCategory(models.Model):
    """تصنيفات الملفات"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    allowed_extensions = models.JSONField(default=list, blank=True)
    max_file_size = models.PositiveIntegerField(default=10485760)  # 10MB default
    icon = models.CharField(max_length=50, blank=True)
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'file_categories'
        verbose_name = 'File Category'
        verbose_name_plural = 'File Categories'
    
    def __str__(self):
        return self.name


def user_file_path(instance, filename):
    """Generate file path for user uploads"""
    # Extract file extension
    ext = filename.split('.')[-1]
    # Generate unique filename
    filename = f"{uuid.uuid4().hex}.{ext}"
    # Create path: files/user_id/year/month/filename
    return f"files/{instance.uploaded_by.id}/{timezone.now().year}/{timezone.now().month}/{filename}"


class UploadedFile(models.Model):
    """الملفات المرفوعة"""
    FILE_TYPES = [
        ('image', 'Image'),
        ('document', 'Document'), 
        ('video', 'Video'),
        ('audio', 'Audio'),
        ('archive', 'Archive'),
        ('other', 'Other'),
    ]
    
    UPLOAD_PURPOSES = [
        ('profile_avatar', 'Profile Avatar'),
        ('project_image', 'Project Image'),
        ('portfolio_item', 'Portfolio Item'),
        ('message_attachment', 'Message Attachment'),
        ('contract_document', 'Contract Document'),
        ('proposal_attachment', 'Proposal Attachment'),
        ('general', 'General'),
    ]
    
    # Basic file info
    file_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    file = models.FileField(upload_to=user_file_path)
    original_filename = models.CharField(max_length=255)
    file_size = models.PositiveIntegerField()  # in bytes
    file_type = models.CharField(max_length=20, choices=FILE_TYPES)
    mime_type = models.CharField(max_length=100)
    
    # Upload details
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='uploaded_files')
    upload_purpose = models.CharField(max_length=30, choices=UPLOAD_PURPOSES, default='general')
    category = models.ForeignKey(FileCategory, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Image/Video specific fields
    width = models.PositiveIntegerField(null=True, blank=True)
    height = models.PositiveIntegerField(null=True, blank=True)
    duration = models.PositiveIntegerField(null=True, blank=True)  # in seconds
    
    # Thumbnail for images and videos
    thumbnail = models.ImageField(upload_to='thumbnails/%Y/%m/%d/', null=True, blank=True)
    
    # Security and validation
    is_scanned = models.BooleanField(default=False)
    is_safe = models.BooleanField(default=True)
    virus_scan_result = models.TextField(blank=True)
    
    # Access control
    is_public = models.BooleanField(default=False)
    is_temp = models.BooleanField(default=False)  # Temporary files (auto-delete)
    expires_at = models.DateTimeField(null=True, blank=True)
    
    # Usage tracking
    download_count = models.PositiveIntegerField(default=0)
    last_accessed = models.DateTimeField(null=True, blank=True)
    
    # Tags and metadata
    tags = models.JSONField(default=list, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    description = models.TextField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'uploaded_files'
        verbose_name = 'Uploaded File'
        verbose_name_plural = 'Uploaded Files'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['uploaded_by', 'created_at']),
            models.Index(fields=['file_type']),
            models.Index(fields=['upload_purpose']),
            models.Index(fields=['is_public']),
        ]
    
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
    
    @property
    def file_extension(self):
        """Get file extension"""
        return os.path.splitext(self.original_filename)[1].lower()
    
    def increment_download_count(self):
        """Increment download counter"""
        self.download_count += 1
        self.last_accessed = timezone.now()
        self.save(update_fields=['download_count', 'last_accessed'])
    
    def is_image(self):
        """Check if file is an image"""
        return self.file_type == 'image'
    
    def is_video(self):
        """Check if file is a video"""
        return self.file_type == 'video'
    
    def can_preview(self):
        """Check if file can be previewed"""
        preview_types = ['image', 'document']  # Add more as needed
        preview_extensions = ['.pdf', '.txt', '.md']
        
        return (
            self.file_type in preview_types or 
            self.file_extension in preview_extensions
        )


class FileShare(models.Model):
    """مشاركة الملفات"""
    PERMISSION_TYPES = [
        ('view', 'View Only'),
        ('download', 'Download'),
        ('edit', 'Edit'),
    ]
    
    file = models.ForeignKey(UploadedFile, on_delete=models.CASCADE, related_name='shares')
    shared_with = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shared_files')
    shared_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='files_shared')
    
    permission = models.CharField(max_length=20, choices=PERMISSION_TYPES, default='view')
    
    # Access control
    expires_at = models.DateTimeField(null=True, blank=True)
    access_count = models.PositiveIntegerField(default=0)
    max_access_count = models.PositiveIntegerField(null=True, blank=True)
    
    # Timestamps
    shared_at = models.DateTimeField(auto_now_add=True)
    last_accessed = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'file_shares'
        verbose_name = 'File Share'
        verbose_name_plural = 'File Shares'
        unique_together = ['file', 'shared_with']
    
    def __str__(self):
        return f"{self.file.original_filename} shared with {self.shared_with.get_full_name()}"
    
    def can_access(self):
        """Check if share can still be accessed"""
        # Check expiration
        if self.expires_at and self.expires_at < timezone.now():
            return False
        
        # Check access count limit
        if self.max_access_count and self.access_count >= self.max_access_count:
            return False
        
        return True
    
    def record_access(self):
        """Record file access"""
        if self.can_access():
            self.access_count += 1
            self.last_accessed = timezone.now()
            self.save(update_fields=['access_count', 'last_accessed'])
            return True
        return False


class FileVersion(models.Model):
    """إصدارات الملفات"""
    original_file = models.ForeignKey(
        UploadedFile, 
        on_delete=models.CASCADE, 
        related_name='versions'
    )
    version_number = models.PositiveIntegerField()
    file = models.FileField(upload_to=user_file_path)
    file_size = models.PositiveIntegerField()
    
    # Changes
    change_description = models.TextField(blank=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'file_versions'
        verbose_name = 'File Version'
        verbose_name_plural = 'File Versions'
        unique_together = ['original_file', 'version_number']
        ordering = ['-version_number']
    
    def __str__(self):
        return f"{self.original_file.original_filename} v{self.version_number}"


class FileComment(models.Model):
    """تعليقات على الملفات"""
    file = models.ForeignKey(UploadedFile, on_delete=models.CASCADE, related_name='comments')
    commenter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='file_comments')
    
    comment = models.TextField()
    
    # Thread support
    parent_comment = models.ForeignKey(
        'self', 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True,
        related_name='replies'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'file_comments'
        verbose_name = 'File Comment'
        verbose_name_plural = 'File Comments'
        ordering = ['created_at']
    
    def __str__(self):
        return f"Comment on {self.file.original_filename}"


class FileActivityLog(models.Model):
    """سجل أنشطة الملفات"""
    ACTIVITY_TYPES = [
        ('upload', 'Upload'),
        ('download', 'Download'),
        ('view', 'View'),
        ('share', 'Share'),
        ('delete', 'Delete'),
        ('edit', 'Edit'),
        ('comment', 'Comment'),
    ]
    
    file = models.ForeignKey(UploadedFile, on_delete=models.CASCADE, related_name='activity_logs')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='file_activities')
    
    activity_type = models.CharField(max_length=20, choices=ACTIVITY_TYPES)
    description = models.TextField(blank=True)
    
    # Additional data
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'file_activity_logs'
        verbose_name = 'File Activity Log'
        verbose_name_plural = 'File Activity Logs'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.get_full_name()} {self.activity_type} {self.file.original_filename}"


class FileFolder(models.Model):
    """مجلدات الملفات"""
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    
    # Hierarchy
    parent = models.ForeignKey(
        'self', 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True,
        related_name='subfolders'
    )
    
    # Owner
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='folders')
    
    # Permissions
    is_public = models.BooleanField(default=False)
    
    # Files in this folder
    files = models.ManyToManyField(UploadedFile, related_name='folders', blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'file_folders'
        verbose_name = 'File Folder'
        verbose_name_plural = 'File Folders'
        unique_together = ['name', 'parent', 'owner']
    
    def __str__(self):
        if self.parent:
            return f"{self.parent.name}/{self.name}"
        return self.name
    
    def get_full_path(self):
        """Get full folder path"""
        path = [self.name]
        parent = self.parent
        while parent:
            path.insert(0, parent.name)
            parent = parent.parent
        return '/'.join(path)


class FileSettings(models.Model):
    """إعدادات الملفات"""
    # File size limits (in bytes)
    max_file_size_general = models.PositiveIntegerField(default=10485760)  # 10MB
    max_file_size_image = models.PositiveIntegerField(default=5242880)    # 5MB
    max_file_size_video = models.PositiveIntegerField(default=104857600)  # 100MB
    max_file_size_document = models.PositiveIntegerField(default=10485760) # 10MB
    
    # Storage limits per user
    storage_limit_client = models.PositiveIntegerField(default=1073741824)      # 1GB
    storage_limit_professional = models.PositiveIntegerField(default=5368709120) # 5GB
    
    # Allowed file extensions
    allowed_image_extensions = models.JSONField(
        default=list,
        blank=True,
        help_text="Allowed image file extensions"
    )
    allowed_document_extensions = models.JSONField(
        default=list,
        blank=True,
        help_text="Allowed document file extensions"
    )
    allowed_video_extensions = models.JSONField(
        default=list,
        blank=True,
        help_text="Allowed video file extensions"
    )
    
    # Security settings
    enable_virus_scanning = models.BooleanField(default=True)
    auto_delete_temp_files_days = models.PositiveIntegerField(default=7)
    enable_file_versioning = models.BooleanField(default=True)
    max_file_versions = models.PositiveIntegerField(default=10)
    
    # Active settings
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'file_settings'
        verbose_name = 'File Settings'
        verbose_name_plural = 'File Settings'
    
    def __str__(self):
        return f"File Settings (Active: {self.is_active})"
    
    def save(self, *args, **kwargs):
        """Set default extensions if not provided"""
        if not self.allowed_image_extensions:
            self.allowed_image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
        
        if not self.allowed_document_extensions:
            self.allowed_document_extensions = ['.pdf', '.doc', '.docx', '.txt', '.xlsx', '.pptx']
        
        if not self.allowed_video_extensions:
            self.allowed_video_extensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv']
        
        super().save(*args, **kwargs) 