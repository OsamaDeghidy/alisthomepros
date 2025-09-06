from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
import uuid

User = get_user_model()


class Country(models.Model):
    """
    نموذج الدول
    """
    name = models.CharField(
        max_length=100,
        unique=True,
        help_text='اسم الدولة'
    )
    code = models.CharField(
        max_length=3,
        unique=True,
        help_text='رمز الدولة (ISO)'
    )
    currency = models.CharField(
        max_length=3,
        help_text='رمز العملة'
    )
    is_active = models.BooleanField(
        default=True,
        help_text='هل الدولة نشطة في النظام'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Country'
        verbose_name_plural = 'Countries'
        ordering = ['name']

    def __str__(self):
        return self.name


class City(models.Model):
    """
    نموذج المدن
    """
    name = models.CharField(
        max_length=100,
        help_text='اسم المدينة'
    )
    country = models.ForeignKey(
        Country,
        on_delete=models.CASCADE,
        related_name='cities',
        help_text='الدولة التابعة لها المدينة'
    )
    latitude = models.DecimalField(
        max_digits=10,
        decimal_places=8,
        null=True,
        blank=True,
        validators=[
            MinValueValidator(-90),
            MaxValueValidator(90)
        ],
        help_text='خط العرض'
    )
    longitude = models.DecimalField(
        max_digits=11,
        decimal_places=8,
        null=True,
        blank=True,
        validators=[
            MinValueValidator(-180),
            MaxValueValidator(180)
        ],
        help_text='خط الطول'
    )
    timezone = models.CharField(
        max_length=50,
        blank=True,
        help_text='المنطقة الزمنية'
    )
    is_active = models.BooleanField(
        default=True,
        help_text='هل المدينة نشطة في النظام'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'City'
        verbose_name_plural = 'Cities'
        unique_together = ['name', 'country']
        ordering = ['name']

    def __str__(self):
        return f"{self.name}, {self.country.name}"


class Address(models.Model):
    """
    نموذج العناوين المفصلة
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    street_address = models.CharField(
        max_length=255,
        help_text='العنوان - الشارع'
    )
    apartment_number = models.CharField(
        max_length=50,
        blank=True,
        help_text='رقم الشقة/المبنى'
    )
    neighborhood = models.CharField(
        max_length=100,
        blank=True,
        help_text='الحي'
    )
    postal_code = models.CharField(
        max_length=20,
        blank=True,
        help_text='الرمز البريدي'
    )
    city = models.ForeignKey(
        City,
        on_delete=models.CASCADE,
        related_name='addresses',
        help_text='المدينة'
    )
    
    # GPS Coordinates
    latitude = models.DecimalField(
        max_digits=10,
        decimal_places=8,
        null=True,
        blank=True,
        validators=[
            MinValueValidator(-90),
            MaxValueValidator(90)
        ],
        help_text='خط العرض'
    )
    longitude = models.DecimalField(
        max_digits=11,
        decimal_places=8,
        null=True,
        blank=True,
        validators=[
            MinValueValidator(-180),
            MaxValueValidator(180)
        ],
        help_text='خط الطول'
    )
    
    # Additional Info
    landmark = models.CharField(
        max_length=255,
        blank=True,
        help_text='معلم مميز قريب'
    )
    notes = models.TextField(
        blank=True,
        help_text='ملاحظات إضافية عن الموقع'
    )
    
    # Verification
    is_verified = models.BooleanField(
        default=False,
        help_text='هل تم التحقق من العنوان'
    )
    verified_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text='تاريخ التحقق'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Address'
        verbose_name_plural = 'Addresses'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.street_address}, {self.city}"
    
    @property
    def full_address(self):
        """العنوان الكامل"""
        parts = [self.street_address]
        if self.apartment_number:
            parts.append(f"Apt {self.apartment_number}")
        if self.neighborhood:
            parts.append(self.neighborhood)
        parts.append(str(self.city))
        if self.postal_code:
            parts.append(self.postal_code)
        return ", ".join(parts)

    def get_coordinates(self):
        """الحصول على الإحداثيات"""
        if self.latitude and self.longitude:
            return float(self.latitude), float(self.longitude)
        return None, None


class UserLocation(models.Model):
    """
    نموذج مواقع المستخدمين
    """
    LOCATION_TYPE_CHOICES = [
        ('primary', 'العنوان الرئيسي'),
        ('secondary', 'عنوان ثانوي'),
        ('work', 'عنوان العمل'),
        ('service', 'منطقة خدمة'),
    ]
    
    PRIVACY_CHOICES = [
        ('public', 'عام'),
        ('professional', 'للمحترفين فقط'),
        ('private', 'خاص'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='locations',
        help_text='المستخدم'
    )
    address = models.ForeignKey(
        Address,
        on_delete=models.CASCADE,
        related_name='user_locations',
        help_text='العنوان'
    )
    location_type = models.CharField(
        max_length=20,
        choices=LOCATION_TYPE_CHOICES,
        default='primary',
        help_text='نوع الموقع'
    )
    label = models.CharField(
        max_length=100,
        blank=True,
        help_text='تسمية مخصصة للموقع'
    )
    privacy_level = models.CharField(
        max_length=20,
        choices=PRIVACY_CHOICES,
        default='private',
        help_text='مستوى الخصوصية'
    )
    is_primary = models.BooleanField(
        default=False,
        help_text='هل هو الموقع الرئيسي'
    )
    is_active = models.BooleanField(
        default=True,
        help_text='هل الموقع نشط'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'User Location'
        verbose_name_plural = 'User Locations'
        unique_together = ['user', 'address']
        ordering = ['-is_primary', '-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.address}"

    def save(self, *args, **kwargs):
        # التأكد من وجود موقع رئيسي واحد فقط
        if self.is_primary:
            UserLocation.objects.filter(
                user=self.user, 
                is_primary=True
            ).exclude(id=self.id).update(is_primary=False)
        super().save(*args, **kwargs)


class ServiceArea(models.Model):
    """
    نموذج مناطق الخدمة للمحترفين
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    professional = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='service_areas',
        help_text='المحترف',
        limit_choices_to={'user_type__in': ['home_pro', 'specialist', 'crew_member']}
    )
    city = models.ForeignKey(
        City,
        on_delete=models.CASCADE,
        related_name='service_areas',
        help_text='المدينة'
    )
    max_distance_km = models.PositiveIntegerField(
        default=50,
        help_text='أقصى مسافة للخدمة بالكيلومتر'
    )
    travel_cost_per_km = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=0,
        help_text='تكلفة السفر لكل كيلومتر'
    )
    minimum_service_fee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        help_text='الحد الأدنى لرسوم الخدمة'
    )
    is_active = models.BooleanField(
        default=True,
        help_text='هل منطقة الخدمة نشطة'
    )
    notes = models.TextField(
        blank=True,
        help_text='ملاحظات حول منطقة الخدمة'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Service Area'
        verbose_name_plural = 'Service Areas'
        unique_together = ['professional', 'city']
        ordering = ['city__name']

    def __str__(self):
        return f"{self.professional.username} - {self.city}"


class LocationHistory(models.Model):
    """
    نموذج تاريخ المواقع (للتتبع والأمان)
    """
    ACTION_CHOICES = [
        ('login', 'تسجيل دخول'),
        ('location_update', 'تحديث موقع'),
        ('service_request', 'طلب خدمة'),
        ('project_visit', 'زيارة مشروع'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='location_history',
        help_text='المستخدم'
    )
    latitude = models.DecimalField(
        max_digits=10,
        decimal_places=8,
        validators=[
            MinValueValidator(-90),
            MaxValueValidator(90)
        ],
        help_text='خط العرض'
    )
    longitude = models.DecimalField(
        max_digits=11,
        decimal_places=8,
        validators=[
            MinValueValidator(-180),
            MaxValueValidator(180)
        ],
        help_text='خط الطول'
    )
    action_type = models.CharField(
        max_length=20,
        choices=ACTION_CHOICES,
        help_text='نوع النشاط'
    )
    ip_address = models.GenericIPAddressField(
        null=True,
        blank=True,
        help_text='عنوان IP'
    )
    user_agent = models.TextField(
        blank=True,
        help_text='معلومات المتصفح'
    )
    accuracy = models.FloatField(
        null=True,
        blank=True,
        help_text='دقة الموقع بالمتر'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Location History'
        verbose_name_plural = 'Location History'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.action_type} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"


class LocationPermission(models.Model):
    """
    نموذج صلاحيات المواقع
    """
    PERMISSION_TYPE_CHOICES = [
        ('view_location', 'عرض الموقع'),
        ('track_location', 'تتبع الموقع'),
        ('share_location', 'مشاركة الموقع'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='location_permissions_granted',
        help_text='المستخدم مانح الصلاحية'
    )
    granted_to = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='location_permissions_received',
        help_text='المستخدم الممنوح له الصلاحية'
    )
    permission_type = models.CharField(
        max_length=20,
        choices=PERMISSION_TYPE_CHOICES,
        help_text='نوع الصلاحية'
    )
    is_active = models.BooleanField(
        default=True,
        help_text='هل الصلاحية نشطة'
    )
    granted_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text='تاريخ انتهاء الصلاحية'
    )

    class Meta:
        verbose_name = 'Location Permission'
        verbose_name_plural = 'Location Permissions'
        unique_together = ['user', 'granted_to', 'permission_type']
        ordering = ['-granted_at']

    def __str__(self):
        return f"{self.user.username} -> {self.granted_to.username} ({self.permission_type})"

    @property
    def is_expired(self):
        """هل انتهت صلاحية الإذن"""
        if self.expires_at:
            return timezone.now() > self.expires_at
        return False
