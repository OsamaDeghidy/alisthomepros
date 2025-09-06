from django.core.management.base import BaseCommand
from django.db import transaction
from subscriptions.models import SubscriptionPlan, SubscriptionFeature, PlanFeature
from decimal import Decimal


class Command(BaseCommand):
    help = 'Create initial subscription plans'

    def handle(self, *args, **options):
        self.stdout.write('Creating subscription plans...')
        
        with transaction.atomic():
            # Create features first
            features = self.create_features()
            
            # Create subscription plans
            plans = self.create_plans()
            
            # Link features to plans
            self.link_features_to_plans(plans, features)
        
        self.stdout.write(
            self.style.SUCCESS('Successfully created subscription plans!')
        )

    def create_features(self):
        """Create subscription features"""
        features_data = [
            {
                'name': 'Project Access',
                'key': 'project_access',
                'description': 'Access to submit project proposals',
                'feature_type': 'boolean',
                'default_value': {'enabled': False}
            },
            {
                'name': 'Priority Support',
                'key': 'priority_support',
                'description': 'Priority customer support',
                'feature_type': 'boolean',
                'default_value': {'enabled': False}
            },
            {
                'name': 'Advanced Marketing',
                'key': 'advanced_marketing',
                'description': 'Advanced marketing toolkit',
                'feature_type': 'boolean',
                'default_value': {'enabled': False}
            },
            {
                'name': 'Featured Listing',
                'key': 'featured_listing',
                'description': 'Featured profile listing',
                'feature_type': 'boolean',
                'default_value': {'enabled': False}
            },
            {
                'name': 'Portfolio Builder',
                'key': 'portfolio_builder',
                'description': 'Custom portfolio builder',
                'feature_type': 'boolean',
                'default_value': {'enabled': False}
            },
            {
                'name': 'Lead Generation',
                'key': 'lead_generation',
                'description': 'Lead generation tools',
                'feature_type': 'boolean',
                'default_value': {'enabled': False}
            },
            {
                'name': 'Analytics',
                'key': 'analytics',
                'description': 'Advanced analytics and reporting',
                'feature_type': 'boolean',
                'default_value': {'enabled': False}
            },
            {
                'name': 'Team Management',
                'key': 'team_management',
                'description': 'Team management capabilities',
                'feature_type': 'boolean',
                'default_value': {'enabled': False}
            },
            {
                'name': 'White Label',
                'key': 'white_label',
                'description': 'White-label options',
                'feature_type': 'boolean',
                'default_value': {'enabled': False}
            },
            {
                'name': 'Skill Verification',
                'key': 'skill_verification',
                'description': 'Skill verification badges',
                'feature_type': 'boolean',
                'default_value': {'enabled': False}
            },
            {
                'name': 'Direct Messaging',
                'key': 'direct_messaging',
                'description': 'Direct client messaging',
                'feature_type': 'boolean',
                'default_value': {'enabled': False}
            },
            {
                'name': 'Earnings Analytics',
                'key': 'earnings_analytics',
                'description': 'Earnings analytics and reporting',
                'feature_type': 'boolean',
                'default_value': {'enabled': False}
            },
            {
                'name': 'Collaboration Tools',
                'key': 'collaboration_tools',
                'description': 'Team collaboration tools',
                'feature_type': 'boolean',
                'default_value': {'enabled': False}
            },
            {
                'name': 'Project Management',
                'key': 'project_management',
                'description': 'Full project management suite',
                'feature_type': 'boolean',
                'default_value': {'enabled': False}
            },
            {
                'name': 'Task Coordination',
                'key': 'task_coordination',
                'description': 'Task coordination tools',
                'feature_type': 'boolean',
                'default_value': {'enabled': False}
            },
            {
                'name': 'Progress Reporting',
                'key': 'progress_reporting',
                'description': 'Progress reporting system',
                'feature_type': 'boolean',
                'default_value': {'enabled': False}
            },
            {
                'name': 'All User Roles',
                'key': 'all_user_roles',
                'description': 'Access to all user roles',
                'feature_type': 'boolean',
                'default_value': {'enabled': False}
            },
            {
                'name': 'Communication Hub',
                'key': 'communication_hub',
                'description': 'Team communication hub',
                'feature_type': 'boolean',
                'default_value': {'enabled': False}
            },
            {
                'name': 'Resource Allocation',
                'key': 'resource_allocation',
                'description': 'Resource allocation tools',
                'feature_type': 'boolean',
                'default_value': {'enabled': False}
            },
            {
                'name': 'CRM',
                'key': 'crm',
                'description': 'Client relationship management',
                'feature_type': 'boolean',
                'default_value': {'enabled': False}
            },
            {
                'name': 'Advanced Scheduling',
                'key': 'advanced_scheduling',
                'description': 'Advanced scheduling system',
                'feature_type': 'boolean',
                'default_value': {'enabled': False}
            },
            {
                'name': 'Workflow Builder',
                'key': 'workflow_builder',
                'description': 'Custom workflow builder',
                'feature_type': 'boolean',
                'default_value': {'enabled': False}
            },
            {
                'name': 'Integration Capabilities',
                'key': 'integration_capabilities',
                'description': 'Integration with third-party tools',
                'feature_type': 'boolean',
                'default_value': {'enabled': False}
            },
        ]
        
        features = {}
        for feature_data in features_data:
            feature, created = SubscriptionFeature.objects.get_or_create(
                key=feature_data['key'],
                defaults=feature_data
            )
            features[feature.key] = feature
            
            if created:
                self.stdout.write(f'Created feature: {feature.name}')
        
        return features

    def create_plans(self):
        """Create subscription plans"""
        plans_data = [
            # Home Pro Plans
            {
                'name': 'Home Pro Basic',
                'user_type': 'home_pro',
                'plan_type': 'basic',
                'price': Decimal('150.00'),
                'features': [
                    'Access to project proposals',
                    'Basic hiring capabilities',
                    'Customer rating system',
                    'Basic marketing tools',
                    'Email support',
                    'Mobile app access',
                    'Payment processing'
                ],
                'project_limit': 10,
                'proposal_limit': 20,
                'message_limit': 100,
                'is_popular': False,
                'stripe_price_id': 'price_home_pro_basic'
            },
            {
                'name': 'Home Pro Premium',
                'user_type': 'home_pro',
                'plan_type': 'premium',
                'price': Decimal('275.00'),
                'features': [
                    'All Basic features',
                    'Priority customer support',
                    'Advanced marketing toolkit',
                    'Featured profile listing',
                    'Custom portfolio builder',
                    'Lead generation tools',
                    'Advanced analytics',
                    'Team management',
                    'White-label options'
                ],
                'project_limit': None,  # Unlimited
                'proposal_limit': None,  # Unlimited
                'message_limit': None,  # Unlimited
                'is_popular': True,
                'stripe_price_id': 'price_home_pro_premium'
            },
            
            # Crew Member Plans
            {
                'name': 'Crew Member Basic',
                'user_type': 'crew_member',
                'plan_type': 'basic',
                'price': Decimal('90.00'),
                'features': [
                    'On-demand hiring access',
                    'Basic crew directory listing',
                    'Work portfolio upload',
                    'Basic messaging system',
                    'Payment processing',
                    'Mobile app access',
                    'Skill verification badges'
                ],
                'project_limit': 5,
                'proposal_limit': 10,
                'message_limit': 50,
                'is_popular': False,
                'stripe_price_id': 'price_crew_member_basic'
            },
            {
                'name': 'Crew Member Premium',
                'user_type': 'crew_member',
                'plan_type': 'premium',
                'price': Decimal('210.00'),
                'features': [
                    'All Basic features',
                    'Priority hiring placement',
                    'Featured crew directory listing',
                    'Advanced portfolio tools',
                    'Direct client messaging',
                    'Premium support',
                    'Advanced skill certifications',
                    'Earnings analytics',
                    'Team collaboration tools'
                ],
                'project_limit': None,  # Unlimited
                'proposal_limit': None,  # Unlimited
                'message_limit': None,  # Unlimited
                'is_popular': True,
                'stripe_price_id': 'price_crew_member_premium'
            },
            
            # Specialist Plan
            {
                'name': 'Specialist Flat Rate',
                'user_type': 'specialist',
                'plan_type': 'flat_rate',
                'price': Decimal('60.00'),
                'features': [
                    'Full project management suite',
                    'Task coordination tools',
                    'Progress reporting system',
                    'Access to all user roles',
                    'Team communication hub',
                    'Resource allocation tools',
                    'Client relationship management',
                    'Advanced scheduling',
                    'Custom workflow builder',
                    'Integration capabilities'
                ],
                'project_limit': None,  # Unlimited
                'proposal_limit': None,  # Unlimited
                'message_limit': None,  # Unlimited
                'is_popular': False,
                'stripe_price_id': 'price_specialist_flat'
            },
        ]
        
        plans = {}
        for plan_data in plans_data:
            plan, created = SubscriptionPlan.objects.get_or_create(
                user_type=plan_data['user_type'],
                plan_type=plan_data['plan_type'],
                defaults=plan_data
            )
            plans[f"{plan.user_type}_{plan.plan_type}"] = plan
            
            if created:
                self.stdout.write(f'Created plan: {plan.name}')
        
        return plans

    def link_features_to_plans(self, plans, features):
        """Link features to subscription plans"""
        
        # Home Pro Basic features
        home_pro_basic_features = [
            'project_access', 'skill_verification'
        ]
        
        # Home Pro Premium features
        home_pro_premium_features = [
            'project_access', 'priority_support', 'advanced_marketing',
            'featured_listing', 'portfolio_builder', 'lead_generation',
            'analytics', 'team_management', 'white_label', 'skill_verification'
        ]
        
        # Crew Member Basic features
        crew_member_basic_features = [
            'project_access', 'skill_verification'
        ]
        
        # Crew Member Premium features
        crew_member_premium_features = [
            'project_access', 'featured_listing', 'portfolio_builder',
            'direct_messaging', 'priority_support', 'skill_verification',
            'earnings_analytics', 'collaboration_tools'
        ]
        
        # Specialist features
        specialist_features = [
            'project_management', 'task_coordination', 'progress_reporting',
            'all_user_roles', 'communication_hub', 'resource_allocation',
            'crm', 'advanced_scheduling', 'workflow_builder', 'integration_capabilities'
        ]
        
        # Create plan features
        plan_features_mapping = {
            'home_pro_basic': home_pro_basic_features,
            'home_pro_premium': home_pro_premium_features,
            'crew_member_basic': crew_member_basic_features,
            'crew_member_premium': crew_member_premium_features,
            'specialist_flat_rate': specialist_features,
        }
        
        for plan_key, feature_keys in plan_features_mapping.items():
            plan = plans[plan_key]
            for feature_key in feature_keys:
                if feature_key in features:
                    plan_feature, created = PlanFeature.objects.get_or_create(
                        plan=plan,
                        feature=features[feature_key],
                        defaults={'value': {'enabled': True}}
                    )
                    if created:
                        self.stdout.write(f'Linked feature {feature_key} to plan {plan.name}') 