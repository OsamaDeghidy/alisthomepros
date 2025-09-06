from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator
from django.utils import timezone
import uuid
from datetime import timedelta


class User(AbstractUser):
    """
    نموذج المستخدم المخصص لمنصة A-List Home Professionals
    """
    
    USER_TYPE_CHOICES = [
        ('client', 'Client'),
        ('home_pro', 'Home Pro'),
        ('specialist', 'A-List Specialist'),
        ('crew_member', 'Crew Member'),
    ]
    
    VERIFICATION_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('verified', 'Verified'),
        ('rejected', 'Rejected'),
    ]
    
    # Basic Information
    user_type = models.CharField(
        max_length=20,
        choices=USER_TYPE_CHOICES,
        default='client',
        help_text='Type of user account'
    )
    
    phone = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        help_text='Phone number'
    )
    
    location = models.CharField(
        max_length=255,
        blank=True,
        help_text='User location/address'
    )
    
    avatar = models.ImageField(
        upload_to='avatars/',
        blank=True,
        null=True,
        help_text='User profile picture'
    )
    
    # Verification and Status
    is_verified = models.BooleanField(
        default=False,
        help_text='Whether user is verified'
    )
    
    email_verified = models.BooleanField(
        default=False,
        help_text='Whether user email is verified'
    )
    
    verification_status = models.CharField(
        max_length=20,
        choices=VERIFICATION_STATUS_CHOICES,
        default='pending',
        help_text='Verification status'
    )
    
    # Professional Information (for non-clients)
    company_name = models.CharField(
        max_length=255,
        blank=True,
        help_text='Company or business name'
    )
    
    bio = models.TextField(
        blank=True,
        help_text='User biography or description'
    )
    
    website = models.URLField(
        blank=True,
        help_text='Website URL'
    )
    
    # Professional Details
    experience_years = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text='Years of experience'
    )
    
    hourly_rate = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text='Hourly rate in USD'
    )
    
    skills = models.JSONField(
        default=list,
        blank=True,
        help_text='List of skills and expertise'
    )
    
    # Ratings and Reviews
    rating_average = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0.00,
        help_text='Average rating from reviews'
    )
    
    rating_count = models.PositiveIntegerField(
        default=0,
        help_text='Total number of ratings'
    )
    
    # Activity Status
    is_available = models.BooleanField(
        default=True,
        help_text='Whether user is available for work'
    )
    
    last_activity = models.DateTimeField(
        auto_now=True,
        help_text='Last activity timestamp'
    )
    
    # Professional Verification
    license_number = models.CharField(
        max_length=100,
        blank=True,
        help_text='Professional license number'
    )
    
    insurance_verified = models.BooleanField(
        default=False,
        help_text='Whether insurance is verified'
    )
    
    background_check_verified = models.BooleanField(
        default=False,
        help_text='Whether background check is verified'
    )
    
    # Preferences
    notification_preferences = models.JSONField(
        default=dict,
        blank=True,
        help_text='User notification preferences'
    )
    
    # Statistics
    projects_completed = models.PositiveIntegerField(
        default=0,
        help_text='Number of completed projects'
    )
    
    total_earnings = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=0.00,
        help_text='Total earnings from platform'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def is_professional(self):
        """Check if user is a professional (home_pro, specialist, or crew_member)"""
        return self.user_type in ['home_pro', 'specialist', 'crew_member']
    
    def get_full_name(self):
        """Return full name of user"""
        return f"{self.first_name} {self.last_name}".strip() or self.username
    
    def get_display_name(self):
        """Return display name for user"""
        return self.get_full_name() or self.username
    
    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        indexes = [
            models.Index(fields=['user_type']),
            models.Index(fields=['is_verified']),
            models.Index(fields=['location']),
            models.Index(fields=['rating_average']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.get_user_type_display()})"
    
    def get_full_name(self):
        """Return the full name of the user"""
        return f"{self.first_name} {self.last_name}".strip() or self.username
    
    def get_display_name(self):
        """Return the display name for the user"""
        return self.get_full_name() or self.username
    
    def update_rating(self, new_rating):
        """Update user's average rating"""
        if self.rating_count == 0:
            self.rating_average = new_rating
        else:
            total_rating = self.rating_average * self.rating_count + new_rating
            self.rating_average = total_rating / (self.rating_count + 1)
        
        self.rating_count += 1
        self.save(update_fields=['rating_average', 'rating_count'])
    
    def is_professional(self):
        """Check if user is a professional (not client)"""
        return self.user_type in ['home_pro', 'specialist', 'crew_member']
    
    def can_post_projects(self):
        """Check if user can post projects"""
        return self.user_type == 'client'
    
    def can_bid_on_projects(self):
        """Check if user can bid on projects"""
        return self.is_professional()
    
    def get_verification_badge(self):
        """Get verification badge based on verifications"""
        badges = []
        if self.is_verified:
            badges.append('verified')
        if self.license_number:
            badges.append('licensed')
        if self.insurance_verified:
            badges.append('insured')
        if self.background_check_verified:
            badges.append('background_checked')
        return badges
    
    def get_completion_rate(self):
        """Calculate profile completion rate"""
        required_fields = ['first_name', 'last_name', 'phone', 'location']
        professional_fields = ['bio', 'company_name', 'hourly_rate']
        
        completed = 0
        total = len(required_fields)
        
        for field in required_fields:
            if getattr(self, field):
                completed += 1
        
        if self.is_professional():
            total += len(professional_fields)
            for field in professional_fields:
                if getattr(self, field):
                    completed += 1
        
        return (completed / total) * 100 if total > 0 else 0


class UserProfile(models.Model):
    """
    ملف شخصي إضافي للمستخدم
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profile'
    )
    
    # Social Links
    linkedin_url = models.URLField(blank=True)
    facebook_url = models.URLField(blank=True)
    instagram_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)
    
    # Professional Portfolio
    portfolio_images = models.JSONField(
        default=list,
        blank=True,
        help_text='List of portfolio image URLs'
    )
    
    certifications = models.JSONField(
        default=list,
        blank=True,
        help_text='List of certifications'
    )
    
    # Emergency Contact
    emergency_contact_name = models.CharField(
        max_length=255,
        blank=True,
        help_text='Emergency contact name'
    )
    
    emergency_contact_phone = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        help_text='Emergency contact phone'
    )
    
    # Business Information
    business_address = models.TextField(
        blank=True,
        help_text='Business address'
    )
    
    tax_id = models.CharField(
        max_length=50,
        blank=True,
        help_text='Tax identification number'
    )
    
    # Banking Information (encrypted)
    bank_account_info = models.JSONField(
        default=dict,
        blank=True,
        help_text='Encrypted banking information'
    )
    
    # Availability Schedule
    availability_schedule = models.JSONField(
        default=dict,
        blank=True,
        help_text='Weekly availability schedule'
    )
    
    # Service Areas
    service_areas = models.JSONField(
        default=list,
        blank=True,
        help_text='List of service areas/locations'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_profiles'
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'
    
    def __str__(self):
        return f"{self.user.get_full_name()} Profile"


class EmailVerificationToken(models.Model):
    """
    نموذج رموز التحقق من البريد الإلكتروني
    """
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='email_verification_tokens'
    )
    
    token = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        help_text='Unique verification token'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    expires_at = models.DateTimeField(
        help_text='Token expiration time'
    )
    
    is_used = models.BooleanField(
        default=False,
        help_text='Whether token has been used'
    )
    
    def save(self, *args, **kwargs):
        if not self.expires_at:
            # Token expires after 24 hours
            self.expires_at = timezone.now() + timedelta(hours=24)
        super().save(*args, **kwargs)
    
    def is_expired(self):
        return timezone.now() > self.expires_at
    
    def is_valid(self):
        return not self.is_used and not self.is_expired()
    
    class Meta:
        db_table = 'email_verification_tokens'
        verbose_name = 'Email Verification Token'
        verbose_name_plural = 'Email Verification Tokens'
        indexes = [
            models.Index(fields=['token']),
            models.Index(fields=['user']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"Verification token for {self.user.email}"


class EmailDeliveryLog(models.Model):
    """
    نموذج تتبع حالة إرسال البريد الإلكتروني
    """
    EMAIL_TYPE_CHOICES = [
        ('verification', 'Email Verification'),
        ('password_reset', 'Password Reset'),
        ('notification', 'Notification'),
        ('welcome', 'Welcome Email'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('sent', 'Sent Successfully'),
        ('failed', 'Failed to Send'),
        ('delivered', 'Delivered'),
        ('bounced', 'Bounced'),
        ('opened', 'Opened'),
        ('clicked', 'Clicked'),
    ]
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='email_logs'
    )
    
    email_type = models.CharField(
        max_length=20,
        choices=EMAIL_TYPE_CHOICES,
        help_text='Type of email sent'
    )
    
    recipient_email = models.EmailField(
        help_text='Email address where the email was sent'
    )
    
    subject = models.CharField(
        max_length=255,
        help_text='Email subject line'
    )
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        help_text='Current delivery status'
    )
    
    provider = models.CharField(
        max_length=50,
        default='sendgrid',
        help_text='Email service provider used'
    )
    
    provider_message_id = models.CharField(
        max_length=255,
        blank=True,
        help_text='Provider-specific message ID'
    )
    
    error_message = models.TextField(
        blank=True,
        help_text='Error message if sending failed'
    )
    
    attempts = models.PositiveIntegerField(
        default=1,
        help_text='Number of sending attempts'
    )
    
    sent_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text='When the email was successfully sent'
    )
    
    delivered_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text='When the email was delivered'
    )
    
    opened_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text='When the email was first opened'
    )
    
    clicked_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text='When a link in the email was first clicked'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'email_delivery_logs'
        verbose_name = 'Email Delivery Log'
        verbose_name_plural = 'Email Delivery Logs'
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['email_type']),
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
            models.Index(fields=['provider_message_id']),
        ]
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.email_type} email to {self.recipient_email} - {self.status}"
    
    def mark_as_sent(self, provider_message_id=None):
        """Mark email as successfully sent"""
        self.status = 'sent'
        self.sent_at = timezone.now()
        if provider_message_id:
            self.provider_message_id = provider_message_id
        self.save()
    
    def mark_as_failed(self, error_message):
        """Mark email as failed to send"""
        self.status = 'failed'
        self.error_message = error_message
        self.attempts += 1
        self.save()
    
    def mark_as_delivered(self):
        """Mark email as delivered"""
        self.status = 'delivered'
        self.delivered_at = timezone.now()
        self.save()
    
    def mark_as_opened(self):
        """Mark email as opened"""
        if self.status in ['sent', 'delivered']:
            self.status = 'opened'
            if not self.opened_at:
                self.opened_at = timezone.now()
            self.save()
    
    def mark_as_clicked(self):
        """Mark email as clicked"""
        if self.status in ['sent', 'delivered', 'opened']:
            self.status = 'clicked'
            if not self.clicked_at:
                self.clicked_at = timezone.now()
            self.save()
