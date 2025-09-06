from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from django.db.models import Q, F
from django.utils import timezone
from .models import (
    Country, City, Address, UserLocation,
    ServiceArea, LocationHistory, LocationPermission
)
from .serializers import (
    CountrySerializer, CitySerializer, AddressSerializer, AddressCreateSerializer,
    UserLocationSerializer, UserLocationCreateSerializer,
    ServiceAreaSerializer, LocationHistorySerializer, LocationPermissionSerializer,
    NearbyProfessionalsSerializer, DistanceCalculationSerializer,
    LocationSearchSerializer, ProfessionalLocationSerializer
)
import math
import requests
from django.conf import settings

User = get_user_model()


class CountryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet للدول - قراءة فقط
    """
    queryset = Country.objects.filter(is_active=True)
    serializer_class = CountrySerializer
    permission_classes = [permissions.AllowAny]
    
    @action(detail=True, methods=['get'])
    def cities(self, request, pk=None):
        """الحصول على مدن دولة معينة"""
        country = self.get_object()
        cities = country.cities.filter(is_active=True)
        serializer = CitySerializer(cities, many=True)
        return Response(serializer.data)


class CityViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet للمدن - قراءة فقط
    """
    queryset = City.objects.filter(is_active=True).select_related('country')
    serializer_class = CitySerializer
    permission_classes = [permissions.AllowAny]
    filterset_fields = ['country']
    search_fields = ['name', 'country__name']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        country_code = self.request.query_params.get('country_code')
        if country_code:
            queryset = queryset.filter(country__code=country_code)
        return queryset


class AddressViewSet(viewsets.ModelViewSet):
    """
    ViewSet للعناوين
    """
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # المستخدمون يرون عناوينهم فقط
        if self.request.user.is_staff:
            return Address.objects.all()
        return Address.objects.filter(
            user_locations__user=self.request.user
        ).distinct()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return AddressCreateSerializer
        return AddressSerializer
    
    @action(detail=False, methods=['post'])
    def geocode(self, request):
        """تحويل العنوان إلى إحداثيات GPS"""
        address_text = request.data.get('address')
        if not address_text:
            return Response(
                {'error': 'العنوان مطلوب'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # هنا يمكن استخدام خدمة geocoding حقيقية
        # مثل Google Maps API أو OpenStreetMap
        try:
            # مثال بسيط - في الحقيقة نحتاج API key
            coordinates = self._geocode_address(address_text)
            return Response({
                'address': address_text,
                'coordinates': coordinates
            })
        except Exception as e:
            return Response(
                {'error': 'فشل في تحديد الموقع'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def _geocode_address(self, address):
        """وظيفة مساعدة لتحويل العنوان لإحداثيات"""
        # هذا مثال بسيط - في التطبيق الحقيقي نستخدم API
        # للتبسيط، سنعيد إحداثيات عشوائية
        return {
            'latitude': 31.2001,  # القاهرة
            'longitude': 29.9187
        }


class UserLocationViewSet(viewsets.ModelViewSet):
    """
    ViewSet لمواقع المستخدمين
    """
    serializer_class = UserLocationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return UserLocation.objects.filter(
            user=self.request.user,
            is_active=True
        ).select_related('address', 'address__city', 'address__city__country')
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserLocationCreateSerializer
        return UserLocationSerializer
    
    @action(detail=True, methods=['post'])
    def set_primary(self, request, pk=None):
        """تعيين موقع كرئيسي"""
        location = self.get_object()
        
        # إلغاء الموقع الرئيسي الحالي
        UserLocation.objects.filter(
            user=request.user,
            is_primary=True
        ).update(is_primary=False)
        
        # تعيين الموقع الجديد كرئيسي
        location.is_primary = True
        location.save()
        
        return Response({'message': 'تم تعيين الموقع الرئيسي بنجاح'})
    
    @action(detail=False, methods=['get'])
    def primary(self, request):
        """الحصول على الموقع الرئيسي"""
        try:
            primary_location = UserLocation.objects.get(
                user=request.user,
                is_primary=True,
                is_active=True
            )
            serializer = self.get_serializer(primary_location)
            return Response(serializer.data)
        except UserLocation.DoesNotExist:
            return Response(
                {'error': 'لا يوجد موقع رئيسي'},
                status=status.HTTP_404_NOT_FOUND
            )


class ServiceAreaViewSet(viewsets.ModelViewSet):
    """
    ViewSet لمناطق الخدمة
    """
    serializer_class = ServiceAreaSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.user_type in ['home_pro', 'specialist', 'crew_member']:
            return ServiceArea.objects.filter(
                professional=self.request.user,
                is_active=True
            ).select_related('city', 'city__country')
        return ServiceArea.objects.none()
    
    def perform_create(self, serializer):
        serializer.save(professional=self.request.user)
    
    @action(detail=False, methods=['get'])
    def coverage_map(self, request):
        """خريطة التغطية للمحترف"""
        service_areas = self.get_queryset()
        coverage_data = []
        
        for area in service_areas:
            coverage_data.append({
                'city': area.city.name,
                'country': area.city.country.name,
                'coordinates': {
                    'latitude': float(area.city.latitude) if area.city.latitude else None,
                    'longitude': float(area.city.longitude) if area.city.longitude else None
                },
                'max_distance_km': area.max_distance_km,
                'travel_cost_per_km': float(area.travel_cost_per_km),
                'minimum_service_fee': float(area.minimum_service_fee)
            })
        
        return Response(coverage_data)


class LocationHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet لتاريخ المواقع - قراءة فقط
    """
    serializer_class = LocationHistorySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return LocationHistory.objects.filter(
            user=self.request.user
        ).order_by('-created_at')
    
    @action(detail=False, methods=['post'])
    def log_location(self, request):
        """تسجيل موقع جديد في التاريخ"""
        latitude = request.data.get('latitude')
        longitude = request.data.get('longitude')
        action_type = request.data.get('action_type', 'location_update')
        accuracy = request.data.get('accuracy')
        
        if not latitude or not longitude:
            return Response(
                {'error': 'الإحداثيات مطلوبة'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # الحصول على معلومات الطلب
        ip_address = self._get_client_ip(request)
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        
        # إنشاء سجل تاريخ الموقع
        location_log = LocationHistory.objects.create(
            user=request.user,
            latitude=latitude,
            longitude=longitude,
            action_type=action_type,
            ip_address=ip_address,
            user_agent=user_agent,
            accuracy=accuracy
        )
        
        serializer = self.get_serializer(location_log)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def _get_client_ip(self, request):
        """الحصول على عنوان IP الخاص بالعميل"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class LocationPermissionViewSet(viewsets.ModelViewSet):
    """
    ViewSet لصلاحيات المواقع
    """
    serializer_class = LocationPermissionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return LocationPermission.objects.filter(
            Q(user=self.request.user) | Q(granted_to=self.request.user)
        ).select_related('user', 'granted_to')
    
    @action(detail=False, methods=['get'])
    def granted_by_me(self, request):
        """الصلاحيات التي منحتها للآخرين"""
        permissions = LocationPermission.objects.filter(
            user=request.user,
            is_active=True
        )
        serializer = self.get_serializer(permissions, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def granted_to_me(self, request):
        """الصلاحيات الممنوحة لي من الآخرين"""
        permissions = LocationPermission.objects.filter(
            granted_to=request.user,
            is_active=True
        )
        serializer = self.get_serializer(permissions, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def revoke(self, request, pk=None):
        """إلغاء صلاحية"""
        permission = self.get_object()
        
        # التأكد من أن المستخدم يملك حق إلغاء الصلاحية
        if permission.user != request.user:
            return Response(
                {'error': 'غير مصرح لك بإلغاء هذه الصلاحية'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        permission.is_active = False
        permission.save()
        
        return Response({'message': 'تم إلغاء الصلاحية بنجاح'})


class LocationSearchViewSet(viewsets.ViewSet):
    """
    ViewSet للبحث الجغرافي المتقدم
    """
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['post'])
    def nearby_professionals(self, request):
        """البحث عن المحترفين القريبين"""
        serializer = NearbyProfessionalsSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        
        data = serializer.validated_data
        latitude = float(data['latitude'])
        longitude = float(data['longitude'])
        radius_km = data['radius_km']
        professional_type = data.get('professional_type')
        
        # البحث عن المحترفين في المنطقة
        professionals = self._find_nearby_professionals(
            latitude, longitude, radius_km, professional_type
        )
        
        return Response({
            'search_location': {
                'latitude': latitude,
                'longitude': longitude,
                'radius_km': radius_km
            },
            'professionals': professionals,
            'total_found': len(professionals)
        })
    
    @action(detail=False, methods=['post'])
    def calculate_distance(self, request):
        """حساب المسافة بين نقطتين"""
        serializer = DistanceCalculationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        
        distance_km = serializer.calculate_distance()
        
        return Response({
            'distance_km': round(distance_km, 2),
            'distance_miles': round(distance_km * 0.621371, 2)
        })
    
    @action(detail=False, methods=['get'])
    def search_locations(self, request):
        """البحث في المواقع والعناوين"""
        serializer = LocationSearchSerializer(data=request.query_params)
        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        
        data = serializer.validated_data
        query = data['query']
        
        # البحث في المدن
        cities = City.objects.filter(
            Q(name__icontains=query) | Q(country__name__icontains=query),
            is_active=True
        ).select_related('country')
        
        # البحث في العناوين
        addresses = Address.objects.filter(
            Q(street_address__icontains=query) |
            Q(neighborhood__icontains=query) |
            Q(city__name__icontains=query),
            is_verified=True
        ).select_related('city', 'city__country')
        
        return Response({
            'cities': CitySerializer(cities[:10], many=True).data,
            'addresses': AddressSerializer(addresses[:10], many=True).data
        })
    
    def _find_nearby_professionals(self, lat, lng, radius_km, prof_type=None):
        """Find professionals within radius"""
        # Implementation would go here
        return []


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def get_public_professional_location(request, professional_id):
    """Get professional's public location information"""
    try:
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        professional = User.objects.get(
            id=professional_id,
            is_active=True,
            user_type__in=['home_pro', 'specialist', 'crew_member']
        )
        
        # Get professional's primary location (public info only)
        try:
            primary_location = UserLocation.objects.get(
                user=professional,
                is_primary=True,
                is_active=True
            )
            
            location_data = {
                'city': primary_location.address.city.name if primary_location.address and primary_location.address.city else 'Not Specified',
                'country': primary_location.address.city.country.name if primary_location.address and primary_location.address.city and primary_location.address.city.country else 'Not Specified',
                'region': getattr(primary_location.address, 'neighborhood', 'Not Specified') if primary_location.address else 'Not Specified'
            }
        except UserLocation.DoesNotExist:
            location_data = {
                'city': 'Not Specified',
                'country': 'Not Specified',
                'region': 'Not Specified'
            }
        
        # Get service areas (public info)
        service_areas = ServiceArea.objects.filter(
            professional=professional,
            is_active=True
        ).select_related('city', 'city__country')
        
        service_areas_data = []
        for area in service_areas:
            service_areas_data.append({
                'city': area.city.name,
                'country': area.city.country.name,
                'max_distance_km': area.max_distance_km
            })
        
        return Response({
            'professional_id': professional.id,
            'primary_location': location_data,
            'service_areas': service_areas_data,
            'total_service_areas': len(service_areas_data)
        })
        
    except User.DoesNotExist:
        return Response(
            {'error': 'Professional not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
        """البحث عن المحترفين القريبين"""
        professionals = []
        
        # البحث في مواقع المستخدمين
        query = Q(
            user__user_type__in=['home_pro', 'specialist', 'crew_member'],
            is_active=True,
            privacy_level__in=['public', 'professional']
        )
        
        if prof_type:
            query &= Q(user__user_type=prof_type)
        
        user_locations = UserLocation.objects.filter(query).select_related(
            'user', 'address', 'address__city'
        )
        
        for location in user_locations:
            if location.address.latitude and location.address.longitude:
                distance = self._calculate_distance(
                    lat, lng,
                    float(location.address.latitude),
                    float(location.address.longitude)
                )
                
                if distance <= radius_km:
                    professionals.append({
                        'user_id': location.user.id,
                        'username': location.user.username,
                        'full_name': f"{location.user.first_name} {location.user.last_name}".strip(),
                        'user_type': location.user.user_type,
                        'location': ProfessionalLocationSerializer(location).data,
                        'distance_km': round(distance, 2)
                    })
        
        # ترتيب حسب المسافة
        professionals.sort(key=lambda x: x['distance_km'])
        
        return professionals
    
    def _calculate_distance(self, lat1, lon1, lat2, lon2):
        """حساب المسافة بين نقطتين بالكيلومتر"""
        lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
        
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        
        a = (math.sin(dlat/2)**2 + 
             math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2)
        c = 2 * math.asin(math.sqrt(a))
        
        return 6371 * c  # نصف قطر الأرض بالكيلومتر
