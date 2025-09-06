from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    Country, City, Address, UserLocation, 
    ServiceArea, LocationHistory, LocationPermission
)
import math

User = get_user_model()


class CountrySerializer(serializers.ModelSerializer):
    """
    Serializer للدول
    """
    cities_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Country
        fields = [
            'id', 'name', 'code', 'currency', 'is_active',
            'cities_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def get_cities_count(self, obj):
        return obj.cities.filter(is_active=True).count()


class CitySerializer(serializers.ModelSerializer):
    """
    Serializer للمدن
    """
    country_name = serializers.CharField(source='country.name', read_only=True)
    country_code = serializers.CharField(source='country.code', read_only=True)
    
    class Meta:
        model = City
        fields = [
            'id', 'name', 'country', 'country_name', 'country_code',
            'latitude', 'longitude', 'timezone', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class AddressSerializer(serializers.ModelSerializer):
    """
    Serializer للعناوين
    """
    city_name = serializers.CharField(source='city.name', read_only=True)
    country_name = serializers.CharField(source='city.country.name', read_only=True)
    full_address = serializers.ReadOnlyField()
    coordinates = serializers.SerializerMethodField()
    
    class Meta:
        model = Address
        fields = [
            'id', 'street_address', 'apartment_number', 'neighborhood',
            'postal_code', 'city', 'city_name', 'country_name',
            'latitude', 'longitude', 'coordinates', 'landmark', 'notes',
            'is_verified', 'verified_at', 'full_address',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at', 'verified_at']
    
    def get_coordinates(self, obj):
        lat, lng = obj.get_coordinates()
        if lat and lng:
            return {'latitude': lat, 'longitude': lng}
        return None


class AddressCreateSerializer(serializers.ModelSerializer):
    """
    Serializer لإنشاء العناوين مع التحقق المتقدم
    """
    class Meta:
        model = Address
        fields = [
            'street_address', 'apartment_number', 'neighborhood',
            'postal_code', 'city', 'latitude', 'longitude',
            'landmark', 'notes'
        ]
    
    def validate(self, data):
        # التحقق من صحة الإحداثيات
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        
        if latitude and not (-90 <= latitude <= 90):
            raise serializers.ValidationError(
                "خط العرض يجب أن يكون بين -90 و 90"
            )
        
        if longitude and not (-180 <= longitude <= 180):
            raise serializers.ValidationError(
                "خط الطول يجب أن يكون بين -180 و 180"
            )
        
        return data


class UserLocationSerializer(serializers.ModelSerializer):
    """
    Serializer لمواقع المستخدمين
    """
    address = AddressSerializer(read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = UserLocation
        fields = [
            'id', 'user', 'user_name', 'address', 'location_type',
            'label', 'privacy_level', 'is_primary', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class UserLocationCreateSerializer(serializers.ModelSerializer):
    """
    Serializer لإنشاء مواقع المستخدمين
    """
    address_data = AddressCreateSerializer(write_only=True)
    
    class Meta:
        model = UserLocation
        fields = [
            'address_data', 'location_type', 'label', 
            'privacy_level', 'is_primary'
        ]
    
    def create(self, validated_data):
        address_data = validated_data.pop('address_data')
        user = self.context['request'].user
        
        # إنشاء العنوان أولاً
        address = Address.objects.create(**address_data)
        
        # إنشاء موقع المستخدم
        user_location = UserLocation.objects.create(
            user=user,
            address=address,
            **validated_data
        )
        
        return user_location


class ServiceAreaSerializer(serializers.ModelSerializer):
    """
    Serializer لمناطق الخدمة
    """
    professional_name = serializers.CharField(source='professional.username', read_only=True)
    city_name = serializers.CharField(source='city.name', read_only=True)
    country_name = serializers.CharField(source='city.country.name', read_only=True)
    
    class Meta:
        model = ServiceArea
        fields = [
            'id', 'professional', 'professional_name', 'city', 'city_name', 
            'country_name', 'max_distance_km', 'travel_cost_per_km',
            'minimum_service_fee', 'is_active', 'notes',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class LocationHistorySerializer(serializers.ModelSerializer):
    """
    Serializer لتاريخ المواقع
    """
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = LocationHistory
        fields = [
            'id', 'user', 'user_name', 'latitude', 'longitude',
            'action_type', 'ip_address', 'user_agent', 'accuracy',
            'created_at'
        ]
        read_only_fields = ['created_at']


class LocationPermissionSerializer(serializers.ModelSerializer):
    """
    Serializer لصلاحيات المواقع
    """
    user_name = serializers.CharField(source='user.username', read_only=True)
    granted_to_name = serializers.CharField(source='granted_to.username', read_only=True)
    is_expired = serializers.ReadOnlyField()
    
    class Meta:
        model = LocationPermission
        fields = [
            'id', 'user', 'user_name', 'granted_to', 'granted_to_name',
            'permission_type', 'is_active', 'is_expired',
            'granted_at', 'expires_at'
        ]
        read_only_fields = ['granted_at']


class NearbyProfessionalsSerializer(serializers.Serializer):
    """
    Serializer للبحث عن المحترفين القريبين
    """
    latitude = serializers.DecimalField(
        max_digits=10, 
        decimal_places=8,
        min_value=-90,
        max_value=90
    )
    longitude = serializers.DecimalField(
        max_digits=11, 
        decimal_places=8,
        min_value=-180,
        max_value=180
    )
    radius_km = serializers.IntegerField(
        min_value=1,
        max_value=100,
        default=25
    )
    professional_type = serializers.ChoiceField(
        choices=['home_pro', 'specialist', 'crew_member'],
        required=False
    )


class DistanceCalculationSerializer(serializers.Serializer):
    """
    Serializer لحساب المسافات
    """
    from_latitude = serializers.DecimalField(max_digits=10, decimal_places=8)
    from_longitude = serializers.DecimalField(max_digits=11, decimal_places=8)
    to_latitude = serializers.DecimalField(max_digits=10, decimal_places=8)
    to_longitude = serializers.DecimalField(max_digits=11, decimal_places=8)
    
    def calculate_distance(self):
        """حساب المسافة بالكيلومتر باستخدام معادلة Haversine"""
        data = self.validated_data
        
        lat1 = math.radians(float(data['from_latitude']))
        lon1 = math.radians(float(data['from_longitude']))
        lat2 = math.radians(float(data['to_latitude']))
        lon2 = math.radians(float(data['to_longitude']))
        
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        
        a = (math.sin(dlat/2)**2 + 
             math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2)
        c = 2 * math.asin(math.sqrt(a))
        
        # نصف قطر الأرض بالكيلومتر
        radius = 6371
        
        return radius * c


class LocationSearchSerializer(serializers.Serializer):
    """
    Serializer للبحث في المواقع
    """
    query = serializers.CharField(max_length=255)
    country_code = serializers.CharField(max_length=3, required=False)
    city_id = serializers.IntegerField(required=False)
    latitude = serializers.DecimalField(
        max_digits=10, 
        decimal_places=8, 
        required=False
    )
    longitude = serializers.DecimalField(
        max_digits=11, 
        decimal_places=8, 
        required=False
    )
    radius_km = serializers.IntegerField(
        min_value=1,
        max_value=100,
        default=10,
        required=False
    )


class ProfessionalLocationSerializer(serializers.ModelSerializer):
    """
    Serializer لمواقع المحترفين مع معلومات إضافية
    """
    user_type = serializers.CharField(source='user.user_type', read_only=True)
    full_name = serializers.SerializerMethodField()
    avatar = serializers.CharField(source='user.avatar.url', read_only=True)
    rating = serializers.SerializerMethodField()
    service_areas = ServiceAreaSerializer(source='user.service_areas', many=True, read_only=True)
    
    class Meta:
        model = UserLocation
        fields = [
            'id', 'user', 'user_type', 'full_name', 'avatar', 'rating',
            'address', 'location_type', 'label', 'service_areas',
            'created_at'
        ]
    
    def get_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip()
    
    def get_rating(self, obj):
        # هنا يمكن إضافة حساب التقييم من نظام المراجعات
        return 4.5  # مؤقت 