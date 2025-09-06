from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'authentication'

urlpatterns = [
    # Authentication endpoints
    path('register/', views.UserRegistrationView.as_view(), name='register'),
    path('login/', views.UserLoginView.as_view(), name='login'),
    path('logout/', views.UserLogoutView.as_view(), name='logout'),
    path('refresh/', views.TokenRefreshView.as_view(), name='token_refresh'),
    path('verify-email/', views.EmailVerificationView.as_view(), name='verify_email'),
    path('resend-verification/', views.ResendVerificationView.as_view(), name='resend_verification'),
    
    # Password management
    path('password/change/', views.PasswordChangeView.as_view(), name='password_change'),
    path('password/reset/', views.PasswordResetView.as_view(), name='password_reset'),
    
    # User profile
    path('user/', views.UserProfileView.as_view(), name='user_profile'),
    path('user/update/', views.UserUpdateView.as_view(), name='user_update'),
    path('user/stats/', views.UserStatsView.as_view(), name='user_stats'),
    path('user/profile/', views.UserProfileDetailView.as_view(), name='user_profile_detail'),
    path('user/toggle-availability/', views.toggle_availability, name='toggle_availability'),
    
    # Users listing
    path('users/', views.UserListView.as_view(), name='user_list'),
    path('users/<int:id>/', views.UserDetailView.as_view(), name='user_detail'),
    path('users/search/', views.user_search, name='user_search'),
    
    # Professionals
    path('professionals/', views.ProfessionalListView.as_view(), name='professional_list'),
    path('professionals/<int:id>/', views.PublicProfessionalDetailView.as_view(), name='public_professional_detail'),
    path('professionals/<int:professional_id>/stats/', views.PublicProfessionalStatsView.as_view(), name='public_professional_stats'),
]