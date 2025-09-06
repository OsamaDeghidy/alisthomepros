from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

class DashboardStats(models.Model):
    """Dashboard statistics for users"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='dashboard_stats')
    active_jobs = models.IntegerField(default=0)
    total_earned = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    proposals_sent = models.IntegerField(default=0)
    success_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    completed_jobs = models.IntegerField(default=0)
    pending_payments = models.IntegerField(default=0)
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    total_clients = models.IntegerField(default=0)
    monthly_earnings = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    weekly_earnings = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    jobs_this_month = models.IntegerField(default=0)
    proposals_this_month = models.IntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Dashboard Statistics"

    def __str__(self):
        return f"Dashboard Stats for {self.user.username}"

class DashboardNotification(models.Model):
    """Dashboard notifications"""
    NOTIFICATION_TYPES = [
        ('info', 'Information'),
        ('success', 'Success'),
        ('warning', 'Warning'),
        ('error', 'Error'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='dashboard_notifications')
    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(max_length=10, choices=NOTIFICATION_TYPES, default='info')
    read = models.BooleanField(default=False)
    link = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.user.username}"

class QuickAction(models.Model):
    """Quick actions for dashboard"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='quick_actions')
    title = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=50)
    link = models.CharField(max_length=200)
    color = models.CharField(max_length=20, default='primary')
    order = models.IntegerField(default=0)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'created_at']

    def __str__(self):
        return f"{self.title} - {self.user.username}"

class DashboardAnalytics(models.Model):
    """Dashboard analytics data"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='dashboard_analytics')
    earnings_chart_data = models.JSONField(default=dict)
    jobs_chart_data = models.JSONField(default=dict)
    proposals_chart_data = models.JSONField(default=dict)
    ratings_chart_data = models.JSONField(default=dict)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Dashboard Analytics"

    def __str__(self):
        return f"Analytics for {self.user.username}"

class PerformanceMetrics(models.Model):
    """Performance metrics for professionals"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='performance_metrics')
    completion_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    response_time = models.IntegerField(default=0)  # in hours
    client_satisfaction = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    repeat_clients = models.IntegerField(default=0)
    total_projects = models.IntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Performance Metrics"

    def __str__(self):
        return f"Performance Metrics for {self.user.username}"

class PendingAction(models.Model):
    """Pending actions for dashboard"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='pending_actions')
    pending_proposals = models.IntegerField(default=0)
    pending_contracts = models.IntegerField(default=0)
    pending_payments = models.IntegerField(default=0)
    pending_reviews = models.IntegerField(default=0)
    urgent_jobs = models.IntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Pending Actions"

    def __str__(self):
        return f"Pending Actions for {self.user.username}"
