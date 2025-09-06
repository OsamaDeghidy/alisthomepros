from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings
from django.db.models import Q
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from drf_spectacular.utils import extend_schema, OpenApiParameter, extend_schema_field
from drf_spectacular.types import OpenApiTypes
from .models import User, UserProfile, EmailVerificationToken, EmailDeliveryLog
from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    UserDetailSerializer,
    UserUpdateSerializer,
    UserListSerializer,
    ProfessionalListSerializer,
    PasswordChangeSerializer,
    PasswordResetSerializer,
    UserStatsSerializer,
    UserProfileSerializer,
)
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from .sendgrid_service import sendgrid_service

User = get_user_model()


class UserRegistrationView(generics.CreateAPIView):
    """
    User Registration
    """
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]
    
    # CORS headers are now handled by corsheaders middleware
    # Removed manual CORS handling to prevent duplicate headers
    
    @extend_schema(
        operation_id="register_user",
        summary="Create New Account",
        description="Register a new user on the platform",
        tags=["Authentication"],
    )
    def post(self, request, *args, **kwargs):
        print(f"🔐 Registration attempt - Data: {request.data}")
        print(f"🔐 Registration attempt - Headers: {request.headers}")
        
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            print(f"✅ Registration data is valid")
            user = serializer.save()
            print(f"✅ User created successfully: {user.username} ({user.email})")
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            
            # Send verification email with welcome message
            try:
                send_verification_email(user)
                print(f"📧 Verification email sent to {user.email}")
            except Exception as e:
                print(f"❌ Failed to send verification email: {str(e)}")
                # Don't fail registration if email sending fails
            
            try:
                print(f"🔑 Generating JWT tokens for {user.email}")
                # Generate JWT tokens
                refresh = RefreshToken.for_user(user)
                print(f"✅ JWT tokens generated successfully")
                
                try:
                    print(f"📊 Starting user serialization for {user.email}")
                    user_data = UserDetailSerializer(user).data
                    print(f"✅ User serialization successful for {user.email}")
                except Exception as e:
                    print(f"❌ User serialization failed: {str(e)}")
                    import traceback
                    print(f"❌ Serialization traceback: {traceback.format_exc()}")
                    # Return basic user data if serialization fails
                    user_data = {
                        'id': user.id,
                        'email': user.email,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                        'user_type': user.user_type
                    }
                
                print(f"📦 Creating response for {user.email}")
                response_data = {
                    'user': user_data,
                    'tokens': {
                        'access': str(refresh.access_token),
                        'refresh': str(refresh)
                    },
                    'message': 'Account created successfully! Welcome to Alist Home Pros. You can now access your profile and start using our services.',
                    'success': True,
                    'redirect_to': '/profile'
                }
                print(f"✅ Response created successfully for {user.email}")
                
                response = Response(response_data, status=status.HTTP_201_CREATED)
                
                # CORS headers are now handled by corsheaders middleware
                # Removed manual CORS handling to prevent duplicate headers
                
                return response
                
            except Exception as e:
                print(f"❌ Critical error in registration response: {str(e)}")
                import traceback
                print(f"❌ Full traceback: {traceback.format_exc()}")
                return Response({
                    'error': 'Registration completed but response failed',
                    'message': 'Your account was created successfully, but there was an issue with the response. Please try logging in.',
                    'user_id': user.id
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        print(f"❌ Registration failed - Errors: {serializer.errors}")
        print(f"❌ Registration failed - Data received: {request.data}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(APIView):
    """
    User Login
    """
    permission_classes = [AllowAny]
    serializer_class = UserLoginSerializer
    
    @extend_schema(
        operation_id="login_user",
        summary="User Login",
        description="Login for registered users",
        tags=["Authentication"],
        request=UserLoginSerializer,
        responses={
            200: UserDetailSerializer,
            400: "Invalid credentials"
        }
    )
    def post(self, request):
        print(f"🔐 Login attempt - Data: {request.data}")
        print(f"🔐 Login attempt - Headers: {request.headers}")
        print(f"🔐 Login attempt - Method: {request.method}")
        print(f"🔐 Login attempt - Content-Type: {request.content_type}")
        print(f"🔐 Login attempt - URL: {request.build_absolute_uri()}")
        print(f"🔐 Login attempt - User: {request.user}")
        print(f"🔐 Login attempt - Data: {request.data}")
        
        serializer = UserLoginSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.validated_data['user']
            print(f"✅ Login successful for user: {user.email}")
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)
            
            print(f"✅ Generated refresh token: {refresh_token[:50]}...")
            print(f"✅ Generated access token: {access_token[:50]}...")
            
            # Update last activity
            user.last_activity = timezone.now()
            user.save(update_fields=['last_activity'])
            
            response_data = {
                'user': UserDetailSerializer(user).data,
                'tokens': {
                    'access': access_token,
                    'refresh': refresh_token
                },
                'message': 'Login successful'
            }
            print(f"✅ Returning response with keys: {list(response_data.keys())}")
            print(f"✅ Token exists: {'token' in response_data}")
            print(f"✅ Refresh token exists: {'refresh_token' in response_data}")
            return Response(response_data, status=status.HTTP_200_OK)
        
        print(f"❌ Login failed - Errors: {serializer.errors}")
        print(f"❌ Login failed - Data received: {request.data}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLogoutView(APIView):
    """
    User Logout
    """
    permission_classes = [IsAuthenticated]
    serializer_class = UserLoginSerializer  # Adding for schema generation
    
    @extend_schema(
        operation_id="logout_user",
        summary="User Logout",
        description="Logout current user and invalidate tokens",
        tags=["Authentication"],
    )
    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            
            return Response({
                'message': 'Logout successful'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'error': 'Invalid token'
            }, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    User Profile Management
    """
    serializer_class = UserDetailSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    @extend_schema(
        operation_id="get_user_profile",
        summary="Get User Profile",
        description="Get current user's profile data",
        tags=["User Profile"],
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
    
    @extend_schema(
        operation_id="update_user_profile",
        summary="Update User Profile",
        description="Update current user's profile data",
        tags=["User Profile"],
    )
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)
    
    def patch(self, request, *args, **kwargs):
        import logging
        logger = logging.getLogger(__name__)
        
        # Log the raw request data
        logger.info(f"🔍 UserProfileView PATCH - Raw request data: {request.data}")
        logger.info(f"🔍 UserProfileView PATCH - Content type: {request.content_type}")
        logger.info(f"🔍 UserProfileView PATCH - User: {request.user.id}")
        
        try:
            response = super().patch(request, *args, **kwargs)
            logger.info(f"✅ UserProfileView PATCH - Success: {response.status_code}")
            return response
        except Exception as e:
            logger.error(f"❌ UserProfileView PATCH - Error: {str(e)}")
            logger.error(f"❌ UserProfileView PATCH - Exception type: {type(e).__name__}")
            raise


class UserUpdateView(generics.UpdateAPIView):
    """
    User Data Update
    """
    serializer_class = UserUpdateSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    @extend_schema(
        operation_id="update_user",
        summary="Update User Data",
        description="Update user's personal information",
        tags=["User Profile"],
    )
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)


class UserListView(generics.ListAPIView):
    """
    Users List
    """
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserListSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['user_type', 'is_verified', 'location']
    search_fields = ['first_name', 'last_name', 'company_name', 'skills']
    ordering_fields = ['rating_average', 'created_at', 'projects_completed']
    ordering = ['-rating_average']
    
    @extend_schema(
        operation_id="list_users",
        summary="List Users",
        description="Get list of all active users",
        tags=["Users"],
        parameters=[
            OpenApiParameter(
                name="user_type",
                description="User type filter",
                required=False,
                type=OpenApiTypes.STR,
                enum=['client', 'home_pro', 'specialist', 'crew_member']
            ),
            OpenApiParameter(
                name="is_verified", 
                description="Verified status filter",
                required=False,
                type=OpenApiTypes.BOOL
            ),
            OpenApiParameter(
                name="location",
                description="Location filter",
                required=False,
                type=OpenApiTypes.STR
            ),
            OpenApiParameter(
                name="search",
                description="Search in name, company or skills",
                required=False,
                type=OpenApiTypes.STR
            ),
            OpenApiParameter(
                name="ordering",
                description="Sort results",
                required=False,
                type=OpenApiTypes.STR,
                enum=['rating_average', '-rating_average', 'created_at', '-created_at']
            )
        ]
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class ProfessionalListView(generics.ListAPIView):
    """
    Professionals List with Advanced Filtering
    """
    serializer_class = ProfessionalListSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['user_type', 'is_verified', 'location', 'is_available']
    search_fields = ['first_name', 'last_name', 'company_name', 'skills', 'bio']
    ordering_fields = ['rating_average', 'hourly_rate', 'projects_completed', 'created_at']
    ordering = ['-rating_average']
    
    def get_queryset(self):
        """Get only professional users with advanced filtering"""
        queryset = User.objects.filter(
            is_active=True,
            user_type__in=['home_pro', 'specialist', 'crew_member']
        ).select_related('profile')
        
        # Custom filters from query parameters
        min_rating = self.request.query_params.get('min_rating')
        max_rating = self.request.query_params.get('max_rating')
        min_hourly_rate = self.request.query_params.get('min_hourly_rate')
        max_hourly_rate = self.request.query_params.get('max_hourly_rate')
        min_experience = self.request.query_params.get('min_experience')
        max_experience = self.request.query_params.get('max_experience')
        skills = self.request.query_params.get('skills')
        category = self.request.query_params.get('category')
        
        # Rating filters
        if min_rating:
            try:
                queryset = queryset.filter(rating_average__gte=float(min_rating))
            except ValueError:
                pass
                
        if max_rating:
            try:
                queryset = queryset.filter(rating_average__lte=float(max_rating))
            except ValueError:
                pass
        
        # Hourly rate filters
        if min_hourly_rate:
            try:
                queryset = queryset.filter(hourly_rate__gte=float(min_hourly_rate))
            except ValueError:
                pass
                
        if max_hourly_rate:
            try:
                queryset = queryset.filter(hourly_rate__lte=float(max_hourly_rate))
            except ValueError:
                pass
        
        # Experience filters
        if min_experience:
            try:
                queryset = queryset.filter(experience_years__gte=int(min_experience))
            except ValueError:
                pass
                
        if max_experience:
            try:
                queryset = queryset.filter(experience_years__lte=int(max_experience))
            except ValueError:
                pass
        
        # Skills filter (JSON field search)
        if skills:
            skills_list = [skill.strip() for skill in skills.split(',')]
            for skill in skills_list:
                queryset = queryset.filter(skills__icontains=skill)
        
        # Category filter (could be based on skills or user_type)
        if category:
            if category in ['home_pro', 'specialist', 'crew_member']:
                queryset = queryset.filter(user_type=category)
            else:
                # Search in skills for category
                queryset = queryset.filter(skills__icontains=category)
        
        return queryset
    
    @extend_schema(
        operation_id="list_professionals",
        summary="List Professionals",
        description="Get list of all available professionals with advanced filtering",
        tags=["Users"],
        parameters=[
            OpenApiParameter(
                name="user_type",
                description="Professional type",
                required=False,
                type=OpenApiTypes.STR,
                enum=['home_pro', 'specialist', 'crew_member']
            ),
            OpenApiParameter(
                name="is_verified",
                description="Verified status filter",
                required=False,
                type=OpenApiTypes.BOOL
            ),
            OpenApiParameter(
                name="is_available",
                description="Availability filter",
                required=False,
                type=OpenApiTypes.BOOL
            ),
            OpenApiParameter(
                name="location",
                description="Location filter",
                required=False,
                type=OpenApiTypes.STR
            ),
            OpenApiParameter(
                name="search",
                description="Search in name, company, bio or skills",
                required=False,
                type=OpenApiTypes.STR
            ),
            OpenApiParameter(
                name="min_rating",
                description="Minimum rating filter",
                required=False,
                type=OpenApiTypes.NUMBER
            ),
            OpenApiParameter(
                name="max_rating",
                description="Maximum rating filter",
                required=False,
                type=OpenApiTypes.NUMBER
            ),
            OpenApiParameter(
                name="min_hourly_rate",
                description="Minimum hourly rate filter",
                required=False,
                type=OpenApiTypes.NUMBER
            ),
            OpenApiParameter(
                name="max_hourly_rate",
                description="Maximum hourly rate filter",
                required=False,
                type=OpenApiTypes.NUMBER
            ),
            OpenApiParameter(
                name="min_experience",
                description="Minimum experience years",
                required=False,
                type=OpenApiTypes.INT
            ),
            OpenApiParameter(
                name="max_experience",
                description="Maximum experience years",
                required=False,
                type=OpenApiTypes.INT
            ),
            OpenApiParameter(
                name="skills",
                description="Skills filter (comma-separated)",
                required=False,
                type=OpenApiTypes.STR
            ),
            OpenApiParameter(
                name="category",
                description="Category/specialization filter",
                required=False,
                type=OpenApiTypes.STR
            ),
            OpenApiParameter(
                name="ordering",
                description="Sort results",
                required=False,
                type=OpenApiTypes.STR,
                enum=['rating_average', '-rating_average', 'hourly_rate', '-hourly_rate', 'projects_completed', '-projects_completed', 'created_at', '-created_at']
            )
        ]
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class UserDetailView(generics.RetrieveAPIView):
    """
    User Details
    """
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserDetailSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'
    
    @extend_schema(
        operation_id="get_user_detail",
        summary="Get User Details",
        description="Get detailed information about a specific user",
        tags=["Users"],
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class PublicProfessionalDetailView(generics.RetrieveAPIView):
    """
    Public Professional Details - No authentication required
    """
    queryset = User.objects.filter(
        is_active=True,
        user_type__in=['home_pro', 'specialist', 'crew_member']
    )
    serializer_class = ProfessionalListSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'
    
    @extend_schema(
        operation_id="get_public_professional_detail",
        summary="Get Public Professional Details",
        description="Get detailed information about a specific professional (public access)",
        tags=["Users"],
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class PublicProfessionalStatsView(APIView):
    """
    Public Professional Statistics - No authentication required
    """
    permission_classes = [AllowAny]
    
    @extend_schema(
        operation_id="get_public_professional_stats",
        summary="Get Public Professional Statistics",
        description="Get professional's public statistics (no authentication required)",
        tags=["Users"],
    )
    def get(self, request, professional_id):
        try:
            user = User.objects.get(
                id=professional_id,
                is_active=True,
                user_type__in=['home_pro', 'specialist', 'crew_member']
            )
            
            return Response({
                'stats': {
                    'projects_completed': user.projects_completed,
                    'rating_average': user.rating_average,
                    'rating_count': user.rating_count,
                    'total_earnings': getattr(user, 'total_earnings', 0),
                    'completion_rate': getattr(user, 'completion_rate', 0),
                    'response_time': getattr(user, 'response_time', 'Not Specified'),
                },
                'additional_stats': {
                    'profile_completion': user.get_completion_rate() if hasattr(user, 'get_completion_rate') else 85,
                    'verification_badges': user.get_verification_badge() if hasattr(user, 'get_verification_badge') else [],
                    'account_age_days': (timezone.now() - user.created_at).days,
                    'is_professional': user.is_professional() if hasattr(user, 'is_professional') else True,
                    'can_post_projects': user.can_post_projects() if hasattr(user, 'can_post_projects') else False,
                    'can_bid_on_projects': user.can_bid_on_projects() if hasattr(user, 'can_bid_on_projects') else True,
                }
            }, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            return Response(
                {'error': 'Professional not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )


class PasswordChangeView(APIView):
    """
    تغيير كلمة المرور
    """
    permission_classes = [IsAuthenticated]
    serializer_class = PasswordChangeSerializer
    
    @extend_schema(
        operation_id="change_password",
        summary="Change Password",
        description="Change user password",
        tags=["Authentication"],
        request=PasswordChangeSerializer,
    )
    def post(self, request):
        serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            
            return Response({
                'message': 'Password changed successfully'
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetView(APIView):
    """
    إعادة تعيين كلمة المرور
    """
    permission_classes = [AllowAny]
    serializer_class = PasswordResetSerializer
    
    @extend_schema(
        operation_id="reset_password",
        summary="Reset Password",
        description="Request password reset via email",
        tags=["Authentication"],
        request=PasswordResetSerializer,
    )
    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            user = User.objects.get(email=email)
            
            # Generate reset token
            refresh = RefreshToken.for_user(user)
            reset_token = str(refresh.access_token)
            
            # Send reset email
            try:
                send_mail(
                    subject='Password Reset Request',
                    message=f'Your password reset token: {reset_token}',
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[email],
                    fail_silently=False,
                )
                
                return Response({
                    'message': 'Password reset email sent successfully'
                }, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({
                    'error': 'Failed to send reset email'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserStatsView(APIView):
    """
    إحصائيات المستخدم
    """
    permission_classes = [IsAuthenticated]
    serializer_class = UserStatsSerializer
    
    @extend_schema(
        operation_id="get_user_stats",
        summary="Get User Statistics",
        description="Get current user's profile statistics",
        tags=["User Profile"],
    )
    def get(self, request):
        user = request.user
        serializer = UserStatsSerializer(user)
        
        return Response({
            'stats': serializer.data,
            'additional_stats': {
                'profile_completion': user.get_completion_rate(),
                'verification_badges': user.get_verification_badge(),
                'account_age_days': (timezone.now() - user.created_at).days,
                'is_professional': user.is_professional(),
                'can_post_projects': user.can_post_projects(),
                'can_bid_on_projects': user.can_bid_on_projects(),
            }
        }, status=status.HTTP_200_OK)


class UserProfileDetailView(generics.RetrieveUpdateAPIView):
    """
    User Profile Details
    """
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        return profile
    
    @extend_schema(
        operation_id="get_user_profile_detail",
        summary="Get User Profile Details",
        description="Get detailed user profile information",
        tags=["User Profile"],
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
    
    @extend_schema(
        operation_id="update_user_profile_detail",
        summary="Update User Profile Details",
        description="Update detailed user profile information",
        tags=["User Profile"],
    )
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)


@extend_schema(
    operation_id="toggle_availability",
    summary="Change Availability Status",
    description="Change current user's availability status",
    tags=["User Profile"],
    request={
        'type': 'object',
        'properties': {}
    },
    responses={200: {
        'type': 'object',
        'properties': {
            'is_available': {'type': 'boolean'},
            'message': {'type': 'string'}
        }
    }}
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_availability(request):
    """
    تغيير حالة التوفر
    """
    user = request.user
    user.is_available = not user.is_available
    user.save(update_fields=['is_available'])
    
    return Response({
        'is_available': user.is_available,
        'message': f'Availability set to {"available" if user.is_available else "unavailable"}'
    }, status=status.HTTP_200_OK)


@extend_schema(
    operation_id="user_search",
    summary="Search Users",
    description="Search users by name, company, or skills",
    tags=["Users"],
    parameters=[
        OpenApiParameter(
            name="q",
            description="Search query",
            required=True,
            type=OpenApiTypes.STR
        ),
        OpenApiParameter(
            name="type",
            description="User type filter",
            required=False,
            type=OpenApiTypes.STR,
            enum=['client', 'home_pro', 'specialist', 'crew_member']
        ),
    ],
    responses={200: UserListSerializer(many=True)}
)
@api_view(['GET'])
@permission_classes([AllowAny])
def user_search(request):
    """
    البحث في المستخدمين
    """
    query = request.GET.get('q', '')
    user_type = request.GET.get('type', '')
    
    if not query:
        return Response({'error': 'Query parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Build search query
    search_query = Q(is_active=True) & (
        Q(first_name__icontains=query) |
        Q(last_name__icontains=query) |
        Q(company_name__icontains=query) |
        Q(skills__icontains=query)
    )
    
    if user_type:
        search_query &= Q(user_type=user_type)
    
    users = User.objects.filter(search_query)[:20]  # Limit results
    
    serializer = UserListSerializer(users, many=True)
    return Response({
        'results': serializer.data,
        'count': users.count()
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@extend_schema(
    operation_id="get_user_favorites",
    summary="Get User Favorites",
    description="Get current user's favorite projects",
    tags=["User Profile"],
    responses={200: {"type": "array", "items": {"type": "object"}}}
)
def user_favorites(request):
    """Get user's favorite projects"""
    user = request.user
    favorites = user.favorite_projects.all()
    
    favorites_data = []
    for project in favorites:
        favorites_data.append({
            'id': project.id,
            'title': project.title,
            'description': project.description,
            'budget_min': project.budget_min,
            'budget_max': project.budget_max,
            'location': project.location,
            'created_at': project.created_at,
            'status': project.status
        })
    
    return Response(favorites_data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@extend_schema(
    operation_id="get_user_stats",
    summary="Get User Statistics",
    description="Get current user's profile statistics",
    tags=["User Profile"],
    responses={200: {"type": "object"}}
)
def user_stats(request):
    """Get user statistics"""
    user = request.user
    
    stats = {
        'total_projects': user.projects_completed,
        'active_projects': user.client_projects.filter(status='active').count(),
        'total_reviews': user.received_reviews.count(),
        'average_rating': user.rating_average,
        'total_earnings': getattr(user, 'total_earnings', 0),
        'profile_completion': calculate_profile_completion(user)
    }
    
    return Response(stats)


def calculate_profile_completion(user):
    """Calculate profile completion percentage"""
    fields = [
        user.first_name, user.last_name, user.email, user.phone,
        user.location, user.bio
    ]
    
    profile_fields = []
    if hasattr(user, 'profile'):
        profile_fields = [
            user.profile.date_of_birth,
            user.profile.address,
            user.profile.emergency_contact
        ]
    
    all_fields = fields + profile_fields
    completed_fields = [field for field in all_fields if field]
    
    return int((len(completed_fields) / len(all_fields)) * 100) if all_fields else 0


class UserProfileDetailView(generics.RetrieveAPIView):
    """
    User Profile Details
    """
    serializer_class = UserDetailSerializer
    permission_classes = [IsAuthenticated]
    
    @extend_schema(
        operation_id="get_user_profile_detail",
        summary="Get User Profile Details",
        description="Get detailed user profile information",
        tags=["User Profile"],
    )
    def get(self, request, *args, **kwargs):
        try:
            profile = request.user.profile
            serializer = self.get_serializer(profile)
            return Response(serializer.data)
        except UserProfile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=404)

    @extend_schema(
        operation_id="update_user_profile_detail",
        summary="Update User Profile Details",
        description="Update detailed user profile information",
        tags=["User Profile"],
    )
    def patch(self, request, *args, **kwargs):
        try:
            profile = request.user.profile
            serializer = self.get_serializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)
        except UserProfile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=404)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@extend_schema(
    operation_id="change_password",
    summary="Change Password",
    description="Change user password",
    tags=["Authentication"],
    request={
        "type": "object",
        "properties": {
            "old_password": {"type": "string"},
            "new_password": {"type": "string"},
            "confirm_password": {"type": "string"}
        }
    }
)
def change_password(request):
    """Change user password"""
    user = request.user
    data = request.data
    
    old_password = data.get('old_password')
    new_password = data.get('new_password')
    confirm_password = data.get('confirm_password')
    
    if not user.check_password(old_password):
        return Response({'error': 'Invalid old password'}, status=400)
    
    if new_password != confirm_password:
        return Response({'error': 'Passwords do not match'}, status=400)
    
    if len(new_password) < 8:
        return Response({'error': 'Password must be at least 8 characters'}, status=400)
    
    user.set_password(new_password)
    user.save()
    
    return Response({'message': 'Password changed successfully'})


@api_view(['POST'])
@permission_classes([AllowAny])
@extend_schema(
    operation_id="forgot_password",
    summary="Forgot Password",
    description="Send password reset email",
    tags=["Authentication"],
    request={
        "type": "object", 
        "properties": {
            "email": {"type": "string"}
        }
    }
)
def forgot_password(request):
    """Send password reset email"""
    email = request.data.get('email')
    
    try:
        user = User.objects.get(email=email, is_active=True)
        # Here you would typically send a password reset email
        # For now, we'll just return a success message
        return Response({'message': 'Password reset email sent'})
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)


class TokenRefreshView(APIView):
    """
    Refresh JWT Token
    """
    permission_classes = [AllowAny]
    
    @extend_schema(
        operation_id="refresh_token",
        summary="Refresh Token",
        description="Refresh JWT access token using refresh token",
        tags=["Authentication"],
        request={
            "type": "object",
            "properties": {
                "refresh": {"type": "string"}
            }
        },
        responses={
            200: {
                "type": "object",
                "properties": {
                    "access": {"type": "string"}
                }
            },
            400: "Invalid refresh token"
        }
    )
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if not refresh_token:
                return Response(
                    {'error': 'Refresh token is required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Validate and refresh token
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)
            
            return Response({
                'access': access_token
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': 'Invalid refresh token'}, 
                status=status.HTTP_400_BAD_REQUEST
            )


def send_verification_email(user):
    """
    Send email verification link with welcome message to user using SendGrid
    """
    try:
        # Create verification token
        verification_token = EmailVerificationToken.objects.create(user=user)
        
        # Use SendGrid service to send verification email
        email_log = sendgrid_service.send_verification_email(user, verification_token)
        
        if email_log and email_log.status == 'sent':
            print(f"Verification email sent successfully to {user.email} via SendGrid")
            return True
        else:
            print(f"Failed to send verification email to {user.email} via SendGrid")
            return False
        
    except Exception as e:
        print(f"Exception while sending verification email to {user.email}: {str(e)}")
        return False


class EmailVerificationView(APIView):
    """
    API endpoint to verify user email using verification token
    """
    permission_classes = [AllowAny]
    
    @extend_schema(
        operation_id="verify_email",
        summary="Verify Email Address",
        description="Verify user's email address using verification token",
        tags=["Authentication"],
        request={
            "type": "object",
            "properties": {
                "token": {"type": "string", "description": "Email verification token"}
            },
            "required": ["token"]
        },
        responses={
            200: {
                "type": "object",
                "properties": {
                    "message": {"type": "string"},
                    "email_verified": {"type": "boolean"}
                }
            },
            400: "Invalid or expired token"
        }
    )
    def post(self, request):
        token = request.data.get('token')
        
        if not token:
            return Response(
                {'error': 'Verification token is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Find the verification token
            verification_token = EmailVerificationToken.objects.get(
                token=token,
                is_used=False
            )
            
            # Check if token is expired
            if not verification_token.is_valid():
                return Response(
                    {'error': 'Verification token has expired'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Mark user as email verified
            user = verification_token.user
            user.email_verified = True
            user.is_verified = True
            user.save()
            
            # Mark token as used
            verification_token.is_used = True
            verification_token.save()
            
            print(f"Email verified successfully for user: {user.email}")
            
            return Response({
                'success': True,
                'message': 'Email verified successfully',
                'email_verified': True
            }, status=status.HTTP_200_OK)
            
        except EmailVerificationToken.DoesNotExist:
            return Response(
                {'error': 'Invalid verification token'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            print(f"Email verification error: {str(e)}")
            return Response(
                {'error': 'An error occurred during verification'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ResendVerificationView(APIView):
    """
    API endpoint to resend email verification link
    """
    permission_classes = [AllowAny]
    
    @extend_schema(
        operation_id="resend_verification",
        summary="Resend Email Verification",
        description="Resend email verification link to user",
        tags=["Authentication"],
        request={
            "type": "object",
            "properties": {
                "email": {"type": "string", "description": "User email address"}
            },
            "required": ["email"]
        },
        responses={
            200: {
                "type": "object",
                "properties": {
                    "message": {"type": "string"},
                    "email_sent": {"type": "boolean"}
                }
            },
            400: "Invalid email or user not found",
            429: "Too many requests - rate limited"
        }
    )
    def post(self, request):
        email = request.data.get('email')
        
        if not email:
            return Response(
                {'error': 'Email address is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Find user by email
            user = User.objects.get(email=email, is_active=True)
            
            # Check if user is already verified
            if user.email_verified:
                return Response(
                    {'message': 'Email is already verified'}, 
                    status=status.HTTP_200_OK
                )
            
            # Check rate limiting - allow max 3 attempts per hour
            one_hour_ago = timezone.now() - timezone.timedelta(hours=1)
            recent_logs = EmailDeliveryLog.objects.filter(
                user=user,
                email_type='verification',
                created_at__gte=one_hour_ago
            ).count()
            
            if recent_logs >= 3:
                return Response(
                    {'error': 'Too many verification emails sent. Please wait before requesting another.'}, 
                    status=status.HTTP_429_TOO_MANY_REQUESTS
                )
            
            # Deactivate any existing unused tokens
            EmailVerificationToken.objects.filter(
                user=user,
                is_used=False
            ).update(is_used=True)
            
            # Send new verification email
            email_sent = send_verification_email(user)
            
            if email_sent:
                return Response({
                    'success': True,
                    'message': 'Verification email sent successfully',
                    'email_sent': True
                }, status=status.HTTP_200_OK)
            else:
                return Response(
                    {'error': 'Failed to send verification email. Please try again later.'}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
                
        except User.DoesNotExist:
            # Don't reveal if email exists or not for security
            return Response({
                'success': True,
                'message': 'If the email exists, a verification link has been sent',
                'email_sent': True
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"Resend verification error: {str(e)}")
            return Response(
                {'error': 'An error occurred while sending verification email'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
