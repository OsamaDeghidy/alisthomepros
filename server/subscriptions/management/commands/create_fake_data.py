from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from decimal import Decimal
from datetime import datetime, timedelta
import random

from subscriptions.models import SubscriptionPlan, Subscription
from projects.models import Category, Project, ProjectImage, ProjectFile
from contracts.models import Contract, ContractMilestone
from payments.models import Currency, Wallet, PaymentMethod, EscrowAccount
from reviews.models import Review
from messaging.models import Conversation, Message
from portfolio.models import PortfolioItem, PortfolioImage
from tasks.models import Task
from authentication.models import UserProfile

User = get_user_model()


class Command(BaseCommand):
    help = 'Create comprehensive fake data for A-List Home Professionals platform'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing data before creating new data',
        )

    def handle(self, *args, **options):
        if options['clear']:
            self.clear_data()
        
        self.stdout.write(self.style.SUCCESS('Starting fake data creation...'))
        
        # Create data in order of dependencies
        currencies = self.create_currencies()
        subscription_plans = self.create_subscription_plans()
        users = self.create_users()
        self.create_subscriptions(users, subscription_plans)
        categories = self.create_categories()
        projects = self.create_projects(users, categories)
        contracts = self.create_contracts(users, projects)
        self.create_wallets_and_payments(users)
        self.create_portfolio_items(users)
        self.create_reviews(users, projects)
        self.create_conversations_and_messages(users, projects)
        self.create_tasks(users, projects)
        
        self.stdout.write(self.style.SUCCESS('✅ Fake data creation completed successfully!'))
        self.print_user_credentials()

    def clear_data(self):
        self.stdout.write('Clearing existing data...')
        # Clear in reverse dependency order
        Task.objects.all().delete()
        Message.objects.all().delete()
        Conversation.objects.all().delete()
        Review.objects.all().delete()
        PortfolioImage.objects.all().delete()
        PortfolioItem.objects.all().delete()
        PaymentMethod.objects.all().delete()
        Wallet.objects.all().delete()
        ContractMilestone.objects.all().delete()
        Contract.objects.all().delete()
        ProjectFile.objects.all().delete()
        ProjectImage.objects.all().delete()
        Project.objects.all().delete()
        Category.objects.all().delete()
        Subscription.objects.all().delete()
        SubscriptionPlan.objects.all().delete()
        User.objects.filter(is_superuser=False).delete()
        Currency.objects.all().delete()
        UserProfile.objects.all().delete()

    def create_currencies(self):
        self.stdout.write('Creating currencies...')
        
        currencies_data = [
            {'code': 'USD', 'name': 'US Dollar', 'symbol': '$', 'exchange_rate': Decimal('1.0')},
            {'code': 'EUR', 'name': 'Euro', 'symbol': '€', 'exchange_rate': Decimal('0.85')},
            {'code': 'GBP', 'name': 'British Pound', 'symbol': '£', 'exchange_rate': Decimal('0.73')},
        ]
        
        currencies = {}
        for curr_data in currencies_data:
            currency, created = Currency.objects.get_or_create(
                code=curr_data['code'],
                defaults=curr_data
            )
            currencies[curr_data['code']] = currency
            if created:
                self.stdout.write(f'✓ Created currency: {currency.name}')
        
        return currencies

    def create_subscription_plans(self):
        self.stdout.write('Creating subscription plans...')
        
        plans_data = [
            # Freemium Plan (Free)
            {
                'name': 'Freemium Plan',
                'user_type': 'home_pro',
                'plan_type': 'basic',
                'price': Decimal('0.00'),
                'features': [
                    'Business listed in the A-List directory',
                    'Basic profile visibility',
                    'Limited portfolio showcase'
                ],
                'project_limit': 0,
                'proposal_limit': 0,
                'message_limit': 0,
                'is_popular': False,
                'trial_days': 0
            },
            
            # Crew Member – Basic
            {
                'name': 'Crew Member Basic',
                'user_type': 'crew_member',
                'plan_type': 'basic',
                'price': Decimal('90.00'),
                'features': [
                    'On-demand job access',
                    'Portfolio upload',
                    'Skill verification badge',
                    'Crew directory listing',
                    'In-app messaging',
                    'Mobile access'
                ],
                'project_limit': 5,
                'proposal_limit': 10,
                'message_limit': 100,
                'is_popular': False,
                'trial_days': 7
            },
            
            # Home Pro – Basic (Regular)
            {
                'name': 'Home Pro Basic',
                'user_type': 'home_pro',
                'plan_type': 'premium',
                'price': Decimal('150.00'),
                'features': [
                    'Access to homeowner project leads',
                    'Customer rating system',
                    'Basic marketing tools',
                    'Email support',
                    'Mobile app access',
                    'Payment processing'
                ],
                'project_limit': 10,
                'proposal_limit': 20,
                'message_limit': 200,
                'is_popular': True,
                'trial_days': 14
            },
            
            # Home Pro – Premium
            {
                'name': 'Home Pro Premium',
                'user_type': 'home_pro',
                'plan_type': 'flat_rate',
                'price': Decimal('275.00'),
                'features': [
                    'Priority lead placement',
                    'Featured profile listing',
                    'Custom portfolio builder',
                    'Lead generation tools',
                    'Team management access',
                    'White-label branding',
                    'Premium customer support'
                ],
                'project_limit': None,  # Unlimited
                'proposal_limit': None,  # Unlimited
                'message_limit': None,  # Unlimited
                'is_popular': False,
                'trial_days': 14
            },
            
            # Specialist Plan
            {
                'name': 'Specialist Plan',
                'user_type': 'specialist',
                'plan_type': 'flat_rate',
                'price': Decimal('60.00'),
                'features': [
                    'Project management suite',
                    'Task coordination',
                    'Communication hub',
                    'Role-based dashboard access',
                    'Resource tracking',
                    'Scheduling tools',
                    'Client relationship features'
                ],
                'project_limit': None,  # Unlimited
                'proposal_limit': None,  # Unlimited
                'message_limit': None,  # Unlimited
                'is_popular': False,
                'trial_days': 7
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
                self.stdout.write(f'✓ Created plan: {plan.name}')
            else:
                self.stdout.write(f'✓ Using existing plan: {plan.name}')
        
        return plans

    def create_users(self):
        self.stdout.write('Creating users...')
        
        # إنشاء مستخدم أدمن
        admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@alistpro.com',
            password='admin123',
            first_name='System',
            last_name='Administrator',
            user_type='client'
        )
        
        # إنشاء UserProfile للأدمن
        UserProfile.objects.get_or_create(
            user=admin_user,
            defaults={
                'linkedin_url': 'https://linkedin.com/in/admin',
                'emergency_contact_name': 'Admin Contact',
                'emergency_contact_phone': '+1234567890',
            }
        )
        
        users_data = [
            # العملاء
            {
                'username': 'client1', 'email': 'client1@test.com', 'user_type': 'client',
                'first_name': 'John', 'last_name': 'Smith', 'phone': '+1234567890',
                'location': 'New York, NY', 'is_verified': True
            },
            {
                'username': 'client2', 'email': 'client2@test.com', 'user_type': 'client',
                'first_name': 'Emily', 'last_name': 'Johnson', 'phone': '+1234567891',
                'location': 'Los Angeles, CA', 'is_verified': True
            },
            {
                'username': 'client3', 'email': 'client3@test.com', 'user_type': 'client',
                'first_name': 'Michael', 'last_name': 'Davis', 'phone': '+1234567892',
                'location': 'Chicago, IL', 'is_verified': True
            },
            
            # المحترفين
            {
                'username': 'homepro1', 'email': 'homepro1@test.com', 'user_type': 'home_pro',
                'first_name': 'David', 'last_name': 'Wilson', 'phone': '+1234567893',
                'location': 'Brooklyn, NY', 'company_name': 'Wilson Contracting',
                'bio': 'Experienced contractor with 15 years in home renovation',
                'experience_years': 15, 'hourly_rate': Decimal('85.00'),
                'skills': ['Construction', 'Renovation', 'Plumbing'], 'is_verified': True,
                'rating_average': Decimal('4.8'), 'rating_count': 156, 'projects_completed': 89
            },
            {
                'username': 'homepro2', 'email': 'homepro2@test.com', 'user_type': 'home_pro',
                'first_name': 'Sarah', 'last_name': 'Martinez', 'phone': '+1234567894',
                'location': 'Manhattan, NY', 'company_name': 'Martinez Electric',
                'bio': 'Licensed electrician specializing in residential and commercial work',
                'experience_years': 12, 'hourly_rate': Decimal('90.00'),
                'skills': ['Electrical', 'Wiring', 'Panel Installation'], 'is_verified': True,
                'rating_average': Decimal('4.9'), 'rating_count': 203, 'projects_completed': 145
            },
            {
                'username': 'homepro3', 'email': 'homepro3@test.com', 'user_type': 'home_pro',
                'first_name': 'Robert', 'last_name': 'Taylor', 'phone': '+1234567895',
                'location': 'Queens, NY', 'company_name': 'Taylor Plumbing',
                'bio': 'Master plumber with expertise in bathroom and kitchen remodeling',
                'experience_years': 18, 'hourly_rate': Decimal('75.00'),
                'skills': ['Plumbing', 'Bathroom Remodel', 'Kitchen Remodel'], 'is_verified': True,
                'rating_average': Decimal('4.7'), 'rating_count': 178, 'projects_completed': 167
            },
            
            # الأخصائيين
            {
                'username': 'specialist1', 'email': 'specialist1@test.com', 'user_type': 'specialist',
                'first_name': 'Lisa', 'last_name': 'Anderson', 'phone': '+1234567896',
                'location': 'Manhattan, NY', 'company_name': 'Anderson Design',
                'bio': 'Interior design specialist with focus on modern homes',
                'experience_years': 10, 'hourly_rate': Decimal('120.00'),
                'skills': ['Interior Design', 'Project Management'], 'is_verified': True,
                'rating_average': Decimal('4.9'), 'rating_count': 87, 'projects_completed': 45
            },
            {
                'username': 'specialist2', 'email': 'specialist2@test.com', 'user_type': 'specialist',
                'first_name': 'James', 'last_name': 'Thompson', 'phone': '+1234567897',
                'location': 'Brooklyn, NY', 'company_name': 'Thompson Architecture',
                'bio': 'Licensed architect specializing in home additions and renovations',
                'experience_years': 20, 'hourly_rate': Decimal('150.00'),
                'skills': ['Architecture', 'Design', 'Permits'], 'is_verified': True,
                'rating_average': Decimal('4.8'), 'rating_count': 92, 'projects_completed': 38
            },
            
            # أعضاء الفريق
            {
                'username': 'crew1', 'email': 'crew1@test.com', 'user_type': 'crew_member',
                'first_name': 'Carlos', 'last_name': 'Rodriguez', 'phone': '+1234567898',
                'location': 'Bronx, NY', 'hourly_rate': Decimal('35.00'),
                'skills': ['Construction', 'Demolition', 'Cleanup'], 'is_verified': True,
                'rating_average': Decimal('4.6'), 'rating_count': 45, 'projects_completed': 67
            },
            {
                'username': 'crew2', 'email': 'crew2@test.com', 'user_type': 'crew_member',
                'first_name': 'Antonio', 'last_name': 'Garcia', 'phone': '+1234567899',
                'location': 'Queens, NY', 'hourly_rate': Decimal('40.00'),
                'skills': ['Painting', 'Drywall', 'Flooring'], 'is_verified': True,
                'rating_average': Decimal('4.7'), 'rating_count': 38, 'projects_completed': 52
            },
            {
                'username': 'crew3', 'email': 'crew3@test.com', 'user_type': 'crew_member',
                'first_name': 'Miguel', 'last_name': 'Hernandez', 'phone': '+1234567800',
                'location': 'Brooklyn, NY', 'hourly_rate': Decimal('38.00'),
                'skills': ['Carpentry', 'Framing', 'Trim Work'], 'is_verified': True,
                'rating_average': Decimal('4.8'), 'rating_count': 42, 'projects_completed': 61
            }
        ]
        
        created_users = []
        for user_data in users_data:
            user = User.objects.create_user(
                password='pass123',  # كلمة مرور موحدة للجميع
                **user_data
            )
            created_users.append(user)
            
            # إنشاء UserProfile لكل مستخدم
            profile_data = {}
            if user.user_type in ['home_pro', 'specialist']:
                profile_data.update({
                    'linkedin_url': f'https://linkedin.com/in/{user.username}',
                    'business_address': f'{user.location}, Business Address',
                    'certifications': f'Professional certifications for {user.get_user_type_display()}',
                    'service_areas': f'{user.location} and surrounding areas',
                })
            
            profile_data.update({
                'emergency_contact_name': f'{user.first_name} Emergency Contact',
                'emergency_contact_phone': f'+{1234567000 + len(created_users)}',
            })
            
            UserProfile.objects.get_or_create(
                user=user,
                defaults=profile_data
            )
        
        return created_users

    def create_subscriptions(self, users, subscription_plans):
        self.stdout.write('Creating subscriptions...')
        
        subscription_data = [
            ('homepro1', 'home_pro_flat_rate', 'active'),
            ('homepro2', 'home_pro_premium', 'active'),
            ('homepro3', 'home_pro_flat_rate', 'trial'),
            ('specialist1', 'specialist_flat_rate', 'active'),
            ('specialist2', 'specialist_flat_rate', 'active'),
            ('crew1', 'crew_member_basic', 'active'),
            ('crew2', 'crew_member_basic', 'trial'),
            ('crew3', 'crew_member_basic', 'active'),
        ]
        
        for username, plan_key, status in subscription_data:
            user = users.get(username)
            plan = subscription_plans.get(plan_key)
            
            if user and plan:
                subscription, created = Subscription.objects.get_or_create(
                    user=user,
                    defaults={
                        'plan': plan,
                        'status': status,
                        'start_date': timezone.now() - timedelta(days=random.randint(1, 30)),
                        'current_period_start': timezone.now() - timedelta(days=15),
                        'current_period_end': timezone.now() + timedelta(days=15),
                    }
                )
                if created:
                    self.stdout.write(f'✓ Created subscription: {user.username} -> {plan.name}')

    def create_categories(self):
        self.stdout.write('Creating project categories...')
        
        categories_data = [
            {'name': 'Plumbing', 'description': 'Plumbing repairs and installations'},
            {'name': 'Electrical', 'description': 'Electrical work and installations'},
            {'name': 'Carpentry', 'description': 'Carpentry and woodwork'},
            {'name': 'Painting', 'description': 'Interior and exterior painting'},
            {'name': 'Roofing', 'description': 'Roof repairs and installations'},
            {'name': 'HVAC', 'description': 'Heating, ventilation, and air conditioning'},
            {'name': 'Flooring', 'description': 'Floor installation and repairs'},
            {'name': 'Kitchen Renovation', 'description': 'Kitchen remodeling and renovation'},
            {'name': 'Bathroom Renovation', 'description': 'Bathroom remodeling and renovation'},
            {'name': 'General Handyman', 'description': 'General maintenance and repairs'},
        ]
        
        categories = {}
        for i, cat_data in enumerate(categories_data):
            from django.utils.text import slugify
            cat_data['slug'] = slugify(cat_data['name'])
            cat_data['order'] = i
            
            category, created = Category.objects.get_or_create(
                slug=cat_data['slug'],
                defaults=cat_data
            )
            categories[cat_data['slug']] = category
            if created:
                self.stdout.write(f'✓ Created category: {category.name}')
        
        return categories

    def create_projects(self, users, categories):
        self.stdout.write('Creating projects...')
        
        projects_data = [
            {
                'title': 'Kitchen Renovation - Modern Update',
                'description': 'Complete kitchen renovation including new cabinets, countertops, and appliances. Looking for experienced contractor to handle full project.',
                'client': 'client1',
                'category': 'kitchen-renovation',
                'location': 'New York, NY',
                'budget_min': Decimal('25000'),
                'budget_max': Decimal('35000'),
                'timeline': '6-8 weeks',
                'status': 'published',
                'required_skills': ['Kitchen Design', 'Carpentry', 'Plumbing', 'Electrical'],
                'urgency': 'normal'
            },
            {
                'title': 'Bathroom Plumbing Repair',
                'description': 'Need urgent plumbing repair for master bathroom. Leaking pipes and water damage.',
                'client': 'client2',
                'category': 'plumbing',
                'location': 'Los Angeles, CA',
                'budget_min': Decimal('1500'),
                'budget_max': Decimal('3000'),
                'timeline': '1-2 weeks',
                'status': 'in_progress',
                'assigned_professional': 'homepro3',
                'required_skills': ['Plumbing', 'Pipe Repair', 'Water Damage'],
                'urgency': 'urgent'
            },
            {
                'title': 'Electrical Panel Upgrade',
                'description': 'Need to upgrade electrical panel to support new appliances and improve safety.',
                'client': 'client3',
                'category': 'electrical',
                'location': 'Chicago, IL',
                'budget_min': Decimal('2500'),
                'budget_max': Decimal('4500'),
                'timeline': '2-3 weeks',
                'status': 'published',
                'required_skills': ['Electrical', 'Panel Installation', 'Wiring'],
                'urgency': 'high'
            },
            {
                'title': 'Complete Home Renovation',
                'description': 'Large-scale home renovation project including multiple rooms and systems.',
                'client': 'client1',
                'category': 'general-handyman',
                'location': 'New York, NY',
                'budget_min': Decimal('75000'),
                'budget_max': Decimal('100000'),
                'timeline': '4-6 months',
                'status': 'in_progress',
                'assigned_professional': 'homepro1',
                'required_skills': ['Project Management', 'Multiple Trades', 'Coordination'],
                'urgency': 'normal'
            },
            {
                'title': 'Roof Repair and Replacement',
                'description': 'Roof has storm damage and needs partial repair and some replacement.',
                'client': 'client2',
                'category': 'roofing',
                'location': 'Los Angeles, CA',
                'budget_min': Decimal('8000'),
                'budget_max': Decimal('15000'),
                'timeline': '2-4 weeks',
                'status': 'published',
                'required_skills': ['Roofing', 'Storm Damage', 'Shingle Replacement'],
                'urgency': 'high'
            }
        ]
        
        projects = []
        for proj_data in projects_data:
            client_username = proj_data.pop('client')
            category_slug = proj_data.pop('category')
            assigned_username = proj_data.pop('assigned_professional', None)
            
            client = users.get(client_username)
            category = categories.get(category_slug)
            assigned_professional = users.get(assigned_username) if assigned_username else None
            
            if client and category:
                from django.utils.text import slugify
                import uuid
                proj_data['slug'] = slugify(proj_data['title']) + '-' + str(uuid.uuid4())[:8]
                proj_data['client'] = client
                proj_data['category'] = category
                proj_data['assigned_professional'] = assigned_professional
                proj_data['views_count'] = random.randint(10, 100)
                proj_data['proposals_count'] = random.randint(3, 15)
                
                if proj_data['status'] == 'published':
                    proj_data['published_at'] = timezone.now() - timedelta(days=random.randint(1, 30))
                
                project, created = Project.objects.get_or_create(
                    title=proj_data['title'],
                    defaults=proj_data
                )
                if created:
                    projects.append(project)
                    self.stdout.write(f'✓ Created project: {project.title}')
        
        return projects

    def create_contracts(self, users, projects):
        self.stdout.write('Creating contracts...')
        
        # Create contracts for in-progress projects
        in_progress_projects = [p for p in projects if p.status == 'in_progress']
        
        for project in in_progress_projects:
            if project.assigned_professional:
                contract_data = {
                    'title': f'Contract for {project.title}',
                    'description': f'Service contract for project: {project.title}',
                    'client': project.client,
                    'professional': project.assigned_professional,
                    'project': project,
                    'total_amount': random.choice([project.budget_min, project.budget_max, 
                                                 (project.budget_min + project.budget_max) / 2]),
                    'payment_type': random.choice(['fixed', 'milestone']),
                    'start_date': timezone.now().date() - timedelta(days=random.randint(1, 15)),
                    'end_date': timezone.now().date() + timedelta(days=random.randint(30, 90)),
                    'status': 'active',
                    'client_signed': True,
                    'professional_signed': True,
                    'client_signed_date': timezone.now() - timedelta(days=random.randint(1, 10)),
                    'professional_signed_date': timezone.now() - timedelta(days=random.randint(1, 10)),
                    'completion_percentage': random.randint(20, 80)
                }
                
                contract, created = Contract.objects.get_or_create(
                    title=contract_data['title'],
                    defaults=contract_data
                )
                
                if created:
                    # Create milestones for milestone-based contracts
                    if contract.payment_type == 'milestone':
                        milestones_data = [
                            {'title': 'Project Initiation', 'amount': contract.total_amount * Decimal('0.25'), 'order': 1},
                            {'title': 'Mid-point Completion', 'amount': contract.total_amount * Decimal('0.50'), 'order': 2},
                            {'title': 'Final Completion', 'amount': contract.total_amount * Decimal('0.25'), 'order': 3},
                        ]
                        
                        for milestone_data in milestones_data:
                            milestone_data['contract'] = contract
                            milestone_data['due_date'] = contract.start_date + timedelta(
                                days=(contract.end_date - contract.start_date).days * milestone_data['order'] // 3
                            )
                            milestone_data['status'] = 'completed' if milestone_data['order'] == 1 else 'pending'
                            
                            ContractMilestone.objects.create(**milestone_data)
                    
                    self.stdout.write(f'✓ Created contract: {contract.title}')

    def create_wallets_and_payments(self, users):
        self.stdout.write('Creating wallets and payment methods...')
        
        # Get USD currency
        usd_currency = Currency.objects.get(code='USD')
        
        for username, user in users.items():
            if user.user_type != 'client':  # Create wallets for professionals
                wallet_data = {
                    'user': user,
                    'available_balance': Decimal(str(random.uniform(100, 5000))),
                    'pending_balance': Decimal(str(random.uniform(0, 1000))),
                    'total_earned': Decimal(str(random.uniform(1000, 50000))),
                    'currency': usd_currency
                }
                
                wallet, created = Wallet.objects.get_or_create(user=user, defaults=wallet_data)
                if created:
                    self.stdout.write(f'✓ Created wallet for: {user.username}')
            
            # Create payment methods for all users
            payment_methods = [
                {
                    'user': user,
                    'type': 'card',
                    'provider': random.choice(['Visa', 'MasterCard', 'American Express']),
                    'last4': str(random.randint(1000, 9999)),
                    'cardholder_name': user.get_full_name(),
                    'is_default': True,
                    'is_verified': True
                }
            ]
            
            for pm_data in payment_methods:
                payment_method, created = PaymentMethod.objects.get_or_create(
                    user=user, type=pm_data['type'], defaults=pm_data
                )
                if created:
                    self.stdout.write(f'✓ Created payment method for: {user.username}')

    def create_portfolio_items(self, users):
        self.stdout.write('Creating portfolio items...')
        
        portfolio_data = [
            {
                'professional': 'homepro1',
                'title': 'Modern Kitchen Transformation',
                'description': 'Complete kitchen renovation with custom cabinets and granite countertops.',
                'category': 'Kitchen Renovation',
                'project_duration': '6 weeks',
                'project_cost': '$28,000',
                'featured': True
            },
            {
                'professional': 'homepro1',
                'title': 'Bathroom Luxury Upgrade',
                'description': 'Master bathroom renovation with walk-in shower and modern fixtures.',
                'category': 'Bathroom Renovation',
                'project_duration': '4 weeks',
                'project_cost': '$18,500',
                'featured': False
            },
            {
                'professional': 'homepro2',
                'title': 'Electrical Panel Modernization',
                'description': 'Upgraded electrical panel and rewired entire home for safety and efficiency.',
                'category': 'Electrical',
                'project_duration': '3 weeks',
                'project_cost': '$12,000',
                'featured': True
            },
            {
                'professional': 'homepro3',
                'title': 'Emergency Plumbing Repair',
                'description': 'Fixed major pipe burst and restored water service within 24 hours.',
                'category': 'Plumbing',
                'project_duration': '2 days',
                'project_cost': '$3,200',
                'featured': False
            }
        ]
        
        for item_data in portfolio_data:
            professional_username = item_data.pop('professional')
            professional = users.get(professional_username)
            
            if professional:
                item_data['professional'] = professional
                item_data['completion_date'] = timezone.now().date() - timedelta(days=random.randint(30, 365))
                item_data['likes'] = random.randint(5, 50)
                item_data['views'] = random.randint(20, 200)
                
                portfolio_item, created = PortfolioItem.objects.get_or_create(
                    title=item_data['title'],
                    defaults=item_data
                )
                if created:
                    self.stdout.write(f'✓ Created portfolio item: {portfolio_item.title}')

    def create_reviews(self, users, projects):
        self.stdout.write('Creating reviews...')
        
        # Create reviews for completed work
        review_data = [
            {
                'client': 'client1',
                'professional': 'homepro1',
                'rating': 5,
                'comment': 'David did an amazing job on our kitchen renovation. Professional, on-time, and exceeded expectations.',
                'project_title': 'Kitchen Renovation'
            },
            {
                'client': 'client2',
                'professional': 'homepro3',
                'rating': 5,
                'comment': 'Carlos responded immediately to our plumbing emergency and fixed everything perfectly.',
                'project_title': 'Emergency Plumbing'
            },
            {
                'client': 'client3',
                'professional': 'homepro2',
                'rating': 4,
                'comment': 'Lisa completed the electrical panel upgrade efficiently and safely. Great communication.',
                'project_title': 'Electrical Panel Upgrade'
            }
        ]
        
        for review_item in review_data:
            client = users.get(review_item['client'])
            professional = users.get(review_item['professional'])
            
            # Find a related project for this client and professional
            project = None
            for proj in projects:
                if proj.client == client and proj.assigned_professional == professional:
                    project = proj
                    break
            
            if client and professional and project:
                review, created = Review.objects.get_or_create(
                    client=client,
                    professional=professional,
                    project=project,
                    defaults={
                        'rating': review_item['rating'],
                        'comment': review_item['comment'],
                        'quality_rating': review_item['rating'],
                        'communication_rating': review_item['rating'],
                        'timeliness_rating': review_item['rating'],
                        'professionalism_rating': review_item['rating']
                    }
                )
                if created:
                    self.stdout.write(f'✓ Created review: {client.username} -> {professional.username}')

    def create_conversations_and_messages(self, users, projects):
        self.stdout.write('Creating conversations and messages...')
        
        # Create conversations for active projects
        for project in projects:
            if project.assigned_professional:
                conversation, created = Conversation.objects.get_or_create(
                    title=f'Project: {project.title}',
                    project=project,
                    defaults={'is_group': False}
                )
                
                if created:
                    conversation.participants.add(project.client, project.assigned_professional)
                    
                    # Add some messages
                    messages_data = [
                        {
                            'sender': project.client,
                            'content': f'Hi, I\'m interested in discussing the {project.title} project.',
                            'days_ago': 5
                        },
                        {
                            'sender': project.assigned_professional,
                            'content': 'Hello! I\'d be happy to help with your project. When would be a good time to discuss details?',
                            'days_ago': 5
                        },
                        {
                            'sender': project.client,
                            'content': 'Great! How about tomorrow afternoon? I have some questions about the timeline.',
                            'days_ago': 4
                        },
                        {
                            'sender': project.assigned_professional,
                            'content': 'Perfect! I\'ll prepare some initial plans and we can review them together.',
                            'days_ago': 4
                        }
                    ]
                    
                    for msg_data in messages_data:
                        Message.objects.create(
                            conversation=conversation,
                            sender=msg_data['sender'],
                            content=msg_data['content'],
                            created_at=timezone.now() - timedelta(days=msg_data['days_ago'])
                        )
                    
                    self.stdout.write(f'✓ Created conversation for project: {project.title}')

    def create_tasks(self, users, projects):
        self.stdout.write('Creating tasks...')
        
        # Create tasks for in-progress projects
        in_progress_projects = [p for p in projects if p.status == 'in_progress']
        
        for project in in_progress_projects:
            if project.assigned_professional:
                tasks_data = [
                    {
                        'title': 'Initial Site Assessment',
                        'description': 'Conduct thorough assessment of project site and requirements.',
                        'priority': 'high',
                        'status': 'completed',
                        'progress': 100
                    },
                    {
                        'title': 'Material Procurement',
                        'description': 'Purchase all necessary materials and supplies for the project.',
                        'priority': 'medium',
                        'status': 'in_progress',
                        'progress': 75
                    },
                    {
                        'title': 'Work Execution',
                        'description': 'Execute the main work according to project specifications.',
                        'priority': 'high',
                        'status': 'in_progress',
                        'progress': 45
                    },
                    {
                        'title': 'Quality Inspection',
                        'description': 'Conduct final quality inspection and cleanup.',
                        'priority': 'medium',
                        'status': 'pending',
                        'progress': 0
                    }
                ]
                
                for i, task_data in enumerate(tasks_data):
                    task_data.update({
                        'project': project,
                        'assigned_to': project.assigned_professional,
                        'assigned_by': project.client,
                        'due_date': timezone.now().date() + timedelta(days=(i + 1) * 7)
                    })
                    
                    task, created = Task.objects.get_or_create(
                        title=task_data['title'],
                        project=project,
                        defaults=task_data
                    )
                    if created:
                        self.stdout.write(f'✓ Created task: {task.title}')

    def print_user_credentials(self):
        self.stdout.write('\n' + '='*80)
        self.stdout.write(self.style.SUCCESS('🔑 USER CREDENTIALS FOR TESTING'))
        self.stdout.write('='*80)
        
        self.stdout.write('\n📋 ADMIN ACCESS:')
        self.stdout.write('  Username: admin')
        self.stdout.write('  Password: admin123')
        self.stdout.write('  Admin Panel: http://localhost:8000/admin/')
        
        self.stdout.write('\n👥 CLIENT ACCOUNTS:')
        clients = ['client1', 'client2', 'client3']
        for client in clients:
            self.stdout.write(f'  Username: {client} | Password: pass123')
        
        self.stdout.write('\n🏠 HOME PRO ACCOUNTS:')
        home_pros = ['homepro1', 'homepro2', 'homepro3']
        for pro in home_pros:
            self.stdout.write(f'  Username: {pro} | Password: pass123')
        
        self.stdout.write('\n🎯 SPECIALIST ACCOUNTS:')
        specialists = ['specialist1', 'specialist2']
        for spec in specialists:
            self.stdout.write(f'  Username: {spec} | Password: pass123')
        
        self.stdout.write('\n👷 CREW MEMBER ACCOUNTS:')
        crew_members = ['crew1', 'crew2', 'crew3']
        for crew in crew_members:
            self.stdout.write(f'  Username: {crew} | Password: pass123')
        
        self.stdout.write('\n🌐 API ACCESS:')
        self.stdout.write('  Swagger UI: http://localhost:8000/api/docs/')
        self.stdout.write('  API Root: http://localhost:8000/api/')
        
        self.stdout.write('\n💰 SUBSCRIPTION PLANS CREATED:')
        plans = SubscriptionPlan.objects.all()
        for plan in plans:
            self.stdout.write(f'  - {plan.name}: ${plan.price}/month ({plan.get_user_type_display()})')
        
        self.stdout.write('\n' + '='*80)
        self.stdout.write(self.style.SUCCESS('✅ All fake data created successfully!'))
        self.stdout.write(self.style.WARNING('💡 You can now start the server: python manage.py runserver'))
        self.stdout.write('='*80) 