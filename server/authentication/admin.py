from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import User, UserProfile, EmailDeliveryLog


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    واجهة إدارة متقدمة للمستخدمين
    """
    
    list_display = (
        'username',
        'email',
        'get_full_name',
        'user_type',
        'is_verified',
        'is_available',
        'rating_display',
        'projects_completed',
        'created_at',
        'is_active',
    )
    
    list_filter = (
        'user_type',
        'is_verified',
        'is_available',
        'verification_status',
        'insurance_verified',
        'background_check_verified',
        'is_active',
        'is_staff',
        'created_at',
    )
    
    search_fields = (
        'username',
        'email',
        'first_name',
        'last_name',
        'phone',
        'location',
        'company_name',
    )
    
    readonly_fields = (
        'last_login',
        'date_joined',
        'created_at',
        'updated_at',
        'last_activity',
        'rating_average',
        'rating_count',
        'projects_completed',
        'total_earnings',
    )
    
    fieldsets = (
        ('Basic Information', {
            'fields': (
                'username',
                'email',
                'first_name',
                'last_name',
                'phone',
                'location',
                'avatar',
            )
        }),
        ('Account Type & Status', {
            'fields': (
                'user_type',
                'is_verified',
                'verification_status',
                'is_available',
                'is_active',
                'is_staff',
                'is_superuser',
            )
        }),
        ('Professional Information', {
            'fields': (
                'company_name',
                'bio',
                'website',
                'experience_years',
                'hourly_rate',
                'skills',
            ),
            'classes': ('collapse',),
        }),
        ('Verification & Compliance', {
            'fields': (
                'license_number',
                'insurance_verified',
                'background_check_verified',
            ),
            'classes': ('collapse',),
        }),
        ('Statistics & Performance', {
            'fields': (
                'rating_average',
                'rating_count',
                'projects_completed',
                'total_earnings',
            ),
            'classes': ('collapse',),
        }),
        ('Preferences', {
            'fields': (
                'notification_preferences',
            ),
            'classes': ('collapse',),
        }),
        ('Timestamps', {
            'fields': (
                'last_login',
                'date_joined',
                'created_at',
                'updated_at',
                'last_activity',
            ),
            'classes': ('collapse',),
        }),
        ('Permissions', {
            'fields': (
                'groups',
                'user_permissions',
            ),
            'classes': ('collapse',),
        }),
    )
    
    add_fieldsets = (
        ('Basic Information', {
            'fields': (
                'username',
                'email',
                'first_name',
                'last_name',
                'password1',
                'password2',
                'user_type',
            )
        }),
        ('Contact Information', {
            'fields': (
                'phone',
                'location',
            )
        }),
    )
    
    def rating_display(self, obj):
        """Display rating with stars"""
        try:
            # التحويل الآمن للقيم
            rating_avg = 0.0
            rating_count = 0
            
            if hasattr(obj, 'rating_average') and obj.rating_average:
                try:
                    rating_avg = float(str(obj.rating_average))
                except (ValueError, TypeError):
                    rating_avg = 0.0
            
            if hasattr(obj, 'rating_count') and obj.rating_count:
                try:
                    rating_count = int(str(obj.rating_count))
                except (ValueError, TypeError):
                    rating_count = 0
            
            if rating_avg > 0:
                stars = '⭐' * int(rating_avg)
                title_text = f"{rating_avg:.2f} ({rating_count} reviews)"
                return format_html(
                    '<span title="{}">{}</span>',
                    title_text,
                    stars
                )
            return '-'
        except Exception:
            return '-'
    rating_display.short_description = 'Rating'
    
    def get_queryset(self, request):
        """Optimize queryset with select_related"""
        queryset = super().get_queryset(request)
        return queryset.select_related('profile')
    
    def has_add_permission(self, request):
        """Check if user can add new users"""
        return request.user.is_superuser
    
    def has_change_permission(self, request, obj=None):
        """Check if user can change users"""
        if request.user.is_superuser:
            return True
        if obj and obj == request.user:
            return True
        return False
    
    def has_delete_permission(self, request, obj=None):
        """Check if user can delete users"""
        return request.user.is_superuser
    
    actions = ['verify_users', 'unverify_users', 'make_available', 'make_unavailable']
    
    def verify_users(self, request, queryset):
        """Verify selected users"""
        updated = queryset.update(is_verified=True, verification_status='verified')
        self.message_user(request, f'{updated} users were successfully verified.')
    verify_users.short_description = 'Verify selected users'
    
    def unverify_users(self, request, queryset):
        """Unverify selected users"""
        updated = queryset.update(is_verified=False, verification_status='pending')
        self.message_user(request, f'{updated} users were unverified.')
    unverify_users.short_description = 'Unverify selected users'
    
    def make_available(self, request, queryset):
        """Make selected users available"""
        updated = queryset.update(is_available=True)
        self.message_user(request, f'{updated} users were made available.')
    make_available.short_description = 'Make selected users available'
    
    def make_unavailable(self, request, queryset):
        """Make selected users unavailable"""
        updated = queryset.update(is_available=False)
        self.message_user(request, f'{updated} users were made unavailable.')
    make_unavailable.short_description = 'Make selected users unavailable'


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    """
    واجهة إدارة ملفات المستخدمين الشخصية
    """
    
    list_display = (
        'user',
        'get_user_type',
        'get_user_email',
        'has_social_links',
        'has_certifications',
        'created_at',
    )
    
    list_filter = (
        'user__user_type',
        'user__is_verified',
        'created_at',
    )
    
    search_fields = (
        'user__username',
        'user__email',
        'user__first_name',
        'user__last_name',
        'emergency_contact_name',
        'tax_id',
    )
    
    readonly_fields = (
        'created_at',
        'updated_at',
    )
    
    fieldsets = (
        ('User Information', {
            'fields': (
                'user',
            )
        }),
        ('Social Links', {
            'fields': (
                'linkedin_url',
                'facebook_url',
                'instagram_url',
                'twitter_url',
            ),
            'classes': ('collapse',),
        }),
        ('Professional Portfolio', {
            'fields': (
                'portfolio_images',
                'certifications',
            ),
            'classes': ('collapse',),
        }),
        ('Emergency Contact', {
            'fields': (
                'emergency_contact_name',
                'emergency_contact_phone',
            ),
            'classes': ('collapse',),
        }),
        ('Business Information', {
            'fields': (
                'business_address',
                'tax_id',
                'bank_account_info',
            ),
            'classes': ('collapse',),
        }),
        ('Availability & Service', {
            'fields': (
                'availability_schedule',
                'service_areas',
            ),
            'classes': ('collapse',),
        }),
        ('Timestamps', {
            'fields': (
                'created_at',
                'updated_at',
            ),
            'classes': ('collapse',),
        }),
    )
    
    def get_user_type(self, obj):
        """Get user type"""
        return obj.user.get_user_type_display()
    get_user_type.short_description = 'User Type'
    
    def get_user_email(self, obj):
        """Get user email"""
        return obj.user.email
    get_user_email.short_description = 'Email'
    
    def has_social_links(self, obj):
        """Check if user has social links"""
        return bool(obj.linkedin_url or obj.facebook_url or obj.instagram_url or obj.twitter_url)
    has_social_links.boolean = True
    has_social_links.short_description = 'Social Links'
    
    def has_certifications(self, obj):
        """Check if user has certifications"""
        return bool(obj.certifications)
    has_certifications.boolean = True
    has_certifications.short_description = 'Certifications'
    
    def get_queryset(self, request):
        """Optimize queryset"""
        queryset = super().get_queryset(request)
        return queryset.select_related('user')


# Customize admin site
@admin.register(EmailDeliveryLog)
class EmailDeliveryLogAdmin(admin.ModelAdmin):
    """
    واجهة إدارة سجلات إرسال البريد الإلكتروني
    """
    
    list_display = (
        'id',
        'user_email',
        'email_type',
        'status',
        'provider_message_id',
        'created_at',
        'delivered_at',
        'attempts',
    )
    
    list_filter = (
        'status',
        'email_type',
        'provider',
        'created_at',
        'delivered_at',
    )
    
    search_fields = (
        'user__email',
        'user__username',
        'provider_message_id',
        'error_message',
        'recipient_email',
    )
    
    readonly_fields = (
        'id',
        'user',
        'email_type',
        'recipient_email',
        'subject',
        'provider_message_id',
        'status',
        'provider',
        'attempts',
        'created_at',
        'updated_at',
        'sent_at',
        'delivered_at',
        'opened_at',
        'clicked_at',
        'error_message',
    )
    
    fieldsets = (
        ('معلومات أساسية', {
            'fields': (
                'id',
                'user',
                'email_type',
                'status',
            )
        }),
        ('معلومات الإرسال', {
            'fields': (
                'recipient_email',
                'subject',
                'provider',
                'provider_message_id',
                'attempts',
            ),
            'classes': ('collapse',),
        }),
        ('التوقيتات', {
            'fields': (
                'created_at',
                'updated_at',
                'sent_at',
                'delivered_at',
                'opened_at',
                'clicked_at',
            )
        }),
        ('معلومات الخطأ', {
            'fields': (
                'error_message',
            ),
            'classes': ('collapse',),
        }),
    )
    
    def user_email(self, obj):
        """عرض البريد الإلكتروني للمستخدم"""
        return obj.user.email if obj.user else 'N/A'
    user_email.short_description = 'البريد الإلكتروني'
    
    def has_add_permission(self, request):
        """منع إضافة سجلات جديدة يدوياً"""
        return False
    
    def has_change_permission(self, request, obj=None):
        """منع تعديل السجلات"""
        return False
    
    def has_delete_permission(self, request, obj=None):
        """السماح بحذف السجلات القديمة فقط للمشرفين"""
        return request.user.is_superuser
    
    ordering = ['-created_at']
    
    def get_queryset(self, request):
        """تحسين الاستعلام لتجنب N+1 queries"""
        return super().get_queryset(request).select_related('user')


admin.site.site_header = 'A-List Home Professionals Admin'
admin.site.site_title = 'A-List Admin'
admin.site.index_title = 'Welcome to A-List Administration'
