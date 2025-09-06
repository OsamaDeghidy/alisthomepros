from django.urls import path
from . import views

app_name = 'file_management'

urlpatterns = [
    # File categories
    path('categories/', views.FileCategoryListView.as_view(), name='file_categories'),
    
    # File management
    path('files/', views.UploadedFileListView.as_view(), name='file_list'),
    path('files/upload/', views.FileUploadView.as_view(), name='file_upload'),
    path('files/<uuid:file_id>/', views.UploadedFileDetailView.as_view(), name='file_detail'),
    path('files/<uuid:file_id>/download/', views.FileDownloadView.as_view(), name='file_download'),
    
    # File sharing
    path('shares/', views.FileShareListView.as_view(), name='file_shares'),
    
    # File comments
    path('files/<uuid:file_id>/comments/', views.FileCommentListView.as_view(), name='file_comments'),
    
    # File folders
    path('folders/', views.FileFolderListView.as_view(), name='file_folders'),
    path('folders/create/', views.create_folder, name='create_folder'),
    
    # File operations
    path('files/delete-multiple/', views.delete_multiple_files, name='delete_multiple_files'),
    
    # Statistics
    path('stats/', views.file_stats, name='file_stats'),
] 