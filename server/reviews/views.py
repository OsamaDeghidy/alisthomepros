from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied
from django.db.models import Avg, Count, Q, Max
from django.utils import timezone
from django.contrib.auth import get_user_model
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from datetime import datetime, timedelta
from .models import Review
from contracts.models import Contract
from .serializers import (
    ReviewSerializer, ReviewCreateSerializer, ReviewUpdateSerializer,
    ReviewListSerializer, ProfessionalReviewsSerializer, ClientReviewsSerializer,
    ReviewStatsSerializer, ReviewSummarySerializer, ReviewFilterSerializer, 
    ReviewReportSerializer
)

User = get_user_model()


class ReviewListView(generics.ListAPIView):
    """List all reviews"""
    serializer_class = ReviewListSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['reviewee', 'reviewer', 'review_type', 'rating']
    search_fields = ['comment', 'reviewee__first_name', 'reviewee__last_name', 'reviewer__first_name', 'reviewer__last_name']
    ordering_fields = ['rating', 'created_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Get reviews with optimized queries"""
        queryset = Review.objects.select_related(
            'reviewer', 'reviewee', 'project', 'contract'
        ).all()
        
        # Apply additional filters
        reviewee_id = self.request.query_params.get('reviewee_id')
        if reviewee_id:
            queryset = queryset.filter(reviewee_id=reviewee_id)
        
        reviewer_id = self.request.query_params.get('reviewer_id')
        if reviewer_id:
            queryset = queryset.filter(reviewer_id=reviewer_id)
        
        review_type = self.request.query_params.get('review_type')
        if review_type:
            queryset = queryset.filter(review_type=review_type)
        
        rating_min = self.request.query_params.get('rating_min')
        if rating_min:
            queryset = queryset.filter(rating__gte=rating_min)
        
        rating_max = self.request.query_params.get('rating_max')
        if rating_max:
            queryset = queryset.filter(rating__lte=rating_max)
        
        return queryset
    
    @extend_schema(
        operation_id="list_reviews",
        summary="List Reviews",
        description="Get reviews list with filtering and search",
        tags=["Reviews"],
        parameters=[
            OpenApiParameter(
                name="professional_id",
                description="معرف المحترف",
                required=False,
                type=OpenApiTypes.INT
            ),
            OpenApiParameter(
                name="rating",
                description="التقييم",
                required=False,
                type=OpenApiTypes.INT,
                enum=[1, 2, 3, 4, 5]
            ),
            OpenApiParameter(
                name="rating_min",
                description="الحد الأدنى للتقييم",
                required=False,
                type=OpenApiTypes.INT
            ),
            OpenApiParameter(
                name="rating_max",
                description="الحد الأقصى للتقييم",
                required=False,
                type=OpenApiTypes.INT
            ),
            OpenApiParameter(
                name="search",
                description="البحث في التعليقات",
                required=False,
                type=OpenApiTypes.STR
            ),
        ]
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class ReviewDetailView(generics.RetrieveAPIView):
    """تفاصيل التقييم"""
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = Review.objects.select_related('professional', 'client', 'project')
    
    @extend_schema(
        operation_id="get_review_detail",
        summary="Review Details",
        description="Get specific review details",
        tags=["Reviews"],
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class ReviewCreateView(generics.CreateAPIView):
    """إنشاء تقييم جديد"""
    serializer_class = ReviewCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        # Both clients and home professionals can create reviews
        if self.request.user.user_type not in ['client', 'home_pro']:
            raise PermissionDenied("Only clients and home professionals can create reviews")
        
        serializer.save()
    
    @extend_schema(
        operation_id="create_review",
        summary="Create New Review",
        description="Create new review for professional (clients only)",
        tags=["Reviews"],
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class ReviewUpdateView(generics.UpdateAPIView):
    """تحديث التقييم"""
    serializer_class = ReviewUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Only review author can update
        return Review.objects.filter(client=self.request.user)
    
    def update(self, request, *args, **kwargs):
        # Only allow updating within 24 hours
        instance = self.get_object()
        time_diff = timezone.now() - instance.created_at
        
        if time_diff.total_seconds() > 86400:  # 24 hours
            return Response({
                'error': 'Reviews can only be updated within 24 hours of creation'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        return super().update(request, *args, **kwargs)
    
    @extend_schema(
        operation_id="update_review",
        summary="Update Review",
        description="Update review (within 24 hours of creation)",
        tags=["Reviews"],
    )
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)
    
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)


class ReviewDeleteView(generics.DestroyAPIView):
    """حذف التقييم"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Only review author can delete
        return Review.objects.filter(client=self.request.user)
    
    def destroy(self, request, *args, **kwargs):
        # Only allow deleting within 24 hours
        instance = self.get_object()
        time_diff = timezone.now() - instance.created_at
        
        if time_diff.total_seconds() > 86400:  # 24 hours
            return Response({
                'error': 'Reviews can only be deleted within 24 hours of creation'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Update professional's rating after deletion
        professional = instance.professional
        self.perform_destroy(instance)
        
        # Recalculate professional's rating
        all_reviews = Review.objects.filter(reviewee=professional)
        avg_rating = all_reviews.aggregate(avg=Avg('rating'))['avg']
        professional.rating_average = avg_rating or 0
        professional.rating_count = all_reviews.count()
        professional.save(update_fields=['rating_average', 'rating_count'])
        
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @extend_schema(
        operation_id="delete_review",
        summary="Delete Review",
        description="Delete review (within 24 hours of creation)",
        tags=["Reviews"],
    )
    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)


class ProfessionalReviewsView(generics.ListAPIView):
    """Reviews received by a specific professional"""
    serializer_class = ProfessionalReviewsSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['rating', 'review_type']
    ordering_fields = ['rating', 'created_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Get reviews for specific professional"""
        professional_id = self.kwargs.get('professional_id')
        return Review.objects.filter(
            reviewee_id=professional_id,
            review_type='client_to_professional'
        ).select_related('reviewer', 'project', 'contract')


class ClientReviewsView(generics.ListAPIView):
    """Reviews received by a specific client"""
    serializer_class = ClientReviewsSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['rating']
    ordering_fields = ['rating', 'created_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Get reviews for specific client"""
        client_id = self.kwargs.get('client_id')
        return Review.objects.filter(
            reviewee_id=client_id,
            review_type='professional_to_client'
        ).select_related('reviewer', 'project', 'contract')
    
    @extend_schema(
        operation_id="get_client_reviews",
        summary="Client Reviews",
        description="Get all reviews for a specific client",
        tags=["Reviews"],
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
    
    @extend_schema(
        operation_id="get_professional_reviews",
        summary="تقييمات المحترف",
        description="عرض جميع تقييمات محترف محدد",
        tags=["Reviews"],
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class MyReviewsView(generics.ListAPIView):
    """Current user's reviews (both given and received)"""
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['rating', 'review_type']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Get current user's reviews"""
        user = self.request.user
        review_filter = self.request.query_params.get('filter', 'all')
        
        if review_filter == 'given':
            # Reviews given by the user
            return Review.objects.filter(reviewer=user).select_related('reviewee', 'project', 'contract')
        elif review_filter == 'received':
            # Reviews received by the user
            return Review.objects.filter(reviewee=user).select_related('reviewer', 'project', 'contract')
        else:
            # All reviews (both given and received)
            return Review.objects.filter(
                Q(reviewer=user) | Q(reviewee=user)
            ).select_related('reviewer', 'reviewee', 'project', 'contract')
    
    @extend_schema(
        operation_id="get_my_reviews",
        summary="تقييماتي",
        description="عرض تقييمات المستخدم الحالي",
        tags=["Reviews"],
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticatedOrReadOnly])
def review_stats(request, professional_id):
    """إحصائيات تقييمات المحترف"""
    try:
        professional = User.objects.get(
            id=professional_id,
            user_type__in=['home_pro', 'specialist', 'crew_member']
        )
    except User.DoesNotExist:
        return Response({
            'error': 'Professional not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    reviews = Review.objects.filter(reviewee=professional)
    
    # Calculate basic stats
    total_reviews = reviews.count()
    if total_reviews == 0:
        return Response({
            'total_reviews': 0,
            'average_rating': 0,
            'rating_distribution': {},
            'average_quality': 0,
            'average_communication': 0,
            'average_timeliness': 0,
            'average_professionalism': 0,
            'recent_reviews_count': 0,
            'this_month_reviews': 0,
            'last_month_reviews': 0
        })
    
    # Rating distribution
    rating_counts = reviews.values('rating').annotate(count=Count('id'))
    rating_distribution = {str(i): 0 for i in range(1, 6)}
    for item in rating_counts:
        rating_distribution[str(item['rating'])] = item['count']
    
    # Average ratings
    averages = reviews.aggregate(
        avg_rating=Avg('rating'),
        avg_quality=Avg('quality_rating'),
        avg_communication=Avg('communication_rating'),
        avg_timeliness=Avg('timeliness_rating'),
        avg_professionalism=Avg('professionalism_rating')
    )
    
    # Recent activity
    thirty_days_ago = timezone.now() - timedelta(days=30)
    recent_reviews_count = reviews.filter(created_at__gte=thirty_days_ago).count()
    
    # This month and last month
    now = timezone.now()
    first_day_this_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    first_day_last_month = (first_day_this_month - timedelta(days=1)).replace(day=1)
    
    this_month_reviews = reviews.filter(created_at__gte=first_day_this_month).count()
    last_month_reviews = reviews.filter(
        created_at__gte=first_day_last_month,
        created_at__lt=first_day_this_month
    ).count()
    
    stats = {
        'total_reviews': total_reviews,
        'average_rating': averages['avg_rating'] or 0,
        'rating_distribution': rating_distribution,
        'average_quality': averages['avg_quality'] or 0,
        'average_communication': averages['avg_communication'] or 0,
        'average_timeliness': averages['avg_timeliness'] or 0,
        'average_professionalism': averages['avg_professionalism'] or 0,
        'recent_reviews_count': recent_reviews_count,
        'this_month_reviews': this_month_reviews,
        'last_month_reviews': last_month_reviews
    }
    
    serializer = ReviewStatsSerializer(stats)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticatedOrReadOnly])
def review_summary(request):
    """ملخص التقييمات للمحترفين"""
    # Get all professionals with reviews
    professionals = User.objects.filter(
        user_type__in=['home_pro', 'specialist', 'crew_member'],
        received_reviews__isnull=False
    ).distinct()
    
    summaries = []
    for professional in professionals:
        reviews = Review.objects.filter(reviewee=professional)
        
        if reviews.exists():
            total_reviews = reviews.count()
            avg_rating = reviews.aggregate(avg=Avg('rating'))['avg']
            latest_review = reviews.aggregate(latest=Max('created_at'))['latest']
            
            # Calculate star percentages
            rating_counts = reviews.values('rating').annotate(count=Count('id'))
            rating_distribution = {i: 0 for i in range(1, 6)}
            
            for item in rating_counts:
                rating_distribution[item['rating']] = item['count']
            
            summary = {
                'professional_id': professional.id,
                'professional_name': professional.get_full_name(),
                'total_reviews': total_reviews,
                'average_rating': avg_rating or 0,
                'latest_review': latest_review,
                'five_star_percentage': (rating_distribution[5] / total_reviews * 100) if total_reviews > 0 else 0,
                'four_star_percentage': (rating_distribution[4] / total_reviews * 100) if total_reviews > 0 else 0,
                'three_star_percentage': (rating_distribution[3] / total_reviews * 100) if total_reviews > 0 else 0,
                'two_star_percentage': (rating_distribution[2] / total_reviews * 100) if total_reviews > 0 else 0,
                'one_star_percentage': (rating_distribution[1] / total_reviews * 100) if total_reviews > 0 else 0,
            }
            summaries.append(summary)
    
    # Sort by average rating
    summaries.sort(key=lambda x: x['average_rating'], reverse=True)
    
    serializer = ReviewSummarySerializer(summaries, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticatedOrReadOnly])
def review_filters(request):
    """فلترة التقييمات المتقدمة"""
    serializer = ReviewFilterSerializer(data=request.query_params)
    
    if serializer.is_valid():
        data = serializer.validated_data
        
        # Start with all reviews
        queryset = Review.objects.select_related('professional', 'client', 'project')
        
        # Apply filters
        if data.get('professional_id'):
            queryset = queryset.filter(professional_id=data['professional_id'])
        
        if data.get('client_id'):
            queryset = queryset.filter(client_id=data['client_id'])
        
        if data.get('project_id'):
            queryset = queryset.filter(project_id=data['project_id'])
        
        if data.get('rating'):
            queryset = queryset.filter(rating=data['rating'])
        
        if data.get('rating_min'):
            queryset = queryset.filter(rating__gte=data['rating_min'])
        
        if data.get('rating_max'):
            queryset = queryset.filter(rating__lte=data['rating_max'])
        
        if data.get('date_from'):
            queryset = queryset.filter(created_at__date__gte=data['date_from'])
        
        if data.get('date_to'):
            queryset = queryset.filter(created_at__date__lte=data['date_to'])
        
        if data.get('has_comment') is not None:
            if data['has_comment']:
                queryset = queryset.exclude(comment__isnull=True).exclude(comment__exact='')
            else:
                queryset = queryset.filter(Q(comment__isnull=True) | Q(comment__exact=''))
        
        # Order by creation date
        queryset = queryset.order_by('-created_at')
        
        # Paginate results
        from rest_framework.pagination import PageNumberPagination
        paginator = PageNumberPagination()
        paginator.page_size = 20
        
        page = paginator.paginate_queryset(queryset, request)
        if page is not None:
            serializer = ReviewListSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        
        serializer = ReviewListSerializer(queryset, many=True)
        return Response(serializer.data)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def review_report(request):
    """تقرير التقييمات"""
    serializer = ReviewReportSerializer(data=request.query_params)
    
    if serializer.is_valid():
        data = serializer.validated_data
        period = data.get('period', 'month')
        professional_id = data.get('professional_id')
        
        # Calculate date range
        now = timezone.now()
        if period == 'week':
            start_date = now - timedelta(days=7)
        elif period == 'month':
            start_date = now - timedelta(days=30)
        elif period == 'quarter':
            start_date = now - timedelta(days=90)
        else:  # year
            start_date = now - timedelta(days=365)
        
        # Base queryset
        queryset = Review.objects.filter(created_at__gte=start_date)
        
        if professional_id:
            queryset = queryset.filter(professional_id=professional_id)
        
        # Generate report data
        reviews = queryset.select_related('professional', 'client', 'project')
        
        report_data = {
            'period': period,
            'date_range': {
                'start': start_date.date(),
                'end': now.date()
            },
            'total_reviews': reviews.count(),
            'average_rating': reviews.aggregate(avg=Avg('rating'))['avg'] or 0,
            'rating_distribution': {},
            'reviews': []
        }
        
        # Rating distribution
        rating_counts = reviews.values('rating').annotate(count=Count('id'))
        rating_distribution = {str(i): 0 for i in range(1, 6)}
        for item in rating_counts:
            rating_distribution[str(item['rating'])] = item['count']
        
        report_data['rating_distribution'] = rating_distribution
        
        # Include individual reviews if requested
        if data.get('include_comments', False):
            review_serializer = ReviewSerializer(reviews, many=True)
            report_data['reviews'] = review_serializer.data
        
        # Include detailed ratings if requested
        if data.get('include_detailed_ratings', True):
            detailed_averages = reviews.aggregate(
                avg_quality=Avg('quality_rating'),
                avg_communication=Avg('communication_rating'),
                avg_timeliness=Avg('timeliness_rating'),
                avg_professionalism=Avg('professionalism_rating')
            )
            report_data['detailed_averages'] = detailed_averages
        
        return Response(report_data)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticatedOrReadOnly])
def top_rated_professionals(request):
    """أفضل المحترفين تقييماً"""
    limit = int(request.query_params.get('limit', 10))
    min_reviews = int(request.query_params.get('min_reviews', 5))
    
    professionals = User.objects.filter(
        user_type__in=['home_pro', 'specialist', 'crew_member'],
        rating_count__gte=min_reviews
    ).order_by('-rating_average')[:limit]
    
    results = []
    for professional in professionals:
        recent_reviews = Review.objects.filter(
            professional=professional
        ).order_by('-created_at')[:3]
        
        result = {
            'professional': {
                'id': professional.id,
                'name': professional.get_full_name(),
                'avatar': professional.avatar.url if professional.avatar else None,
                'user_type': professional.user_type,
                'is_verified': professional.is_verified
            },
            'rating_average': professional.rating_average,
            'rating_count': professional.rating_count,
            'projects_completed': professional.projects_completed,
            'recent_reviews': ReviewListSerializer(recent_reviews, many=True).data
        }
        results.append(result)
    
    return Response(results)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def check_review_eligibility(request, contract_id):
    """
    Check if the current user can review the other party in a contract
    """
    try:
        contract = Contract.objects.get(id=contract_id)
    except Contract.DoesNotExist:
        return Response({'error': 'Contract not found'}, status=status.HTTP_404_NOT_FOUND)
    
    user = request.user
    
    # Check if contract is completed
    if contract.status != 'completed':
        return Response({
            'can_review': False,
            'reason': 'Contract is not completed yet'
        })
    
    # Determine review type and reviewee based on user role in contract
    if user == contract.client:
        review_type = 'client_to_professional'
        reviewee = contract.professional
    elif user == contract.professional:
        review_type = 'professional_to_client'
        reviewee = contract.client
    else:
        return Response({
            'can_review': False,
            'reason': 'User is not part of this contract'
        })
    
    # Check if review already exists
    existing_review = Review.objects.filter(
        contract=contract,
        reviewer=user,
        reviewee=reviewee,
        review_type=review_type
    ).exists()
    
    if existing_review:
        return Response({
            'can_review': False,
            'reason': 'Review already submitted for this contract'
        })
    
    return Response({
        'can_review': True,
        'review_type': review_type,
        'reviewee': {
            'id': reviewee.id,
            'name': reviewee.get_full_name(),
            'user_type': reviewee.user_type
        },
        'contract': {
            'id': contract.id,
            'title': contract.title,
            'contract_number': contract.contract_number
        }
    })
