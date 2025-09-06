from django.urls import path
from . import views

app_name = 'tasks'

urlpatterns = [
    # Tasks
    path('', views.TaskListView.as_view(), name='task_list'),
    path('<int:pk>/', views.TaskDetailView.as_view(), name='task_detail'),
    path('create/', views.TaskCreateView.as_view(), name='task_create'),
    path('<int:pk>/update/', views.TaskUpdateView.as_view(), name='task_update'),
    path('<int:pk>/delete/', views.TaskDeleteView.as_view(), name='task_delete'),
    
    # Task actions
    path('<int:pk>/complete/', views.complete_task, name='complete_task'),
    path('<int:pk>/start/', views.start_task, name='start_task'),
    
    # My tasks
    path('my/', views.my_tasks, name='my_tasks'),
] 