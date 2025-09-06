from django.urls import path
from . import views

app_name = 'time_tracking'

urlpatterns = [
    # Time entries
    path('', views.TimeEntryListView.as_view(), name='time_entry_list'),
    path('<int:pk>/', views.TimeEntryDetailView.as_view(), name='time_entry_detail'),
    path('create/', views.TimeEntryCreateView.as_view(), name='time_entry_create'),
    path('<int:pk>/update/', views.TimeEntryUpdateView.as_view(), name='time_entry_update'),
    path('<int:pk>/delete/', views.TimeEntryDeleteView.as_view(), name='time_entry_delete'),
    
    # Time entry actions
    path('<int:pk>/approve/', views.approve_time_entry, name='approve_time_entry'),
    path('<int:pk>/reject/', views.reject_time_entry, name='reject_time_entry'),
    
    # Summary
    path('summary/', views.time_summary, name='time_summary'),
] 