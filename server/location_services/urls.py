from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CountryViewSet, CityViewSet, AddressViewSet,
    UserLocationViewSet, ServiceAreaViewSet,
    LocationHistoryViewSet, LocationPermissionViewSet,
    LocationSearchViewSet, get_public_professional_location
)

# إنشاء router للـ ViewSets
router = DefaultRouter()

# تسجيل ViewSets
router.register(r'countries', CountryViewSet, basename='country')
router.register(r'cities', CityViewSet, basename='city')
router.register(r'addresses', AddressViewSet, basename='address')
router.register(r'user-locations', UserLocationViewSet, basename='user-location')
router.register(r'service-areas', ServiceAreaViewSet, basename='service-area')
router.register(r'location-history', LocationHistoryViewSet, basename='location-history')
router.register(r'location-permissions', LocationPermissionViewSet, basename='location-permission')
router.register(r'search', LocationSearchViewSet, basename='location-search')

app_name = 'location_services'

urlpatterns = [
    # تضمين جميع URLs الخاصة بالـ router
    path('api/v1/locations/', include(router.urls)),
    
    # Public professional location endpoint
    path('api/v1/locations/professionals/<int:professional_id>/', get_public_professional_location, name='public_professional_location'),
]