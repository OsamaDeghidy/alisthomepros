from django.urls import path
from . import views
from django.http import JsonResponse

def test_view(request):
    return JsonResponse({"message": "Dashboard URLs are working!", "status": "success"})

urlpatterns = [
    # Test endpoint
    path('test/', test_view, name='dashboard_test'),
    
    # Dashboard endpoints
    path('professional/', views.professional_dashboard, name='professional_dashboard'),
    path('client/', views.client_dashboard, name='client_dashboard'),
    path('stats/', views.dashboard_stats, name='dashboard_stats'),
    path('active-jobs/', views.active_jobs, name='active_jobs'),
    path('new-jobs/', views.new_jobs, name='new_jobs'),
    path('recent-messages/', views.recent_messages, name='recent_messages'),
    path('recent-earnings/', views.recent_earnings, name='recent_earnings'),
    path('analytics/', views.dashboard_analytics, name='dashboard_analytics'),
    path('job-recommendations/', views.job_recommendations, name='job_recommendations'),
    path('performance-metrics/', views.performance_metrics, name='performance_metrics'),
    path('upcoming-deadlines/', views.upcoming_deadlines, name='upcoming_deadlines'),
    path('pending-actions/', views.pending_actions, name='pending_actions'),
    path('notifications/', views.notifications, name='notifications'),
    path('quick-actions/', views.quick_actions, name='quick_actions'),
    
    # Action endpoints
    path('jobs/<int:job_id>/progress/', views.update_job_progress, name='update_job_progress'),
    path('messages/<int:message_id>/read/', views.mark_message_read, name='mark_message_read'),
    path('notifications/<int:notification_id>/read/', views.mark_notification_read, name='mark_notification_read'),
] 