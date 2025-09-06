from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import SubscriptionPlan, Subscription, SubscriptionFeature, PlanFeature
from decimal import Decimal

User = get_user_model()


class SubscriptionPlanModelTest(TestCase):
    """Test SubscriptionPlan model"""
    
    def setUp(self):
        self.plan = SubscriptionPlan.objects.create(
            name='Home Pro Basic',
            user_type='home_pro',
            plan_type='basic',
            price=Decimal('150.00'),
            features=['Feature 1', 'Feature 2'],
            project_limit=10,
            is_active=True
        )
    
    def test_plan_creation(self):
        """Test plan creation"""
        self.assertEqual(self.plan.name, 'Home Pro Basic')
        self.assertEqual(self.plan.user_type, 'home_pro')
        self.assertEqual(self.plan.price, Decimal('150.00'))
        self.assertTrue(self.plan.is_active)
    
    def test_plan_str_method(self):
        """Test plan string representation"""
        expected = "Home Pro - Home Pro Basic ($150.00)"
        self.assertEqual(str(self.plan), expected)


class SubscriptionModelTest(TestCase):
    """Test Subscription model"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            user_type='home_pro'
        )
        
        self.plan = SubscriptionPlan.objects.create(
            name='Home Pro Basic',
            user_type='home_pro',
            plan_type='basic',
            price=Decimal('150.00'),
            trial_days=7
        )
        
        self.subscription = Subscription.objects.create(
            user=self.user,
            plan=self.plan,
            status='trial'
        )
    
    def test_subscription_creation(self):
        """Test subscription creation"""
        self.assertEqual(self.subscription.user, self.user)
        self.assertEqual(self.subscription.plan, self.plan)
        self.assertEqual(self.subscription.status, 'trial')
    
    def test_is_active_method(self):
        """Test is_active method"""
        self.assertTrue(self.subscription.is_active())
        
        self.subscription.status = 'cancelled'
        self.subscription.save()
        self.assertFalse(self.subscription.is_active())
    
    def test_is_trial_method(self):
        """Test is_trial method"""
        self.assertTrue(self.subscription.is_trial())
        
        self.subscription.status = 'active'
        self.subscription.save()
        self.assertFalse(self.subscription.is_trial())


class SubscriptionAPITest(APITestCase):
    """Test Subscription API endpoints"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            user_type='home_pro'
        )
        
        self.plan = SubscriptionPlan.objects.create(
            name='Home Pro Basic',
            user_type='home_pro',
            plan_type='basic',
            price=Decimal('150.00'),
            is_active=True
        )
        
        self.client.force_authenticate(user=self.user)
    
    def test_list_subscription_plans(self):
        """Test listing subscription plans"""
        url = reverse('subscriptions:plan_list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Home Pro Basic')
    
    def test_get_subscription_plan_detail(self):
        """Test getting subscription plan details"""
        url = reverse('subscriptions:plan_detail', kwargs={'pk': self.plan.pk})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Home Pro Basic')
        self.assertEqual(response.data['price'], '150.00')
    
    def test_create_subscription(self):
        """Test creating a new subscription"""
        url = reverse('subscriptions:create_subscription')
        data = {
            'plan_id': self.plan.pk
        }
        
        response = self.client.post(url, data)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Subscription.objects.filter(user=self.user).exists())
    
    def test_get_my_subscription(self):
        """Test getting current user's subscription"""
        # Create subscription first
        subscription = Subscription.objects.create(
            user=self.user,
            plan=self.plan,
            status='active'
        )
        
        url = reverse('subscriptions:my_subscription')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], subscription.id)
        self.assertEqual(response.data['status'], 'active')
    
    def test_get_my_subscription_not_found(self):
        """Test getting subscription when none exists"""
        url = reverse('subscriptions:my_subscription')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_cancel_subscription(self):
        """Test cancelling subscription"""
        subscription = Subscription.objects.create(
            user=self.user,
            plan=self.plan,
            status='active'
        )
        
        url = reverse('subscriptions:cancel_subscription')
        response = self.client.post(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        subscription.refresh_from_db()
        self.assertEqual(subscription.status, 'cancelled')
        self.assertIsNotNone(subscription.cancelled_at)


class SubscriptionFeatureTest(TestCase):
    """Test SubscriptionFeature model"""
    
    def setUp(self):
        self.feature = SubscriptionFeature.objects.create(
            name='Priority Support',
            key='priority_support',
            description='Priority customer support',
            feature_type='boolean',
            default_value={'enabled': False}
        )
    
    def test_feature_creation(self):
        """Test feature creation"""
        self.assertEqual(self.feature.name, 'Priority Support')
        self.assertEqual(self.feature.key, 'priority_support')
        self.assertEqual(self.feature.feature_type, 'boolean')
    
    def test_feature_str_method(self):
        """Test feature string representation"""
        self.assertEqual(str(self.feature), 'Priority Support')


class PlanFeatureTest(TestCase):
    """Test PlanFeature model"""
    
    def setUp(self):
        self.plan = SubscriptionPlan.objects.create(
            name='Home Pro Premium',
            user_type='home_pro',
            plan_type='premium',
            price=Decimal('275.00')
        )
        
        self.feature = SubscriptionFeature.objects.create(
            name='Priority Support',
            key='priority_support',
            feature_type='boolean'
        )
        
        self.plan_feature = PlanFeature.objects.create(
            plan=self.plan,
            feature=self.feature,
            value={'enabled': True}
        )
    
    def test_plan_feature_creation(self):
        """Test plan feature creation"""
        self.assertEqual(self.plan_feature.plan, self.plan)
        self.assertEqual(self.plan_feature.feature, self.feature)
        self.assertEqual(self.plan_feature.value, {'enabled': True})
    
    def test_plan_feature_str_method(self):
        """Test plan feature string representation"""
        expected = "Home Pro Premium - Priority Support"
        self.assertEqual(str(self.plan_feature), expected) 