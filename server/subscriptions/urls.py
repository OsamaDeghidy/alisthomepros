from django.urls import path
from . import views

app_name = 'subscriptions'

urlpatterns = [
    # Subscription Plans
    path('plans/', views.SubscriptionPlanListView.as_view(), name='plan_list'),
    path('plans/<int:pk>/', views.SubscriptionPlanDetailView.as_view(), name='plan_detail'),
    
    # My Subscription
    path('my-subscription/', views.MySubscriptionView.as_view(), name='my_subscription'),
    path('create/', views.SubscriptionCreateView.as_view(), name='create_subscription'),
    path('update/', views.SubscriptionUpdateView.as_view(), name='update_subscription'),
    path('cancel/', views.SubscriptionCancelView.as_view(), name='cancel_subscription'),
    path('change-plan/', views.SubscriptionChangePlanView.as_view(), name='change_plan'),
    
    # Usage & Payments
    path('usage/', views.SubscriptionUsageView.as_view(), name='subscription_usage'),
    path('payments/', views.SubscriptionPaymentHistoryView.as_view(), name='payment_history'),
    
    # Stripe Integration
    path('webhook/', views.StripeWebhookView.as_view(), name='stripe_webhook'),
    
    # Utility endpoints
    path('stats/', views.subscription_stats, name='subscription_stats'),
    path('features/', views.subscription_features, name='subscription_features'),
    path('check-limit/', views.check_subscription_limit, name='check_limit'),
    path('increment-usage/', views.increment_usage, name='increment_usage'),
] 