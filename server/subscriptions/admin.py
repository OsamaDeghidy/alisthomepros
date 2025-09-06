from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import (
    SubscriptionPlan, Subscription, SubscriptionUsage, 
    SubscriptionPayment, SubscriptionFeature, PlanFeature
)


@admin.register(SubscriptionPlan)
class SubscriptionPlanAdmin(admin.ModelAdmin):
    """
    إدارة خطط الاشتراكات
    """
    list_display = (
        'name',
        'user_type',
        'plan_type',
        'price_display',
        'is_active',
        'is_popular',
        'trial_days',
        'subscriptions_count',
        'created_at',
    )
    
    list_filter = (
        'user_type',
        'plan_type',
        'is_active',
        'is_popular',
        'created_at',
    )
    
    search_fields = (
        'name',
        'features',
        'stripe_price_id',
    )
    
    readonly_fields = (
        'created_at',
        'updated_at',
    )
    
    fieldsets = (
        ('Basic Information', {
            'fields': (
                'name',
                'user_type',
                'plan_type',
                'price',
                'currency',
            )
        }),
        ('Features & Limits', {
            'fields': (
                'features',
                'project_limit',
                'proposal_limit',
                'message_limit',
            )
        }),
        ('Settings', {
            'fields': (
                'is_active',
                'is_popular',
                'trial_days',
            )
        }),
        ('Stripe Integration', {
            'fields': (
                'stripe_price_id',
            )
        }),
        ('Timestamps', {
            'fields': (
                'created_at',
                'updated_at',
            ),
            'classes': ('collapse',),
        }),
    )
    
    def price_display(self, obj):
        """Display price with currency"""
        return f"${obj.price} {obj.currency}"
    price_display.short_description = 'Price'
    
    def subscriptions_count(self, obj):
        """Count active subscriptions"""
        count = obj.subscriptions.filter(status__in=['active', 'trial']).count()
        return f"{count} active"
    subscriptions_count.short_description = 'Subscriptions'
    
    actions = ['activate_plans', 'deactivate_plans', 'mark_popular', 'unmark_popular']
    
    def activate_plans(self, request, queryset):
        """Activate selected plans"""
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} plans were activated.')
    activate_plans.short_description = 'Activate selected plans'
    
    def deactivate_plans(self, request, queryset):
        """Deactivate selected plans"""
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} plans were deactivated.')
    deactivate_plans.short_description = 'Deactivate selected plans'
    
    def mark_popular(self, request, queryset):
        """Mark plans as popular"""
        updated = queryset.update(is_popular=True)
        self.message_user(request, f'{updated} plans were marked as popular.')
    mark_popular.short_description = 'Mark as popular'
    
    def unmark_popular(self, request, queryset):
        """Unmark plans as popular"""
        updated = queryset.update(is_popular=False)
        self.message_user(request, f'{updated} plans were unmarked as popular.')
    unmark_popular.short_description = 'Unmark as popular'


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    """
    إدارة الاشتراكات
    """
    list_display = (
        'user_display',
        'plan',
        'status',
        'is_active_display',
        'is_trial_display',
        'days_remaining_display',
        'created_at',
    )
    
    list_filter = (
        'status',
        'plan__user_type',
        'plan__plan_type',
        'created_at',
    )
    
    search_fields = (
        'user__username',
        'user__email',
        'user__first_name',
        'user__last_name',
        'stripe_subscription_id',
        'stripe_customer_id',
    )
    
    readonly_fields = (
        'stripe_subscription_id',
        'stripe_customer_id',
        'created_at',
        'updated_at',
    )
    
    fieldsets = (
        ('Subscription Details', {
            'fields': (
                'user',
                'plan',
                'status',
            )
        }),
        ('Dates', {
            'fields': (
                'start_date',
                'trial_end_date',
                'current_period_start',
                'current_period_end',
                'cancelled_at',
                'ended_at',
            )
        }),
        ('Stripe Integration', {
            'fields': (
                'stripe_subscription_id',
                'stripe_customer_id',
            )
        }),
        ('Timestamps', {
            'fields': (
                'created_at',
                'updated_at',
            ),
            'classes': ('collapse',),
        }),
    )
    
    def user_display(self, obj):
        """Display user with link"""
        url = reverse('admin:authentication_user_change', args=[obj.user.id])
        return format_html('<a href="{}">{}</a>', url, obj.user.get_full_name())
    user_display.short_description = 'User'
    
    def is_active_display(self, obj):
        """Display active status"""
        return obj.is_active()
    is_active_display.boolean = True
    is_active_display.short_description = 'Active'
    
    def is_trial_display(self, obj):
        """Display trial status"""
        return obj.is_trial()
    is_trial_display.boolean = True
    is_trial_display.short_description = 'Trial'
    
    def days_remaining_display(self, obj):
        """Display days remaining"""
        if obj.is_trial():
            return f"{obj.trial_days_remaining()} trial days"
        return f"{obj.days_remaining()} days"
    days_remaining_display.short_description = 'Days Remaining'
    
    actions = ['activate_subscriptions', 'cancel_subscriptions']
    
    def activate_subscriptions(self, request, queryset):
        """Activate selected subscriptions"""
        updated = queryset.update(status='active')
        self.message_user(request, f'{updated} subscriptions were activated.')
    activate_subscriptions.short_description = 'Activate selected subscriptions'
    
    def cancel_subscriptions(self, request, queryset):
        """Cancel selected subscriptions"""
        updated = queryset.update(status='cancelled')
        self.message_user(request, f'{updated} subscriptions were cancelled.')
    cancel_subscriptions.short_description = 'Cancel selected subscriptions'


@admin.register(SubscriptionUsage)
class SubscriptionUsageAdmin(admin.ModelAdmin):
    """
    إدارة استخدام الاشتراكات
    """
    list_display = (
        'subscription_display',
        'usage_type',
        'count',
        'period_display',
        'created_at',
    )
    
    list_filter = (
        'usage_type',
        'subscription__plan__user_type',
        'created_at',
    )
    
    search_fields = (
        'subscription__user__username',
        'subscription__user__email',
    )
    
    readonly_fields = (
        'created_at',
        'updated_at',
    )
    
    def subscription_display(self, obj):
        """Display subscription with user"""
        return f"{obj.subscription.user.get_full_name()} - {obj.subscription.plan.name}"
    subscription_display.short_description = 'Subscription'
    
    def period_display(self, obj):
        """Display period"""
        return f"{obj.period_start.strftime('%Y-%m-%d')} to {obj.period_end.strftime('%Y-%m-%d')}"
    period_display.short_description = 'Period'


@admin.register(SubscriptionPayment)
class SubscriptionPaymentAdmin(admin.ModelAdmin):
    """
    إدارة مدفوعات الاشتراكات
    """
    list_display = (
        'subscription_display',
        'amount_display',
        'status',
        'period_display',
        'created_at',
    )
    
    list_filter = (
        'status',
        'currency',
        'subscription__plan__user_type',
        'created_at',
    )
    
    search_fields = (
        'subscription__user__username',
        'subscription__user__email',
        'stripe_payment_intent_id',
        'stripe_invoice_id',
    )
    
    readonly_fields = (
        'stripe_payment_intent_id',
        'stripe_invoice_id',
        'created_at',
        'updated_at',
        'paid_at',
    )
    
    fieldsets = (
        ('Payment Details', {
            'fields': (
                'subscription',
                'amount',
                'currency',
                'status',
            )
        }),
        ('Period', {
            'fields': (
                'period_start',
                'period_end',
            )
        }),
        ('Stripe Integration', {
            'fields': (
                'stripe_payment_intent_id',
                'stripe_invoice_id',
            )
        }),
        ('Additional Info', {
            'fields': (
                'description',
                'metadata',
            )
        }),
        ('Timestamps', {
            'fields': (
                'created_at',
                'updated_at',
                'paid_at',
            ),
            'classes': ('collapse',),
        }),
    )
    
    def subscription_display(self, obj):
        """Display subscription with user"""
        return f"{obj.subscription.user.get_full_name()} - {obj.subscription.plan.name}"
    subscription_display.short_description = 'Subscription'
    
    def amount_display(self, obj):
        """Display amount with currency"""
        return f"${obj.amount} {obj.currency}"
    amount_display.short_description = 'Amount'
    
    def period_display(self, obj):
        """Display period"""
        return f"{obj.period_start.strftime('%Y-%m-%d')} to {obj.period_end.strftime('%Y-%m-%d')}"
    period_display.short_description = 'Period'


@admin.register(SubscriptionFeature)
class SubscriptionFeatureAdmin(admin.ModelAdmin):
    """
    إدارة ميزات الاشتراكات
    """
    list_display = (
        'name',
        'key',
        'feature_type',
        'created_at',
    )
    
    list_filter = (
        'feature_type',
        'created_at',
    )
    
    search_fields = (
        'name',
        'key',
        'description',
    )
    
    readonly_fields = (
        'created_at',
        'updated_at',
    )


@admin.register(PlanFeature)
class PlanFeatureAdmin(admin.ModelAdmin):
    """
    إدارة ميزات الخطط
    """
    list_display = (
        'plan',
        'feature',
        'value_display',
        'created_at',
    )
    
    list_filter = (
        'plan__user_type',
        'plan__plan_type',
        'feature__feature_type',
        'created_at',
    )
    
    search_fields = (
        'plan__name',
        'feature__name',
    )
    
    readonly_fields = (
        'created_at',
        'updated_at',
    )
    
    def value_display(self, obj):
        """Display feature value"""
        return str(obj.value)
    value_display.short_description = 'Value' 