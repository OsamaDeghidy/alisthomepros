from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.db.models import Count
from .models import (
    Country, City, Address, UserLocation,
    ServiceArea, LocationHistory, LocationPermission
)


@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    """
    إدارة الدول
    """
    list_display = ['name', 'code', 'currency', 'cities_count', 'is_active', 'created_at']
    list_filter = ['is_active', 'currency', 'created_at']
    search_fields = ['name', 'code']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['name']
    
    def cities_count(self, obj):
        count = obj.cities.filter(is_active=True).count()
        url = reverse('admin:location_services_city_changelist') + f'?country__id__exact={obj.id}'
        return format_html('<a href="{}">{} مدينة</a>', url, count)
    cities_count.short_description = 'عدد المدن'


@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    """
    إدارة المدن
    """
    list_display = ['name', 'country', 'latitude', 'longitude', 'timezone', 'is_active', 'created_at']
    list_filter = ['country', 'is_active', 'created_at']
    search_fields = ['name', 'country__name']
    readonly_fields = ['created_at', 'updated_at']
    autocomplete_fields = ['country']
    ordering = ['country__name', 'name']
    
    fieldsets = (
        ('معلومات أساسية', {
            'fields': ('name', 'country', 'is_active')
        }),
        ('الموقع الجغرافي', {
            'fields': ('latitude', 'longitude', 'timezone')
        }),
        ('معلومات النظام', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    """
    إدارة العناوين
    """
    list_display = ['street_address', 'city', 'neighborhood', 'is_verified', 'users_count', 'created_at']
    list_filter = ['is_verified', 'city__country', 'created_at']
    search_fields = ['street_address', 'neighborhood', 'city__name', 'landmark']
    readonly_fields = ['id', 'created_at', 'updated_at', 'full_address']
    autocomplete_fields = ['city']
    ordering = ['-created_at']
    
    fieldsets = (
        ('معلومات العنوان', {
            'fields': ('street_address', 'apartment_number', 'neighborhood', 'city', 'postal_code')
        }),
        ('الإحداثيات', {
            'fields': ('latitude', 'longitude')
        }),
        ('تفاصيل إضافية', {
            'fields': ('landmark', 'notes'),
            'classes': ('collapse',)
        }),
        ('التحقق', {
            'fields': ('is_verified', 'verified_at')
        }),
        ('معلومات النظام', {
            'fields': ('id', 'full_address', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    def users_count(self, obj):
        count = obj.user_locations.count()
        if count > 0:
            url = reverse('admin:location_services_userlocation_changelist') + f'?address__id__exact={obj.id}'
            return format_html('<a href="{}">{} مستخدم</a>', url, count)
        return '0'
    users_count.short_description = 'عدد المستخدمين'
    
    actions = ['mark_as_verified', 'mark_as_unverified']
    
    def mark_as_verified(self, request, queryset):
        from django.utils import timezone
        updated = queryset.update(is_verified=True, verified_at=timezone.now())
        self.message_user(request, f'تم التحقق من {updated} عنوان.')
    mark_as_verified.short_description = 'تمييز كمُحقق منه'
    
    def mark_as_unverified(self, request, queryset):
        updated = queryset.update(is_verified=False, verified_at=None)
        self.message_user(request, f'تم إلغاء التحقق من {updated} عنوان.')
    mark_as_unverified.short_description = 'إلغاء التحقق'


@admin.register(UserLocation)
class UserLocationAdmin(admin.ModelAdmin):
    """
    إدارة مواقع المستخدمين
    """
    list_display = ['user', 'address_summary', 'location_type', 'privacy_level', 'is_primary', 'is_active', 'created_at']
    list_filter = ['location_type', 'privacy_level', 'is_primary', 'is_active', 'created_at']
    search_fields = ['user__username', 'user__email', 'address__street_address', 'label']
    readonly_fields = ['id', 'created_at', 'updated_at']
    autocomplete_fields = ['user', 'address']
    ordering = ['-created_at']
    
    fieldsets = (
        ('المستخدم والموقع', {
            'fields': ('user', 'address', 'location_type', 'label')
        }),
        ('الإعدادات', {
            'fields': ('privacy_level', 'is_primary', 'is_active')
        }),
        ('معلومات النظام', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    def address_summary(self, obj):
        return f"{obj.address.street_address}, {obj.address.city}"
    address_summary.short_description = 'العنوان'


@admin.register(ServiceArea)
class ServiceAreaAdmin(admin.ModelAdmin):
    """
    إدارة مناطق الخدمة
    """
    list_display = ['professional', 'city', 'max_distance_km', 'travel_cost_per_km', 'minimum_service_fee', 'is_active', 'created_at']
    list_filter = ['is_active', 'city__country', 'created_at']
    search_fields = ['professional__username', 'professional__email', 'city__name']
    readonly_fields = ['id', 'created_at', 'updated_at']
    autocomplete_fields = ['professional', 'city']
    ordering = ['-created_at']
    
    fieldsets = (
        ('المحترف والمنطقة', {
            'fields': ('professional', 'city')
        }),
        ('تفاصيل الخدمة', {
            'fields': ('max_distance_km', 'travel_cost_per_km', 'minimum_service_fee')
        }),
        ('الإعدادات', {
            'fields': ('is_active', 'notes')
        }),
        ('معلومات النظام', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('professional', 'city', 'city__country')


@admin.register(LocationHistory)
class LocationHistoryAdmin(admin.ModelAdmin):
    """
    إدارة تاريخ المواقع
    """
    list_display = ['user', 'action_type', 'latitude', 'longitude', 'accuracy', 'ip_address', 'created_at']
    list_filter = ['action_type', 'created_at']
    search_fields = ['user__username', 'user__email', 'ip_address']
    readonly_fields = ['id', 'created_at', 'coordinates_link']
    autocomplete_fields = ['user']
    ordering = ['-created_at']
    
    fieldsets = (
        ('المستخدم والنشاط', {
            'fields': ('user', 'action_type')
        }),
        ('الموقع', {
            'fields': ('latitude', 'longitude', 'accuracy', 'coordinates_link')
        }),
        ('معلومات الجلسة', {
            'fields': ('ip_address', 'user_agent'),
            'classes': ('collapse',)
        }),
        ('معلومات النظام', {
            'fields': ('id', 'created_at'),
            'classes': ('collapse',)
        })
    )
    
    def coordinates_link(self, obj):
        if obj.latitude and obj.longitude:
            google_maps_url = f"https://www.google.com/maps?q={obj.latitude},{obj.longitude}"
            return format_html('<a href="{}" target="_blank">عرض على الخريطة</a>', google_maps_url)
        return '-'
    coordinates_link.short_description = 'رابط الخريطة'
    
    def has_add_permission(self, request):
        # منع إضافة سجلات تاريخ المواقع يدوياً
        return False
    
    def has_change_permission(self, request, obj=None):
        # منع تعديل سجلات تاريخ المواقع
        return False


@admin.register(LocationPermission)
class LocationPermissionAdmin(admin.ModelAdmin):
    """
    إدارة صلاحيات المواقع
    """
    list_display = ['user', 'granted_to', 'permission_type', 'is_active', 'is_expired_status', 'granted_at', 'expires_at']
    list_filter = ['permission_type', 'is_active', 'granted_at']
    search_fields = ['user__username', 'granted_to__username']
    readonly_fields = ['id', 'granted_at', 'is_expired_status']
    autocomplete_fields = ['user', 'granted_to']
    ordering = ['-granted_at']
    
    fieldsets = (
        ('الصلاحية', {
            'fields': ('user', 'granted_to', 'permission_type')
        }),
        ('الإعدادات', {
            'fields': ('is_active', 'expires_at')
        }),
        ('معلومات النظام', {
            'fields': ('id', 'granted_at', 'is_expired_status'),
            'classes': ('collapse',)
        })
    )
    
    def is_expired_status(self, obj):
        if obj.is_expired:
            return format_html('<span style="color: red;">منتهية الصلاحية</span>')
        return format_html('<span style="color: green;">نشطة</span>')
    is_expired_status.short_description = 'حالة الصلاحية'
    
    actions = ['activate_permissions', 'deactivate_permissions']
    
    def activate_permissions(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f'تم تفعيل {updated} صلاحية.')
    activate_permissions.short_description = 'تفعيل الصلاحيات'
    
    def deactivate_permissions(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f'تم إلغاء تفعيل {updated} صلاحية.')
    deactivate_permissions.short_description = 'إلغاء تفعيل الصلاحيات'


# تخصيص واجهة الإدارة
admin.site.site_header = 'إدارة نظام تتبع المواقع'
admin.site.site_title = 'نظام المواقع'
admin.site.index_title = 'لوحة تحكم المواقع الجغرافية'
