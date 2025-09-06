from rest_framework import serializers
from .models import (
    DashboardStats, DashboardNotification, QuickAction, 
    DashboardAnalytics, PerformanceMetrics, PendingAction
)
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """Serializer for user data"""
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'avatar']

class DashboardStatsSerializer(serializers.ModelSerializer):
    """Serializer for dashboard statistics"""
    class Meta:
        model = DashboardStats
        fields = '__all__'

class DashboardNotificationSerializer(serializers.ModelSerializer):
    """Serializer for dashboard notifications"""
    class Meta:
        model = DashboardNotification
        fields = '__all__'

class QuickActionSerializer(serializers.ModelSerializer):
    """Serializer for quick actions"""
    class Meta:
        model = QuickAction
        fields = '__all__'

class DashboardAnalyticsSerializer(serializers.ModelSerializer):
    """Serializer for dashboard analytics"""
    class Meta:
        model = DashboardAnalytics
        fields = '__all__'

class PerformanceMetricsSerializer(serializers.ModelSerializer):
    """Serializer for performance metrics"""
    class Meta:
        model = PerformanceMetrics
        fields = '__all__'

class PendingActionSerializer(serializers.ModelSerializer):
    """Serializer for pending actions"""
    class Meta:
        model = PendingAction
        fields = '__all__'

# Complex serializers for dashboard data
class ActiveJobSerializer(serializers.Serializer):
    """Serializer for active jobs in dashboard"""
    id = serializers.IntegerField()
    title = serializers.CharField()
    client = UserSerializer()
    status = serializers.CharField()
    progress = serializers.IntegerField()
    budget = serializers.DecimalField(max_digits=10, decimal_places=2)
    deadline = serializers.DateField()
    location = serializers.CharField()
    category = serializers.CharField()
    priority = serializers.CharField()
    last_update = serializers.DateTimeField()
    contract_type = serializers.CharField()
    created_at = serializers.DateTimeField()
    updated_at = serializers.DateTimeField()

class NewJobSerializer(serializers.Serializer):
    """Serializer for new jobs in dashboard"""
    id = serializers.IntegerField()
    title = serializers.CharField()
    client = UserSerializer()
    budget_min = serializers.DecimalField(max_digits=10, decimal_places=2)
    budget_max = serializers.DecimalField(max_digits=10, decimal_places=2)
    location = serializers.CharField()
    category = serializers.CharField()
    posted_time = serializers.DateTimeField()
    proposals_count = serializers.IntegerField()
    time_left = serializers.CharField()
    verified = serializers.BooleanField()
    urgent = serializers.BooleanField()
    description = serializers.CharField()
    created_at = serializers.DateTimeField()

class RecentMessageSerializer(serializers.Serializer):
    """Serializer for recent messages in dashboard"""
    id = serializers.IntegerField()
    from_user = UserSerializer(source='from')
    message = serializers.CharField()
    time = serializers.DateTimeField()
    unread = serializers.BooleanField()
    project = serializers.DictField()
    created_at = serializers.DateTimeField()

class RecentEarningSerializer(serializers.Serializer):
    """Serializer for recent earnings in dashboard"""
    id = serializers.IntegerField()
    project = serializers.DictField()
    client = UserSerializer()
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    date = serializers.DateField()
    status = serializers.CharField()
    type = serializers.CharField()
    created_at = serializers.DateTimeField()

class DashboardAnalyticsDataSerializer(serializers.Serializer):
    """Serializer for dashboard analytics data"""
    earnings_chart = serializers.DictField()
    jobs_chart = serializers.DictField()
    proposals_chart = serializers.DictField()
    ratings_chart = serializers.DictField()

class DashboardResponseSerializer(serializers.Serializer):
    """Complete dashboard response serializer"""
    stats = DashboardStatsSerializer()
    active_jobs = ActiveJobSerializer(many=True)
    new_jobs = NewJobSerializer(many=True)
    recent_messages = RecentMessageSerializer(many=True)
    recent_earnings = RecentEarningSerializer(many=True)
    analytics = DashboardAnalyticsDataSerializer()

class ProfessionalDashboardSerializer(serializers.Serializer):
    """Professional dashboard specific serializer"""
    stats = DashboardStatsSerializer()
    active_jobs = ActiveJobSerializer(many=True)
    new_jobs = NewJobSerializer(many=True)
    recent_messages = RecentMessageSerializer(many=True)
    recent_earnings = RecentEarningSerializer(many=True)
    analytics = DashboardAnalyticsDataSerializer()
    performance_metrics = PerformanceMetricsSerializer()
    pending_actions = PendingActionSerializer()
    notifications = DashboardNotificationSerializer(many=True)
    quick_actions = QuickActionSerializer(many=True)

class ClientDashboardSerializer(serializers.Serializer):
    """Client dashboard specific serializer"""
    stats = DashboardStatsSerializer()
    active_projects = ActiveJobSerializer(many=True)
    recent_messages = RecentMessageSerializer(many=True)
    analytics = DashboardAnalyticsDataSerializer()
    pending_actions = PendingActionSerializer()
    notifications = DashboardNotificationSerializer(many=True)
    quick_actions = QuickActionSerializer(many=True) 