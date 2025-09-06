from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    FileCategory, UploadedFile, FileShare, FileVersion, 
    FileComment, FileFolder, FileSettings
)

User = get_user_model()


class UserBasicSerializer(serializers.ModelSerializer):
    """Serializer أساسي للمستخدم"""
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'avatar']


class FileCategorySerializer(serializers.ModelSerializer):
    """Serializer لتصنيفات الملفات"""
    class Meta:
        model = FileCategory
        fields = [
            'id', 'name', 'description', 'allowed_extensions', 
            'max_file_size', 'icon', 'is_active', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class UploadedFileSerializer(serializers.ModelSerializer):
    """Serializer للملفات المرفوعة"""
    uploaded_by = UserBasicSerializer(read_only=True)
    file_size_formatted = serializers.ReadOnlyField()
    file_extension = serializers.ReadOnlyField()
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = UploadedFile
        fields = [
            'id', 'file_id', 'file', 'original_filename', 'file_size', 
            'file_size_formatted', 'file_type', 'mime_type', 'file_extension',
            'uploaded_by', 'upload_purpose', 'category', 'category_name',
            'width', 'height', 'duration', 'thumbnail', 'is_public', 'is_temp',
            'expires_at', 'download_count', 'last_accessed', 'tags', 'description',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'file_id', 'file_size', 'file_type', 'mime_type', 
            'uploaded_by', 'width', 'height', 'duration', 'download_count', 
            'last_accessed', 'created_at', 'updated_at'
        ]


class FileUploadSerializer(serializers.ModelSerializer):
    """Serializer لرفع الملفات"""
    file = serializers.FileField()
    
    class Meta:
        model = UploadedFile
        fields = [
            'file', 'upload_purpose', 'category', 'description', 
            'tags', 'is_public', 'is_temp', 'expires_at'
        ]
    
    def validate_file(self, value):
        """Validate uploaded file"""
        # Check file size (max 50MB for example)
        max_size = 50 * 1024 * 1024  # 50MB
        if value.size > max_size:
            raise serializers.ValidationError(
                f"File size cannot exceed {max_size // (1024 * 1024)}MB"
            )
        
        return value
    
    def create(self, validated_data):
        """Create uploaded file with metadata"""
        file = validated_data['file']
        validated_data['uploaded_by'] = self.context['request'].user
        validated_data['original_filename'] = file.name
        validated_data['file_size'] = file.size
        validated_data['mime_type'] = getattr(file, 'content_type', 'application/octet-stream')
        
        # Determine file type based on mime type
        mime_type = validated_data['mime_type']
        if mime_type.startswith('image/'):
            validated_data['file_type'] = 'image'
        elif mime_type.startswith('video/'):
            validated_data['file_type'] = 'video'
        elif mime_type.startswith('audio/'):
            validated_data['file_type'] = 'audio'
        elif mime_type in ['application/pdf', 'application/msword', 'text/plain']:
            validated_data['file_type'] = 'document'
        elif mime_type in ['application/zip', 'application/x-rar']:
            validated_data['file_type'] = 'archive'
        else:
            validated_data['file_type'] = 'other'
        
        return super().create(validated_data)


class FileShareSerializer(serializers.ModelSerializer):
    """Serializer لمشاركة الملفات"""
    file = UploadedFileSerializer(read_only=True)
    shared_with = UserBasicSerializer(read_only=True)
    shared_by = UserBasicSerializer(read_only=True)
    
    class Meta:
        model = FileShare
        fields = [
            'id', 'file', 'shared_with', 'shared_by', 'permission',
            'expires_at', 'access_count', 'max_access_count',
            'shared_at', 'last_accessed'
        ]
        read_only_fields = [
            'id', 'file', 'shared_with', 'shared_by', 'access_count', 
            'shared_at', 'last_accessed'
        ]


class FileShareCreateSerializer(serializers.ModelSerializer):
    """Serializer لإنشاء مشاركة ملف"""
    file_id = serializers.UUIDField(write_only=True)
    user_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = FileShare
        fields = [
            'file_id', 'user_id', 'permission', 'expires_at', 'max_access_count'
        ]
    
    def validate_file_id(self, value):
        """Validate file exists and user owns it"""
        try:
            file = UploadedFile.objects.get(file_id=value)
            request = self.context.get('request')
            if request and file.uploaded_by != request.user:
                raise serializers.ValidationError("You don't own this file")
            return value
        except UploadedFile.DoesNotExist:
            raise serializers.ValidationError("File not found")
    
    def validate_user_id(self, value):
        """Validate user exists"""
        try:
            User.objects.get(id=value)
            return value
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found")
    
    def create(self, validated_data):
        """Create file share"""
        file_id = validated_data.pop('file_id')
        user_id = validated_data.pop('user_id')
        
        file = UploadedFile.objects.get(file_id=file_id)
        user = User.objects.get(id=user_id)
        request = self.context.get('request')
        
        validated_data['file'] = file
        validated_data['shared_with'] = user
        validated_data['shared_by'] = request.user
        
        return super().create(validated_data)


class FileVersionSerializer(serializers.ModelSerializer):
    """Serializer لإصدارات الملفات"""
    uploaded_by = UserBasicSerializer(read_only=True)
    
    class Meta:
        model = FileVersion
        fields = [
            'id', 'version_number', 'file', 'file_size', 
            'change_description', 'uploaded_by', 'created_at'
        ]
        read_only_fields = ['id', 'version_number', 'file_size', 'uploaded_by', 'created_at']


class FileCommentSerializer(serializers.ModelSerializer):
    """Serializer لتعليقات الملفات"""
    commenter = UserBasicSerializer(read_only=True)
    replies = serializers.SerializerMethodField()
    
    class Meta:
        model = FileComment
        fields = [
            'id', 'comment', 'commenter', 'parent_comment', 
            'replies', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'commenter', 'created_at', 'updated_at']
    
    def get_replies(self, obj):
        """Get comment replies"""
        if obj.replies.exists():
            return FileCommentSerializer(obj.replies.all(), many=True).data
        return []


class FileFolderSerializer(serializers.ModelSerializer):
    """Serializer لمجلدات الملفات"""
    owner = UserBasicSerializer(read_only=True)
    full_path = serializers.ReadOnlyField(source='get_full_path')
    files_count = serializers.SerializerMethodField()
    subfolders_count = serializers.SerializerMethodField()
    
    class Meta:
        model = FileFolder
        fields = [
            'id', 'name', 'description', 'parent', 'owner', 'is_public',
            'full_path', 'files_count', 'subfolders_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'owner', 'created_at', 'updated_at']
    
    def get_files_count(self, obj):
        """Get number of files in folder"""
        return obj.files.count()
    
    def get_subfolders_count(self, obj):
        """Get number of subfolders"""
        return obj.subfolders.count()


class FileSettingsSerializer(serializers.ModelSerializer):
    """Serializer لإعدادات الملفات"""
    class Meta:
        model = FileSettings
        fields = [
            'id', 'max_file_size_general', 'max_file_size_image', 
            'max_file_size_video', 'max_file_size_document',
            'storage_limit_client', 'storage_limit_professional',
            'allowed_image_extensions', 'allowed_document_extensions',
            'allowed_video_extensions', 'enable_virus_scanning',
            'auto_delete_temp_files_days', 'enable_file_versioning',
            'max_file_versions', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class FileStatsSerializer(serializers.Serializer):
    """Serializer لإحصائيات الملفات"""
    total_files = serializers.IntegerField()
    total_size = serializers.IntegerField()
    total_size_formatted = serializers.CharField()
    files_by_type = serializers.DictField()
    files_by_purpose = serializers.DictField()
    recent_uploads = serializers.IntegerField()
    storage_used_percentage = serializers.FloatField() 