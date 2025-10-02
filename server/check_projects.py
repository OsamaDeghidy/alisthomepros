import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'alist_backend.settings')
django.setup()

from projects.models import Project
from django.contrib.auth import get_user_model

User = get_user_model()

print('=== Project Analysis ===')
projects = Project.objects.all().order_by('-created_at')

print(f'Total projects: {projects.count()}')

for project in projects[:10]:  # Show last 10 projects
    print(f'\n--- Project: {project.title} ---')
    print(f'  ID: {project.id}')
    print(f'  Client: {project.client.email} ({project.client.user_type})')
    print(f'  Status: {project.status}')
    print(f'  Required Roles: {project.required_roles}')
    print(f'  Required Skills: {project.required_skills}')
    print(f'  Created: {project.created_at}')
    
    # Check what providers would match
    if project.required_roles:
        matching_providers = User.objects.filter(
            user_type__in=project.required_roles,
            is_active=True,
            email_verified=True
        ).exclude(
            id=project.client.id
        ).exclude(
            user_type='client'
        )
        
        print(f'  Matching providers ({matching_providers.count()}): ')
        for provider in matching_providers:
            print(f'    - {provider.email} ({provider.user_type})')
    else:
        print(f'  No required roles specified!')

print('\n=== Recent Projects with Required Roles ===')
recent_projects_with_roles = Project.objects.exclude(required_roles=[]).order_by('-created_at')[:5]

for project in recent_projects_with_roles:
    print(f'\nProject: {project.title}')
    print(f'Required Roles: {project.required_roles}')
    print(f'Client: {project.client.email}')