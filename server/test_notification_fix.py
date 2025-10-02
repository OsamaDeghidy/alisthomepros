import os
import sys
import django

# Add the parent directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')
django.setup()

from authentication.models import User
from projects.models import Project
from notifications.views import send_new_project_notifications_to_providers

print("=== Testing Notification Fix ===")
print()

# Get a client user to create a test project
client = User.objects.filter(user_type='client').first()
if not client:
    print("❌ No client found")
    exit()

print(f"📋 Using client: {client.email}")
print()

# Create a test project with hyphenated role values (as frontend would send)
test_project = Project.objects.create(
    title="Test Project - Notification Fix",
    description="Testing notification system with role mapping fix",
    budget=1000.00,
    client=client,
    required_roles=["home-pro", "crew-member", "specialist"],  # Frontend format
    status="open"
)

print(f"✅ Created test project: {test_project.title}")
print(f"📋 Required roles (frontend format): {test_project.required_roles}")
print()

# Test the notification function
print("🔔 Testing notification sending...")
print("=" * 50)
notification_count = send_new_project_notifications_to_providers(test_project)
print("=" * 50)
print(f"📊 Total notifications sent: {notification_count}")
print()

# Show all active verified professionals for comparison
print("👥 All active & verified professionals:")
active_professionals = User.objects.filter(
    user_type__in=['home_pro', 'crew_member', 'specialist'],
    is_active=True,
    email_verified=True
).exclude(user_type='client')

for prof in active_professionals:
    print(f"   - {prof.email} ({prof.user_type})")

print(f"\n📊 Total active & verified professionals: {active_professionals.count()}")

# Clean up - delete the test project
test_project.delete()
print(f"\n🗑️ Cleaned up test project")
print("\n✅ Test completed!")