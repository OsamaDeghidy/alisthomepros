from django.urls import path
from . import views

app_name = 'projects'

urlpatterns = [
    # Project management
    path('', views.ProjectListView.as_view(), name='project_list'),
    path('create/', views.ProjectCreateView.as_view(), name='project_create'),
    path('intake/', views.IntakeLeadCreateView.as_view(), name='intake_create'),
    path('my/', views.MyProjectsView.as_view(), name='my_projects'),
    path('search/', views.project_search, name='project_search'),
    path('stats/', views.project_stats, name='project_stats'),
    
    # Public professional projects
    path('professional/<int:professional_id>/', views.PublicProfessionalProjectsView.as_view(), name='public_professional_projects'),
    
    # Categories (يجب أن يكون قبل slug pattern)
    path('categories/', views.CategoryListView.as_view(), name='category_list'),
    
    # Project details and actions (يجب أن يكون قبل slug pattern)
    path('<slug:slug>/', views.ProjectDetailView.as_view(), name='project_detail'),
    path('<slug:slug>/images/', views.ProjectImageViewSet.as_view({'post': 'create'}), name='project_images'),
    path('<slug:slug>/files/', views.ProjectFileViewSet.as_view({'post': 'create'}), name='project_files'),
]