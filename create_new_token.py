#!/usr/bin/env python
import os
import sys
import django

# Add the server directory to Python path
sys.path.append('d:/apps/nextjs apps/homs/server')

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'alist_backend.settings')
django.setup()

from authentication.models import User, EmailVerificationToken
from authentication.views import send_verification_email

try:
    # Get user
    user = User.objects.get(email='osamaeldeghadey@gmail.com')
    print(f'Found user: {user.email}')
    print(f'Current status - Email verified: {user.email_verified}, Is verified: {user.is_verified}')
    
    # Reset verification status
    user.email_verified = False
    user.is_verified = False
    user.save()
    print('✅ Reset user verification status to False')
    
    # Delete old tokens
    old_tokens_count = EmailVerificationToken.objects.filter(user=user).count()
    EmailVerificationToken.objects.filter(user=user).delete()
    print(f'✅ Deleted {old_tokens_count} old verification tokens')
    
    # Send new verification email
    send_verification_email(user)
    print('✅ New verification email sent')
    
    # Get the new token
    token = EmailVerificationToken.objects.filter(user=user).first()
    if token:
        print(f'\n🔑 New verification token: {token.token}')
        print(f'📧 Token is valid: {token.is_valid}')
        print(f'🔗 Verification link: http://localhost:3000/verify-email?token={token.token}')
        print(f'\n📋 Copy this token for testing: {token.token}')
    else:
        print('❌ Failed to create new token')
        
except User.DoesNotExist:
    print('❌ User not found: osamaeldeghadey@gmail.com')
except Exception as e:
    print(f'❌ Error: {str(e)}')
    import traceback
    traceback.print_exc()