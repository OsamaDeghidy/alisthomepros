from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q, Sum, Count
from django.http import Http404, HttpResponse, FileResponse
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from .models import (
    FileCategory, UploadedFile, FileShare, FileVersion, 
    FileComment, FileFolder, FileSettings
)
from .serializers import (
    FileCategorySerializer, UploadedFileSerializer, FileUploadSerializer,
    FileShareSerializer, FileShareCreateSerializer, FileVersionSerializer,
    FileCommentSerializer, FileFolderSerializer, FileSettingsSerializer,
    FileStatsSerializer
)


class FileCategoryListView(generics.ListAPIView):
    """قائمة تصنيفات الملفات"""
    serializer_class = FileCategorySerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = FileCategory.objects.filter(is_active=True)
    
    @extend_schema(
        operation_id="list_file_categories",
        summary="List File Categories",
        description="Get available file categories list",
        tags=["File Management"],
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class UploadedFileListView(generics.ListAPIView):
    """قائمة الملفات المرفوعة"""
    serializer_class = UploadedFileSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['file_type', 'upload_purpose', 'is_public', 'category']
    search_fields = ['original_filename', 'description']
    ordering_fields = ['created_at', 'file_size', 'download_count']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Get user's files"""
        return UploadedFile.objects.filter(
            uploaded_by=self.request.user
        ).select_related('category', 'uploaded_by')
    
    @extend_schema(
        operation_id="list_uploaded_files",
        summary="List Uploaded Files",
        description="Get user's uploaded files list",
        tags=["File Management"],
        parameters=[
            OpenApiParameter(
                name="file_type",
                description="نوع الملف",
                required=False,
                type=OpenApiTypes.STR,
                enum=['image', 'document', 'video', 'audio', 'archive', 'other']
            ),
            OpenApiParameter(
                name="upload_purpose",
                description="غرض الرفع",
                required=False,
                type=OpenApiTypes.STR
            ),
        ]
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class FileUploadView(generics.CreateAPIView):
    """رفع ملف جديد"""
    serializer_class = FileUploadSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @extend_schema(
        operation_id="upload_file",
        summary="رفع ملف جديد",
        description="رفع ملف جديد إلى النظام",
        tags=["File Management"],
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class UploadedFileDetailView(generics.RetrieveUpdateDestroyAPIView):
    """تفاصيل الملف المرفوع"""
    serializer_class = UploadedFileSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'file_id'
    
    def get_queryset(self):
        return UploadedFile.objects.filter(uploaded_by=self.request.user)
    
    @extend_schema(
        operation_id="get_file_detail",
        summary="File Details",
        description="Get specific file details",
        tags=["File Management"],
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
    
    @extend_schema(
        operation_id="update_file",
        summary="Update File",
        description="Update file information",
        tags=["File Management"],
    )
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)
    
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)
    
    @extend_schema(
        operation_id="delete_file",
        summary="Delete File",
        description="Delete file from system",
        tags=["File Management"],
    )
    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)


class FileDownloadView(APIView):
    """تحميل الملف"""
    permission_classes = [permissions.IsAuthenticated]
    
    @extend_schema(
        operation_id="download_file",
        summary="تحميل الملف",
        description="تحميل ملف من النظام",
        tags=["File Management"],
    )
    def get(self, request, file_id):
        try:
            file = UploadedFile.objects.get(file_id=file_id)
            
            # Check permissions
            if not file.is_public and file.uploaded_by != request.user:
                # Check if file is shared with user
                if not FileShare.objects.filter(
                    file=file, 
                    shared_with=request.user,
                    permission__in=['download', 'edit']
                ).exists():
                    return Response({
                        'error': 'Permission denied'
                    }, status=status.HTTP_403_FORBIDDEN)
            
            # Increment download count
            file.increment_download_count()
            
            # Return file
            response = FileResponse(
                file.file.open('rb'),
                as_attachment=True,
                filename=file.original_filename
            )
            response['Content-Type'] = file.mime_type
            return response
            
        except UploadedFile.DoesNotExist:
            return Response({
                'error': 'File not found'
            }, status=status.HTTP_404_NOT_FOUND)


class FileShareListView(generics.ListCreateAPIView):
    """قائمة مشاركات الملفات"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return FileShareCreateSerializer
        return FileShareSerializer
    
    def get_queryset(self):
        """Get user's file shares"""
        return FileShare.objects.filter(
            Q(shared_by=self.request.user) | Q(shared_with=self.request.user)
        ).select_related('file', 'shared_with', 'shared_by')
    
    @extend_schema(
        operation_id="list_file_shares",
        summary="List File Shares",
        description="Get file shares list",
        tags=["File Management"],
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
    
    @extend_schema(
        operation_id="create_file_share",
        summary="مشاركة ملف",
        description="مشاركة ملف مع مستخدم آخر",
        tags=["File Management"],
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class FileCommentListView(generics.ListCreateAPIView):
    """قائمة تعليقات الملف"""
    serializer_class = FileCommentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        file_id = self.kwargs['file_id']
        return FileComment.objects.filter(
            file__file_id=file_id,
            parent_comment__isnull=True  # Only top-level comments
        ).select_related('commenter').prefetch_related('replies')
    
    def perform_create(self, serializer):
        file_id = self.kwargs['file_id']
        file = UploadedFile.objects.get(file_id=file_id)
        serializer.save(commenter=self.request.user, file=file)


class FileFolderListView(generics.ListCreateAPIView):
    """قائمة مجلدات الملفات"""
    serializer_class = FileFolderSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return FileFolder.objects.filter(
            owner=self.request.user
        ).select_related('owner', 'parent')
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def file_stats(request):
    """إحصائيات الملفات"""
    user = request.user
    
    # Get user's files
    files = UploadedFile.objects.filter(uploaded_by=user)
    
    # Calculate stats
    total_files = files.count()
    total_size = files.aggregate(total=Sum('file_size'))['total'] or 0
    
    # Format total size
    size = total_size
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size < 1024.0:
            total_size_formatted = f"{size:.1f} {unit}"
            break
        size /= 1024.0
    else:
        total_size_formatted = f"{size:.1f} TB"
    
    # Files by type
    files_by_type = {}
    for file_type in ['image', 'document', 'video', 'audio', 'archive', 'other']:
        count = files.filter(file_type=file_type).count()
        if count > 0:
            files_by_type[file_type] = count
    
    # Files by purpose
    files_by_purpose = {}
    for choice in UploadedFile.UPLOAD_PURPOSES:
        purpose = choice[0]
        count = files.filter(upload_purpose=purpose).count()
        if count > 0:
            files_by_purpose[purpose] = count
    
    # Recent uploads (last 7 days)
    seven_days_ago = timezone.now() - timezone.timedelta(days=7)
    recent_uploads = files.filter(created_at__gte=seven_days_ago).count()
    
    # Storage usage percentage (assuming 1GB limit for demo)
    storage_limit = 1024 * 1024 * 1024  # 1GB
    storage_used_percentage = (total_size / storage_limit) * 100 if storage_limit > 0 else 0
    
    stats = {
        'total_files': total_files,
        'total_size': total_size,
        'total_size_formatted': total_size_formatted,
        'files_by_type': files_by_type,
        'files_by_purpose': files_by_purpose,
        'recent_uploads': recent_uploads,
        'storage_used_percentage': min(storage_used_percentage, 100)
    }
    
    serializer = FileStatsSerializer(stats)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_folder(request):
    """إنشاء مجلد جديد"""
    serializer = FileFolderSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        folder = serializer.save(owner=request.user)
        return Response(
            FileFolderSerializer(folder).data,
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def delete_multiple_files(request):
    """حذف ملفات متعددة"""
    file_ids = request.data.get('file_ids', [])
    
    if not file_ids:
        return Response({
            'error': 'No file IDs provided'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Get user's files
    files = UploadedFile.objects.filter(
        file_id__in=file_ids,
        uploaded_by=request.user
    )
    
    deleted_count = files.count()
    files.delete()
    
    return Response({
        'message': f'{deleted_count} files deleted successfully',
        'deleted_count': deleted_count
    }) 