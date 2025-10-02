import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'alist_backend.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

print('=== User Statistics ===')
print(f'Total users: {User.objects.count()}')
print(f'Home Pros: {User.objects.filter(user_type="home_pro").count()}')
print(f'Specialists: {User.objects.filter(user_type="specialist").count()}')
print(f'Crew Members: {User.objects.filter(user_type="crew_member").count()}')
print(f'Clients: {User.objects.filter(user_type="client").count()}')

print('\n=== Active Professionals ===')
active_professionals = User.objects.filter(
    user_type__in=['home_pro', 'specialist', 'crew_member'],
    is_active=True
)

for user in active_professionals:
    print(f'  {user.email} ({user.user_type}) - Verified: {user.email_verified}')

print('\n=== Active & Verified Professionals ===')
verified_professionals = User.objects.filter(
    user_type__in=['home_pro', 'specialist', 'crew_member'],
    is_active=True,
    email_verified=True
)

for user in verified_professionals:
    print(f'  {user.email} ({user.user_type})')

print(f'\nTotal active & verified professionals: {verified_professionals.count()}')