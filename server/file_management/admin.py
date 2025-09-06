from django.contrib import admin
from .models import (
    FileCategory, UploadedFile, FileShare, FileVersion, 
    FileComment, FileActivityLog, FileFolder, FileSettings
)


@admin.register(FileCategory)
class FileCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'max_file_size', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at']


@admin.register(UploadedFile)
class UploadedFileAdmin(admin.ModelAdmin):
    list_display = [
        'original_filename', 'uploaded_by', 'file_type', 
        'file_size_formatted', 'upload_purpose', 'is_public', 
        'is_safe', 'created_at'
    ]
    list_filter = [
        'file_type', 'upload_purpose', 'is_public', 'is_safe', 
        'is_temp', 'created_at'
    ]
    search_fields = [
        'original_filename', 'uploaded_by__username', 
        'uploaded_by__first_name', 'uploaded_by__last_name'
    ]
    readonly_fields = [
        'file_id', 'file_size', 'mime_type', 'width', 'height', 
        'duration', 'download_count', 'last_accessed', 'created_at', 'updated_at'
    ]
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('File Information', {
            'fields': ('file_id', 'file', 'original_filename', 'file_type', 'mime_type')
        }),
        ('Upload Details', {
            'fields': ('uploaded_by', 'upload_purpose', 'category', 'description')
        }),
        ('Media Properties', {
            'fields': ('width', 'height', 'duration', 'thumbnail'),
            'classes': ('collapse',)
        }),
        ('Security & Access', {
            'fields': ('is_scanned', 'is_safe', 'virus_scan_result', 'is_public', 'is_temp', 'expires_at')
        }),
        ('Usage Statistics', {
            'fields': ('download_count', 'last_accessed'),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('tags', 'metadata'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(FileShare)
class FileShareAdmin(admin.ModelAdmin):
    list_display = [
        'file', 'shared_with', 'shared_by', 'permission', 
        'access_count', 'expires_at', 'shared_at'
    ]
    list_filter = ['permission', 'shared_at', 'expires_at']
    search_fields = [
        'file__original_filename', 'shared_with__username', 'shared_by__username'
    ]
    readonly_fields = ['access_count', 'last_accessed', 'shared_at']


@admin.register(FileVersion)
class FileVersionAdmin(admin.ModelAdmin):
    list_display = [
        'original_file', 'version_number', 'uploaded_by', 
        'file_size', 'created_at'
    ]
    list_filter = ['created_at']
    search_fields = ['original_file__original_filename', 'uploaded_by__username']
    readonly_fields = ['created_at']


@admin.register(FileComment)
class FileCommentAdmin(admin.ModelAdmin):
    list_display = ['file', 'commenter', 'comment', 'created_at']
    list_filter = ['created_at']
    search_fields = ['file__original_filename', 'commenter__username', 'comment']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(FileActivityLog)
class FileActivityLogAdmin(admin.ModelAdmin):
    list_display = [
        'file', 'user', 'activity_type', 'ip_address', 'created_at'
    ]
    list_filter = ['activity_type', 'created_at']
    search_fields = [
        'file__original_filename', 'user__username', 'description'
    ]
    readonly_fields = ['created_at']
    date_hierarchy = 'created_at'


@admin.register(FileFolder)
class FileFolderAdmin(admin.ModelAdmin):
    list_display = ['name', 'owner', 'parent', 'is_public', 'created_at']
    list_filter = ['is_public', 'created_at']
    search_fields = ['name', 'owner__username', 'description']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(FileSettings)
class FileSettingsAdmin(admin.ModelAdmin):
    list_display = [
        'max_file_size_general', 'storage_limit_client', 
        'storage_limit_professional', 'is_active', 'updated_at'
    ]
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('File Size Limits', {
            'fields': (
                'max_file_size_general', 'max_file_size_image', 
                'max_file_size_video', 'max_file_size_document'
            )
        }),
        ('Storage Limits', {
            'fields': ('storage_limit_client', 'storage_limit_professional')
        }),
        ('Allowed Extensions', {
            'fields': (
                'allowed_image_extensions', 'allowed_document_extensions', 
                'allowed_video_extensions'
            ),
            'classes': ('collapse',)
        }),
        ('Security Settings', {
            'fields': (
                'enable_virus_scanning', 'auto_delete_temp_files_days', 
                'enable_file_versioning', 'max_file_versions'
            )
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    ) 