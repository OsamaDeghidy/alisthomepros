from django.urls import path
from . import views

app_name = 'notifications'

urlpatterns = [
    # Notifications
    path('', views.NotificationListView.as_view(), name='notification_list'),
    path('<int:pk>/', views.NotificationDetailView.as_view(), name='notification_detail'),
    path('<int:pk>/update/', views.NotificationUpdateView.as_view(), name='notification_update'),
    
    # Actions
    path('mark-all-read/', views.mark_all_read, name='mark_all_read'),
    path('stats/', views.notification_stats, name='notification_stats'),
    path('send-test/', views.send_test_notification, name='send_test_notification'),
]