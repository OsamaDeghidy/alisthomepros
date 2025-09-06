from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from decimal import Decimal
import uuid

User = get_user_model()


class SubscriptionPlan(models.Model):
    """
    خطط الاشتراكات
    """
    USER_TYPE_CHOICES = [
        ('home_pro', 'Home Pro'),
        ('crew_member', 'Crew Member'),
        ('specialist', 'Specialist'),
    ]
    
    PLAN_TYPE_CHOICES = [
        ('basic', 'Basic'),
        ('premium', 'Premium'),
        ('flat_rate', 'Flat Rate'),
    ]
    
    name = models.CharField(max_length=100)
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES)
    plan_type = models.CharField(max_length=20, choices=PLAN_TYPE_CHOICES)
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    currency = models.CharField(max_length=3, default='USD')
    
    # Features
    features = models.JSONField(default=list, help_text='List of features included')
    
    # Limits
    project_limit = models.PositiveIntegerField(null=True, blank=True)
    proposal_limit = models.PositiveIntegerField(null=True, blank=True)
    message_limit = models.PositiveIntegerField(null=True, blank=True)
    
    # Settings
    is_active = models.BooleanField(default=True)
    is_popular = models.BooleanField(default=False)
    trial_days = models.PositiveIntegerField(default=7)
    
    # Stripe Integration
    stripe_price_id = models.CharField(max_length=255, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'subscription_plans'
        verbose_name = 'Subscription Plan'
        verbose_name_plural = 'Subscription Plans'
        ordering = ['user_type', 'price']
        unique_together = ['user_type', 'plan_type']
    
    def __str__(self):
        return f"{self.get_user_type_display()} - {self.name} (${self.price})"


class Subscription(models.Model):
    """
    اشتراكات المستخدمين
    """
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('trial', 'Trial'),
        ('cancelled', 'Cancelled'),
        ('past_due', 'Past Due'),
        ('unpaid', 'Unpaid'),
        ('expired', 'Expired'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='subscription')
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.CASCADE, related_name='subscriptions')
    
    # Subscription Details
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='trial')
    
    # Dates
    start_date = models.DateTimeField(default=timezone.now)
    trial_end_date = models.DateTimeField(null=True, blank=True)
    current_period_start = models.DateTimeField(null=True, blank=True)
    current_period_end = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    
    # Stripe Integration
    stripe_subscription_id = models.CharField(max_length=255, blank=True)
    stripe_customer_id = models.CharField(max_length=255, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'subscriptions'
        verbose_name = 'Subscription'
        verbose_name_plural = 'Subscriptions'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['status']),
            models.Index(fields=['stripe_subscription_id']),
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.plan.name} ({self.status})"
    
    def is_active(self):
        """Check if subscription is active"""
        return self.status in ['active', 'trial']
    
    def is_trial(self):
        """Check if subscription is in trial period"""
        return self.status == 'trial'
    
    def days_remaining(self):
        """Get days remaining in current period"""
        if self.current_period_end:
            delta = self.current_period_end - timezone.now()
            return max(0, delta.days)
        return 0
    
    def trial_days_remaining(self):
        """Get trial days remaining"""
        if self.trial_end_date and self.status == 'trial':
            delta = self.trial_end_date - timezone.now()
            return max(0, delta.days)
        return 0


class SubscriptionUsage(models.Model):
    """
    استخدام الاشتراكات
    """
    USAGE_TYPE_CHOICES = [
        ('project', 'Project'),
        ('proposal', 'Proposal'),
        ('message', 'Message'),
        ('feature', 'Feature'),
    ]
    
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE, related_name='usage')
    usage_type = models.CharField(max_length=20, choices=USAGE_TYPE_CHOICES)
    count = models.PositiveIntegerField(default=0)
    
    # Period tracking
    period_start = models.DateTimeField()
    period_end = models.DateTimeField()
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'subscription_usage'
        verbose_name = 'Subscription Usage'
        verbose_name_plural = 'Subscription Usage'
        unique_together = ['subscription', 'usage_type', 'period_start']
    
    def __str__(self):
        return f"{self.subscription.user.username} - {self.usage_type}: {self.count}"


class SubscriptionPayment(models.Model):
    """
    مدفوعات الاشتراكات
    """
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('succeeded', 'Succeeded'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
        ('refunded', 'Refunded'),
    ]
    
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Period
    period_start = models.DateTimeField()
    period_end = models.DateTimeField()
    
    # Stripe Integration
    stripe_payment_intent_id = models.CharField(max_length=255, blank=True)
    stripe_invoice_id = models.CharField(max_length=255, blank=True)
    
    # Metadata
    description = models.TextField(blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'subscription_payments'
        verbose_name = 'Subscription Payment'
        verbose_name_plural = 'Subscription Payments'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.subscription.user.username} - ${self.amount} ({self.status})"


class SubscriptionFeature(models.Model):
    """
    ميزات الاشتراكات
    """
    FEATURE_TYPE_CHOICES = [
        ('boolean', 'Boolean'),
        ('numeric', 'Numeric'),
        ('text', 'Text'),
    ]
    
    name = models.CharField(max_length=100, unique=True)
    key = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    feature_type = models.CharField(max_length=20, choices=FEATURE_TYPE_CHOICES, default='boolean')
    
    # Default values
    default_value = models.JSONField(default=dict)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'subscription_features'
        verbose_name = 'Subscription Feature'
        verbose_name_plural = 'Subscription Features'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class PlanFeature(models.Model):
    """
    ميزات الخطط
    """
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.CASCADE, related_name='plan_features')
    feature = models.ForeignKey(SubscriptionFeature, on_delete=models.CASCADE, related_name='plan_features')
    
    # Feature value
    value = models.JSONField(default=dict)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'plan_features'
        verbose_name = 'Plan Feature'
        verbose_name_plural = 'Plan Features'
        unique_together = ['plan', 'feature']
    
    def __str__(self):
        return f"{self.plan.name} - {self.feature.name}" 