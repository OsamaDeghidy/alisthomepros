from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import SubscriptionPlan, Subscription, SubscriptionUsage, SubscriptionPayment, SubscriptionFeature, PlanFeature

User = get_user_model()


class SubscriptionFeatureSerializer(serializers.ModelSerializer):
    """Serializer لميزات الاشتراكات"""
    
    class Meta:
        model = SubscriptionFeature
        fields = ['id', 'name', 'key', 'description', 'feature_type', 'default_value']


class PlanFeatureSerializer(serializers.ModelSerializer):
    """Serializer لميزات الخطط"""
    feature = SubscriptionFeatureSerializer(read_only=True)
    
    class Meta:
        model = PlanFeature
        fields = ['id', 'feature', 'value']


class SubscriptionPlanSerializer(serializers.ModelSerializer):
    """Serializer لخطط الاشتراكات"""
    plan_features = PlanFeatureSerializer(many=True, read_only=True)
    
    class Meta:
        model = SubscriptionPlan
        fields = [
            'id', 'name', 'user_type', 'plan_type', 'price', 'currency',
            'features', 'project_limit', 'proposal_limit', 'message_limit',
            'is_active', 'is_popular', 'trial_days', 'stripe_price_id',
            'plan_features', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class SubscriptionUsageSerializer(serializers.ModelSerializer):
    """Serializer لاستخدام الاشتراكات"""
    
    class Meta:
        model = SubscriptionUsage
        fields = [
            'id', 'subscription', 'usage_type', 'count',
            'period_start', 'period_end', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class SubscriptionPaymentSerializer(serializers.ModelSerializer):
    """Serializer لمدفوعات الاشتراكات"""
    
    class Meta:
        model = SubscriptionPayment
        fields = [
            'id', 'subscription', 'amount', 'currency', 'status',
            'period_start', 'period_end', 'stripe_payment_intent_id',
            'stripe_invoice_id', 'description', 'metadata',
            'created_at', 'updated_at', 'paid_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'paid_at']


class SubscriptionSerializer(serializers.ModelSerializer):
    """Serializer للاشتراكات"""
    plan = SubscriptionPlanSerializer(read_only=True)
    usage = SubscriptionUsageSerializer(many=True, read_only=True)
    payments = SubscriptionPaymentSerializer(many=True, read_only=True)
    user_info = serializers.SerializerMethodField()
    is_active = serializers.SerializerMethodField()
    is_trial = serializers.SerializerMethodField()
    days_remaining = serializers.SerializerMethodField()
    trial_days_remaining = serializers.SerializerMethodField()
    
    class Meta:
        model = Subscription
        fields = [
            'id', 'user', 'plan', 'status', 'start_date', 'trial_end_date',
            'current_period_start', 'current_period_end', 'cancelled_at',
            'ended_at', 'stripe_subscription_id', 'stripe_customer_id',
            'usage', 'payments', 'user_info', 'is_active', 'is_trial',
            'days_remaining', 'trial_days_remaining', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'stripe_subscription_id', 'stripe_customer_id',
            'created_at', 'updated_at'
        ]
    
    def get_user_info(self, obj):
        """Get user information"""
        return {
            'id': obj.user.id,
            'username': obj.user.username,
            'email': obj.user.email,
            'first_name': obj.user.first_name,
            'last_name': obj.user.last_name,
            'user_type': obj.user.user_type,
        }
    
    def get_is_active(self, obj):
        """Check if subscription is active"""
        return obj.is_active()
    
    def get_is_trial(self, obj):
        """Check if subscription is in trial"""
        return obj.is_trial()
    
    def get_days_remaining(self, obj):
        """Get days remaining in current period"""
        return obj.days_remaining()
    
    def get_trial_days_remaining(self, obj):
        """Get trial days remaining"""
        return obj.trial_days_remaining()


class SubscriptionCreateSerializer(serializers.ModelSerializer):
    """Serializer لإنشاء اشتراك جديد"""
    plan_id = serializers.IntegerField(write_only=True)
    payment_method_id = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = Subscription
        fields = ['plan_id', 'payment_method_id']
    
    def validate_plan_id(self, value):
        """Validate plan exists and is active"""
        try:
            plan = SubscriptionPlan.objects.get(id=value, is_active=True)
            return value
        except SubscriptionPlan.DoesNotExist:
            raise serializers.ValidationError("Invalid or inactive plan")
    
    def create(self, validated_data):
        """Create new subscription"""
        plan_id = validated_data.pop('plan_id')
        payment_method_id = validated_data.pop('payment_method_id', None)
        
        plan = SubscriptionPlan.objects.get(id=plan_id)
        user = self.context['request'].user
        
        # Check if user already has a subscription
        if hasattr(user, 'subscription'):
            raise serializers.ValidationError("User already has an active subscription")
        
        # Check if user type matches plan
        if user.user_type != plan.user_type:
            raise serializers.ValidationError("Plan not available for this user type")
        
        # Create subscription
        subscription = Subscription.objects.create(
            user=user,
            plan=plan,
            **validated_data
        )
        
        return subscription


class SubscriptionUpdateSerializer(serializers.ModelSerializer):
    """Serializer لتحديث الاشتراك"""
    
    class Meta:
        model = Subscription
        fields = ['status']
    
    def update(self, instance, validated_data):
        """Update subscription"""
        # Add business logic for status changes
        new_status = validated_data.get('status')
        
        if new_status == 'cancelled':
            instance.cancelled_at = timezone.now()
        elif new_status == 'expired':
            instance.ended_at = timezone.now()
        
        return super().update(instance, validated_data)


class SubscriptionStatsSerializer(serializers.Serializer):
    """Serializer لإحصائيات الاشتراكات"""
    total_subscriptions = serializers.IntegerField()
    active_subscriptions = serializers.IntegerField()
    trial_subscriptions = serializers.IntegerField()
    cancelled_subscriptions = serializers.IntegerField()
    expired_subscriptions = serializers.IntegerField()
    
    # Revenue stats
    monthly_revenue = serializers.DecimalField(max_digits=15, decimal_places=2)
    total_revenue = serializers.DecimalField(max_digits=15, decimal_places=2)
    
    # User type breakdown
    home_pro_subscriptions = serializers.IntegerField()
    crew_member_subscriptions = serializers.IntegerField()
    specialist_subscriptions = serializers.IntegerField()
    
    # Plan breakdown
    basic_subscriptions = serializers.IntegerField()
    premium_subscriptions = serializers.IntegerField()
    flat_rate_subscriptions = serializers.IntegerField()


class StripeWebhookSerializer(serializers.Serializer):
    """Serializer لـ Stripe webhooks"""
    type = serializers.CharField()
    data = serializers.DictField()
    
    def validate_type(self, value):
        """Validate webhook type"""
        allowed_types = [
            'invoice.payment_succeeded',
            'invoice.payment_failed',
            'customer.subscription.created',
            'customer.subscription.updated',
            'customer.subscription.deleted',
            'customer.subscription.trial_will_end',
        ]
        
        if value not in allowed_types:
            raise serializers.ValidationError("Unsupported webhook type")
        
        return value


class SubscriptionPlanFilterSerializer(serializers.Serializer):
    """Serializer لفلترة خطط الاشتراكات"""
    user_type = serializers.ChoiceField(
        choices=SubscriptionPlan.USER_TYPE_CHOICES,
        required=False
    )
    plan_type = serializers.ChoiceField(
        choices=SubscriptionPlan.PLAN_TYPE_CHOICES,
        required=False
    )
    is_active = serializers.BooleanField(required=False)
    is_popular = serializers.BooleanField(required=False)
    price_min = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    price_max = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    
    def validate(self, attrs):
        """Validate price range"""
        price_min = attrs.get('price_min')
        price_max = attrs.get('price_max')
        
        if price_min is not None and price_max is not None:
            if price_min > price_max:
                raise serializers.ValidationError("price_min cannot be greater than price_max")
        
        return attrs


class SubscriptionChangePlanSerializer(serializers.Serializer):
    """Serializer لتغيير خطة الاشتراك"""
    new_plan_id = serializers.IntegerField()
    prorate = serializers.BooleanField(default=True)
    
    def validate_new_plan_id(self, value):
        """Validate new plan exists and is active"""
        try:
            plan = SubscriptionPlan.objects.get(id=value, is_active=True)
            return value
        except SubscriptionPlan.DoesNotExist:
            raise serializers.ValidationError("Invalid or inactive plan")
    
    def validate(self, attrs):
        """Validate plan change"""
        new_plan_id = attrs.get('new_plan_id')
        subscription = self.context.get('subscription')
        
        if subscription and subscription.plan.id == new_plan_id:
            raise serializers.ValidationError("Cannot change to the same plan")
        
        # Check if user type matches new plan
        new_plan = SubscriptionPlan.objects.get(id=new_plan_id)
        if subscription and subscription.user.user_type != new_plan.user_type:
            raise serializers.ValidationError("New plan not available for this user type")
        
        return attrs


# Import timezone for serializer
from django.utils import timezone 