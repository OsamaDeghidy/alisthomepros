from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q, Count, Sum
from django.utils import timezone
from django.conf import settings
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from datetime import datetime, timedelta
import stripe
import json
from .models import (
    SubscriptionPlan, Subscription, SubscriptionUsage, 
    SubscriptionPayment, SubscriptionFeature, PlanFeature
)
from .serializers import (
    SubscriptionPlanSerializer, SubscriptionSerializer, SubscriptionCreateSerializer,
    SubscriptionUpdateSerializer, SubscriptionUsageSerializer, SubscriptionPaymentSerializer,
    SubscriptionStatsSerializer, StripeWebhookSerializer, SubscriptionPlanFilterSerializer,
    SubscriptionChangePlanSerializer, SubscriptionFeatureSerializer
)

# Configure Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY


class SubscriptionPlanListView(generics.ListAPIView):
    """قائمة خطط الاشتراكات"""
    serializer_class = SubscriptionPlanSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['user_type', 'plan_type', 'is_active', 'is_popular']
    search_fields = ['name', 'features']
    ordering_fields = ['price', 'created_at']
    ordering = ['user_type', 'price']
    
    def get_queryset(self):
        """Get active subscription plans"""
        return SubscriptionPlan.objects.filter(is_active=True).prefetch_related('plan_features__feature')
    
    @extend_schema(
        operation_id="list_subscription_plans",
        summary="List Subscription Plans",
        description="Get available subscription plans list",
        tags=["Subscriptions"],
        parameters=[
            OpenApiParameter(
                name="user_type",
                description="نوع المستخدم",
                required=False,
                type=OpenApiTypes.STR,
                enum=['home_pro', 'crew_member', 'specialist']
            ),
            OpenApiParameter(
                name="plan_type",
                description="نوع الخطة",
                required=False,
                type=OpenApiTypes.STR,
                enum=['basic', 'premium', 'flat_rate']
            ),
        ]
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class SubscriptionPlanDetailView(generics.RetrieveAPIView):
    """تفاصيل خطة الاشتراك"""
    serializer_class = SubscriptionPlanSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        return SubscriptionPlan.objects.filter(is_active=True).prefetch_related('plan_features__feature')
    
    @extend_schema(
        operation_id="get_subscription_plan_detail",
        summary="Subscription Plan Details",
        description="Get specific subscription plan details",
        tags=["Subscriptions"],
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class MySubscriptionView(APIView):
    """اشتراك المستخدم الحالي"""
    permission_classes = [permissions.IsAuthenticated]
    
    @extend_schema(
        operation_id="get_my_subscription",
        summary="اشتراكي الحالي",
        description="عرض اشتراك المستخدم الحالي",
        tags=["Subscriptions"],
    )
    def get(self, request):
        """Get current user's subscription"""
        try:
            subscription = Subscription.objects.get(user=request.user)
            serializer = SubscriptionSerializer(subscription)
            return Response(serializer.data)
        except Subscription.DoesNotExist:
            return Response({
                'error': 'No active subscription found'
            }, status=status.HTTP_404_NOT_FOUND)


class SubscriptionCreateView(generics.CreateAPIView):
    """إنشاء اشتراك جديد"""
    serializer_class = SubscriptionCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        """Create subscription with Stripe integration"""
        subscription = serializer.save()
        
        # Create Stripe customer if not exists
        if not subscription.stripe_customer_id:
            customer = stripe.Customer.create(
                email=subscription.user.email,
                name=subscription.user.get_full_name(),
                metadata={
                    'user_id': subscription.user.id,
                    'user_type': subscription.user.user_type
                }
            )
            subscription.stripe_customer_id = customer.id
            subscription.save()
        
        # Set trial period
        if subscription.plan.trial_days > 0:
            subscription.trial_end_date = timezone.now() + timedelta(days=subscription.plan.trial_days)
            subscription.status = 'trial'
            subscription.save()
        
        return subscription
    
    @extend_schema(
        operation_id="create_subscription",
        summary="Create New Subscription",
        description="Create new subscription with Stripe integration",
        tags=["Subscriptions"],
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class SubscriptionUpdateView(generics.UpdateAPIView):
    """تحديث الاشتراك"""
    serializer_class = SubscriptionUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        """Get user's subscription"""
        return Subscription.objects.get(user=self.request.user)
    
    @extend_schema(
        operation_id="update_subscription",
        summary="Update Subscription",
        description="Update subscription status",
        tags=["Subscriptions"],
    )
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)


class SubscriptionCancelView(APIView):
    """إلغاء الاشتراك"""
    permission_classes = [permissions.IsAuthenticated]
    
    @extend_schema(
        operation_id="cancel_subscription",
        summary="إلغاء الاشتراك",
        description="إلغاء الاشتراك الحالي",
        tags=["Subscriptions"],
    )
    def post(self, request):
        """Cancel subscription"""
        try:
            subscription = Subscription.objects.get(user=request.user)
            
            # Cancel on Stripe
            if subscription.stripe_subscription_id:
                stripe.Subscription.cancel(subscription.stripe_subscription_id)
            
            # Update subscription status
            subscription.status = 'cancelled'
            subscription.cancelled_at = timezone.now()
            subscription.save()
            
            return Response({
                'message': 'Subscription cancelled successfully',
                'subscription': SubscriptionSerializer(subscription).data
            })
            
        except Subscription.DoesNotExist:
            return Response({
                'error': 'No active subscription found'
            }, status=status.HTTP_404_NOT_FOUND)


class SubscriptionChangePlanView(APIView):
    """تغيير خطة الاشتراك"""
    permission_classes = [permissions.IsAuthenticated]
    
    @extend_schema(
        operation_id="change_subscription_plan",
        summary="تغيير خطة الاشتراك",
        description="تغيير إلى خطة اشتراك أخرى",
        tags=["Subscriptions"],
        request=SubscriptionChangePlanSerializer,
    )
    def post(self, request):
        """Change subscription plan"""
        try:
            subscription = Subscription.objects.get(user=request.user)
            serializer = SubscriptionChangePlanSerializer(
                data=request.data,
                context={'subscription': subscription}
            )
            
            if serializer.is_valid():
                new_plan_id = serializer.validated_data['new_plan_id']
                prorate = serializer.validated_data['prorate']
                
                new_plan = SubscriptionPlan.objects.get(id=new_plan_id)
                
                # Update on Stripe
                if subscription.stripe_subscription_id:
                    stripe.Subscription.modify(
                        subscription.stripe_subscription_id,
                        items=[{
                            'id': subscription.stripe_subscription_id,
                            'price': new_plan.stripe_price_id,
                        }],
                        proration_behavior='always_invoice' if prorate else 'none'
                    )
                
                # Update subscription
                subscription.plan = new_plan
                subscription.save()
                
                return Response({
                    'message': 'Plan changed successfully',
                    'subscription': SubscriptionSerializer(subscription).data
                })
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Subscription.DoesNotExist:
            return Response({
                'error': 'No active subscription found'
            }, status=status.HTTP_404_NOT_FOUND)


class SubscriptionUsageView(APIView):
    """استخدام الاشتراك"""
    permission_classes = [permissions.IsAuthenticated]
    
    @extend_schema(
        operation_id="get_subscription_usage",
        summary="استخدام الاشتراك",
        description="عرض استخدام الاشتراك الحالي",
        tags=["Subscriptions"],
    )
    def get(self, request):
        """Get subscription usage"""
        try:
            subscription = Subscription.objects.get(user=request.user)
            
            # Get current period usage
            current_period_start = subscription.current_period_start or subscription.start_date
            current_period_end = subscription.current_period_end or timezone.now()
            
            usage = SubscriptionUsage.objects.filter(
                subscription=subscription,
                period_start=current_period_start,
                period_end=current_period_end
            )
            
            serializer = SubscriptionUsageSerializer(usage, many=True)
            
            return Response({
                'subscription': SubscriptionSerializer(subscription).data,
                'usage': serializer.data,
                'period_start': current_period_start,
                'period_end': current_period_end
            })
            
        except Subscription.DoesNotExist:
            return Response({
                'error': 'No active subscription found'
            }, status=status.HTTP_404_NOT_FOUND)


class SubscriptionPaymentHistoryView(generics.ListAPIView):
    """تاريخ مدفوعات الاشتراك"""
    serializer_class = SubscriptionPaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Get user's subscription payments"""
        try:
            subscription = Subscription.objects.get(user=self.request.user)
            return SubscriptionPayment.objects.filter(subscription=subscription)
        except Subscription.DoesNotExist:
            return SubscriptionPayment.objects.none()
    
    @extend_schema(
        operation_id="get_subscription_payment_history",
        summary="تاريخ مدفوعات الاشتراك",
        description="عرض تاريخ مدفوعات الاشتراك",
        tags=["Subscriptions"],
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class StripeWebhookView(APIView):
    """Stripe Webhook Handler"""
    permission_classes = []
    
    def post(self, request):
        """Handle Stripe webhooks"""
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
        
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
        except ValueError:
            return Response({'error': 'Invalid payload'}, status=400)
        except stripe.error.SignatureVerificationError:
            return Response({'error': 'Invalid signature'}, status=400)
        
        # Handle the event
        if event['type'] == 'invoice.payment_succeeded':
            self.handle_payment_succeeded(event['data']['object'])
        elif event['type'] == 'invoice.payment_failed':
            self.handle_payment_failed(event['data']['object'])
        elif event['type'] == 'customer.subscription.updated':
            self.handle_subscription_updated(event['data']['object'])
        elif event['type'] == 'customer.subscription.deleted':
            self.handle_subscription_deleted(event['data']['object'])
        
        return Response({'status': 'success'})
    
    def handle_payment_succeeded(self, invoice):
        """Handle successful payment"""
        subscription_id = invoice['subscription']
        try:
            subscription = Subscription.objects.get(stripe_subscription_id=subscription_id)
            
            # Create payment record
            SubscriptionPayment.objects.create(
                subscription=subscription,
                amount=invoice['amount_paid'] / 100,  # Convert from cents
                currency=invoice['currency'],
                status='succeeded',
                period_start=datetime.fromtimestamp(invoice['period_start']),
                period_end=datetime.fromtimestamp(invoice['period_end']),
                stripe_payment_intent_id=invoice['payment_intent'],
                stripe_invoice_id=invoice['id'],
                paid_at=timezone.now()
            )
            
            # Update subscription status
            subscription.status = 'active'
            subscription.save()
            
        except Subscription.DoesNotExist:
            pass
    
    def handle_payment_failed(self, invoice):
        """Handle failed payment"""
        subscription_id = invoice['subscription']
        try:
            subscription = Subscription.objects.get(stripe_subscription_id=subscription_id)
            
            # Create payment record
            SubscriptionPayment.objects.create(
                subscription=subscription,
                amount=invoice['amount_due'] / 100,  # Convert from cents
                currency=invoice['currency'],
                status='failed',
                period_start=datetime.fromtimestamp(invoice['period_start']),
                period_end=datetime.fromtimestamp(invoice['period_end']),
                stripe_invoice_id=invoice['id']
            )
            
            # Update subscription status
            subscription.status = 'past_due'
            subscription.save()
            
        except Subscription.DoesNotExist:
            pass
    
    def handle_subscription_updated(self, subscription_data):
        """Handle subscription update"""
        try:
            subscription = Subscription.objects.get(
                stripe_subscription_id=subscription_data['id']
            )
            
            # Update subscription details
            subscription.status = subscription_data['status']
            subscription.current_period_start = datetime.fromtimestamp(
                subscription_data['current_period_start']
            )
            subscription.current_period_end = datetime.fromtimestamp(
                subscription_data['current_period_end']
            )
            subscription.save()
            
        except Subscription.DoesNotExist:
            pass
    
    def handle_subscription_deleted(self, subscription_data):
        """Handle subscription deletion"""
        try:
            subscription = Subscription.objects.get(
                stripe_subscription_id=subscription_data['id']
            )
            subscription.status = 'cancelled'
            subscription.ended_at = timezone.now()
            subscription.save()
            
        except Subscription.DoesNotExist:
            pass


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def subscription_stats(request):
    """إحصائيات الاشتراكات"""
    user = request.user
    
    # Check if user has admin permissions
    if not user.is_staff:
        return Response({
            'error': 'Permission denied'
        }, status=status.HTTP_403_FORBIDDEN)
    
    # Get subscription stats
    total_subscriptions = Subscription.objects.count()
    active_subscriptions = Subscription.objects.filter(status='active').count()
    trial_subscriptions = Subscription.objects.filter(status='trial').count()
    cancelled_subscriptions = Subscription.objects.filter(status='cancelled').count()
    expired_subscriptions = Subscription.objects.filter(status='expired').count()
    
    # Revenue stats
    current_month = timezone.now().replace(day=1)
    monthly_revenue = SubscriptionPayment.objects.filter(
        created_at__gte=current_month,
        status='succeeded'
    ).aggregate(total=Sum('amount'))['total'] or 0
    
    total_revenue = SubscriptionPayment.objects.filter(
        status='succeeded'
    ).aggregate(total=Sum('amount'))['total'] or 0
    
    # User type breakdown
    user_type_stats = Subscription.objects.values('plan__user_type').annotate(
        count=Count('id')
    )
    
    home_pro_subscriptions = next(
        (stat['count'] for stat in user_type_stats if stat['plan__user_type'] == 'home_pro'),
        0
    )
    crew_member_subscriptions = next(
        (stat['count'] for stat in user_type_stats if stat['plan__user_type'] == 'crew_member'),
        0
    )
    specialist_subscriptions = next(
        (stat['count'] for stat in user_type_stats if stat['plan__user_type'] == 'specialist'),
        0
    )
    
    # Plan type breakdown
    plan_type_stats = Subscription.objects.values('plan__plan_type').annotate(
        count=Count('id')
    )
    
    basic_subscriptions = next(
        (stat['count'] for stat in plan_type_stats if stat['plan__plan_type'] == 'basic'),
        0
    )
    premium_subscriptions = next(
        (stat['count'] for stat in plan_type_stats if stat['plan__plan_type'] == 'premium'),
        0
    )
    flat_rate_subscriptions = next(
        (stat['count'] for stat in plan_type_stats if stat['plan__plan_type'] == 'flat_rate'),
        0
    )
    
    stats = {
        'total_subscriptions': total_subscriptions,
        'active_subscriptions': active_subscriptions,
        'trial_subscriptions': trial_subscriptions,
        'cancelled_subscriptions': cancelled_subscriptions,
        'expired_subscriptions': expired_subscriptions,
        'monthly_revenue': monthly_revenue,
        'total_revenue': total_revenue,
        'home_pro_subscriptions': home_pro_subscriptions,
        'crew_member_subscriptions': crew_member_subscriptions,
        'specialist_subscriptions': specialist_subscriptions,
        'basic_subscriptions': basic_subscriptions,
        'premium_subscriptions': premium_subscriptions,
        'flat_rate_subscriptions': flat_rate_subscriptions,
    }
    
    serializer = SubscriptionStatsSerializer(stats)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def subscription_features(request):
    """ميزات الاشتراكات"""
    features = SubscriptionFeature.objects.all()
    serializer = SubscriptionFeatureSerializer(features, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def check_subscription_limit(request):
    """فحص حدود الاشتراك"""
    try:
        subscription = Subscription.objects.get(user=request.user)
        
        if not subscription.is_active():
            return Response({
                'error': 'Subscription is not active'
            }, status=status.HTTP_403_FORBIDDEN)
        
        usage_type = request.data.get('usage_type')
        
        if not usage_type:
            return Response({
                'error': 'usage_type is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get current usage
        current_period_start = subscription.current_period_start or subscription.start_date
        current_period_end = subscription.current_period_end or timezone.now()
        
        try:
            usage = SubscriptionUsage.objects.get(
                subscription=subscription,
                usage_type=usage_type,
                period_start=current_period_start,
                period_end=current_period_end
            )
            current_count = usage.count
        except SubscriptionUsage.DoesNotExist:
            current_count = 0
        
        # Get plan limits
        plan = subscription.plan
        limit = None
        
        if usage_type == 'project':
            limit = plan.project_limit
        elif usage_type == 'proposal':
            limit = plan.proposal_limit
        elif usage_type == 'message':
            limit = plan.message_limit
        
        # Check if limit is reached
        if limit is not None and current_count >= limit:
            return Response({
                'limit_reached': True,
                'current_count': current_count,
                'limit': limit,
                'message': f'You have reached the {usage_type} limit for your current plan'
            }, status=status.HTTP_403_FORBIDDEN)
        
        return Response({
            'limit_reached': False,
            'current_count': current_count,
            'limit': limit,
            'remaining': limit - current_count if limit else None
        })
        
    except Subscription.DoesNotExist:
        return Response({
            'error': 'No active subscription found'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def increment_usage(request):
    """زيادة استخدام الاشتراك"""
    try:
        subscription = Subscription.objects.get(user=request.user)
        
        if not subscription.is_active():
            return Response({
                'error': 'Subscription is not active'
            }, status=status.HTTP_403_FORBIDDEN)
        
        usage_type = request.data.get('usage_type')
        increment = request.data.get('increment', 1)
        
        if not usage_type:
            return Response({
                'error': 'usage_type is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get or create usage record
        current_period_start = subscription.current_period_start or subscription.start_date
        current_period_end = subscription.current_period_end or timezone.now()
        
        usage, created = SubscriptionUsage.objects.get_or_create(
            subscription=subscription,
            usage_type=usage_type,
            period_start=current_period_start,
            period_end=current_period_end,
            defaults={'count': 0}
        )
        
        # Increment usage
        usage.count += increment
        usage.save()
        
        return Response({
            'message': 'Usage incremented successfully',
            'usage': SubscriptionUsageSerializer(usage).data
        })
        
    except Subscription.DoesNotExist:
        return Response({
            'error': 'No active subscription found'
        }, status=status.HTTP_404_NOT_FOUND) 