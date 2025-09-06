from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.db.models import Avg
from .models import Review

User = get_user_model()


class UserBasicSerializer(serializers.ModelSerializer):
    """Serializer أساسي لبيانات المستخدم"""
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'first_name', 'last_name', 
            'avatar', 'user_type', 'is_verified'
        ]


class ReviewSerializer(serializers.ModelSerializer):
    """Main serializer for reviews"""
    reviewer = UserBasicSerializer(read_only=True)
    reviewee = UserBasicSerializer(read_only=True)
    professional = UserBasicSerializer(read_only=True)  # Backward compatibility
    client = UserBasicSerializer(read_only=True)  # Backward compatibility
    project_info = serializers.SerializerMethodField()
    contract_info = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    
    class Meta:
        model = Review
        fields = [
            'id', 'project_info', 'contract_info', 'reviewer', 'reviewee', 
            'professional', 'client', 'review_type', 'rating', 'comment',
            'quality_rating', 'communication_rating', 'timeliness_rating', 'professionalism_rating',
            'cooperation_rating', 'payment_timeliness_rating', 'clarity_rating',
            'would_recommend', 'is_public', 'helpful_count', 'average_rating',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'helpful_count']
    
    def get_project_info(self, obj):
        """Get project information"""
        if obj.project:
            return {
                'id': obj.project.id,
                'title': obj.project.title,
                'slug': obj.project.slug,
                'status': obj.project.status
            }
        return None
    
    def get_contract_info(self, obj):
        """Get contract information"""
        if obj.contract:
            return {
                'id': obj.contract.id,
                'title': obj.contract.title,
                'status': obj.contract.status
            }
        return None
    
    def get_average_rating(self, obj):
        """Calculate average of detailed ratings based on review type"""
        if obj.review_type == 'client_to_professional':
            ratings = [
                obj.quality_rating,
                obj.communication_rating,
                obj.timeliness_rating,
                obj.professionalism_rating
            ]
        else:  # professional_to_client
            ratings = [
                obj.cooperation_rating,
                obj.payment_timeliness_rating,
                obj.clarity_rating
            ]
        
        valid_ratings = [r for r in ratings if r is not None]
        return sum(valid_ratings) / len(valid_ratings) if valid_ratings else obj.rating


class ReviewCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating new reviews - supports bidirectional reviews"""
    
    class Meta:
        model = Review
        fields = [
            'project', 'contract', 'reviewee', 'review_type', 'rating', 'comment',
            'quality_rating', 'communication_rating', 'timeliness_rating', 'professionalism_rating',
            'cooperation_rating', 'payment_timeliness_rating', 'clarity_rating',
            'would_recommend', 'is_public'
        ]
    
    def validate_rating(self, value):
        """Validate rating value"""
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5")
        return value
    
    def validate_quality_rating(self, value):
        """Validate quality rating"""
        if value is not None and (value < 1 or value > 5):
            raise serializers.ValidationError("Quality rating must be between 1 and 5")
        return value
    
    def validate_communication_rating(self, value):
        """Validate communication rating"""
        if value is not None and (value < 1 or value > 5):
            raise serializers.ValidationError("Communication rating must be between 1 and 5")
        return value
    
    def validate_timeliness_rating(self, value):
        """Validate timeliness rating"""
        if value is not None and (value < 1 or value > 5):
            raise serializers.ValidationError("Timeliness rating must be between 1 and 5")
        return value
    
    def validate_professionalism_rating(self, value):
        """Validate professionalism rating"""
        if value is not None and (value < 1 or value > 5):
            raise serializers.ValidationError("Professionalism rating must be between 1 and 5")
        return value
    
    def validate_cooperation_rating(self, value):
        """Validate cooperation rating"""
        if value is not None and (value < 1 or value > 5):
            raise serializers.ValidationError("Cooperation rating must be between 1 and 5")
        return value
    
    def validate_payment_timeliness_rating(self, value):
        """Validate payment timeliness rating"""
        if value is not None and (value < 1 or value > 5):
            raise serializers.ValidationError("Payment timeliness rating must be between 1 and 5")
        return value
    
    def validate_clarity_rating(self, value):
        """Validate clarity rating"""
        if value is not None and (value < 1 or value > 5):
            raise serializers.ValidationError("Clarity rating must be between 1 and 5")
        return value
    
    def validate_project(self, value):
        """Validate project"""
        if value.status != 'completed':
            raise serializers.ValidationError("Can only review completed projects")
        
        request = self.context.get('request')
        if request and request.user not in [value.client, value.professional]:
            raise serializers.ValidationError("You can only review projects you are part of")
        
        return value
    
    def validate_reviewee(self, value):
        """Validate reviewee"""
        request = self.context.get('request')
        if request and request.user == value:
            raise serializers.ValidationError("You cannot review yourself")
        return value
    
    def validate_review_type(self, value):
        """Validate review type matches user role"""
        request = self.context.get('request')
        if not request:
            return value
            
        user = request.user
        if value == 'client_to_professional' and user.user_type != 'client':
            raise serializers.ValidationError("Only clients can create client-to-professional reviews")
        elif value == 'professional_to_client' and user.user_type not in ['home_pro', 'specialist', 'crew_member']:
            raise serializers.ValidationError("Only professionals can create professional-to-client reviews")
        
        return value
    
    def validate(self, attrs):
        """Cross-field validation"""
        project = attrs.get('project')
        contract = attrs.get('contract')
        reviewee = attrs.get('reviewee')
        review_type = attrs.get('review_type')
        request = self.context.get('request')
        
        if not request:
            return attrs
            
        reviewer = request.user
        
        # Ensure either project or contract is provided, but not both
        if not project and not contract:
            raise serializers.ValidationError("Either project or contract must be provided")
        if project and contract:
            raise serializers.ValidationError("Cannot provide both project and contract")
        
        # Use contract if provided, otherwise use project
        work_item = contract or project
        
        if work_item and hasattr(work_item, 'client') and hasattr(work_item, 'professional'):
            # Validate review type consistency
            if review_type == 'client_to_professional':
                if reviewer != work_item.client or reviewee != work_item.professional:
                    raise serializers.ValidationError("Invalid reviewer/reviewee for client-to-professional review")
            elif review_type == 'professional_to_client':
                if reviewer != work_item.professional or reviewee != work_item.client:
                    raise serializers.ValidationError("Invalid reviewer/reviewee for professional-to-client review")
        
        # Check if review already exists
        filter_kwargs = {'reviewer': reviewer, 'review_type': review_type}
        if project:
            filter_kwargs['project'] = project
            filter_kwargs['contract__isnull'] = True
        if contract:
            filter_kwargs['contract'] = contract
            filter_kwargs['project__isnull'] = True
            
        existing_review = Review.objects.filter(**filter_kwargs).exists()
        
        if existing_review:
            raise serializers.ValidationError("You have already submitted this type of review for this work item")
        
        return attrs
    
    def create(self, validated_data):
        """Create review with reviewer from request"""
        request = self.context.get('request')
        if request:
            validated_data['reviewer'] = request.user
        
        review = super().create(validated_data)
        
        # Update reviewee's rating
        reviewee = review.reviewee
        all_reviews = Review.objects.filter(reviewee=reviewee)
        
        # Calculate new average rating
        avg_rating = all_reviews.aggregate(avg=Avg('rating'))['avg']
        reviewee.rating_average = avg_rating or 0
        reviewee.rating_count = all_reviews.count()
        reviewee.save(update_fields=['rating_average', 'rating_count'])
        
        return review


class ReviewUpdateSerializer(serializers.ModelSerializer):
    """Serializer لتحديث التقييمات"""
    
    class Meta:
        model = Review
        fields = [
            'rating', 'comment', 'quality_rating', 'communication_rating', 
            'timeliness_rating', 'professionalism_rating',
            'cooperation_rating', 'payment_timeliness_rating', 'clarity_rating',
            'would_recommend', 'is_public'
        ]
    
    def validate_rating(self, value):
        """Validate overall rating"""
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5")
        return value
    
    def validate_quality_rating(self, value):
        """Validate quality rating"""
        if value is not None and (value < 1 or value > 5):
            raise serializers.ValidationError("Quality rating must be between 1 and 5")
        return value
    
    def validate_communication_rating(self, value):
        """Validate communication rating"""
        if value is not None and (value < 1 or value > 5):
            raise serializers.ValidationError("Communication rating must be between 1 and 5")
        return value
    
    def validate_timeliness_rating(self, value):
        """Validate timeliness rating"""
        if value is not None and (value < 1 or value > 5):
            raise serializers.ValidationError("Timeliness rating must be between 1 and 5")
        return value
    
    def validate_professionalism_rating(self, value):
        """Validate professionalism rating"""
        if value is not None and (value < 1 or value > 5):
            raise serializers.ValidationError("Professionalism rating must be between 1 and 5")
        return value
    
    def update(self, instance, validated_data):
        review = super().update(instance, validated_data)
        
        # Update professional's rating
        professional = review.reviewee
        all_reviews = Review.objects.filter(reviewee=professional)
        
        # Calculate new average rating
        avg_rating = all_reviews.aggregate(avg=Avg('rating'))['avg']
        professional.rating_average = avg_rating or 0
        professional.rating_count = all_reviews.count()
        professional.save(update_fields=['rating_average', 'rating_count'])
        
        return review


class ReviewListSerializer(serializers.ModelSerializer):
    """Serializer for listing reviews"""
    reviewer = UserBasicSerializer(read_only=True)
    reviewee = UserBasicSerializer(read_only=True)
    professional = UserBasicSerializer(read_only=True)  # Backward compatibility
    client = UserBasicSerializer(read_only=True)  # Backward compatibility
    project_title = serializers.CharField(source='project.title', read_only=True)
    contract_title = serializers.CharField(source='contract.title', read_only=True)
    
    class Meta:
        model = Review
        fields = [
            'id', 'project_title', 'contract_title', 'reviewer', 'reviewee',
            'professional', 'client', 'review_type', 'rating', 
            'comment', 'would_recommend', 'created_at'
        ]


class ProfessionalReviewsSerializer(serializers.ModelSerializer):
    """Serializer for professional reviews (reviews received by professionals)"""
    reviewer = UserBasicSerializer(read_only=True)
    client = UserBasicSerializer(read_only=True)  # Backward compatibility
    project_info = serializers.SerializerMethodField()
    contract_info = serializers.SerializerMethodField()
    
    class Meta:
        model = Review
        fields = [
            'id', 'project_info', 'contract_info', 'reviewer', 'client', 
            'review_type', 'rating', 'comment',
            'quality_rating', 'communication_rating', 
            'timeliness_rating', 'professionalism_rating',
            'would_recommend', 'created_at'
        ]
    
    def get_project_info(self, obj):
        """Get project information"""
        if obj.project:
            return {
                'id': obj.project.id,
                'title': obj.project.title,
                'slug': obj.project.slug,
            }
        return None
    
    def get_contract_info(self, obj):
        """Get contract information"""
        if obj.contract:
            return {
                'id': obj.contract.id,
                'title': obj.contract.title,
            }
        return None


class ClientReviewsSerializer(serializers.ModelSerializer):
    """Serializer for client reviews (reviews received by clients)"""
    reviewer = UserBasicSerializer(read_only=True)
    professional = UserBasicSerializer(read_only=True)  # Backward compatibility
    project_info = serializers.SerializerMethodField()
    contract_info = serializers.SerializerMethodField()
    
    class Meta:
        model = Review
        fields = [
            'id', 'project_info', 'contract_info', 'reviewer', 'professional', 
            'review_type', 'rating', 'comment',
            'cooperation_rating', 'payment_timeliness_rating', 'clarity_rating',
            'would_recommend', 'created_at'
        ]
    
    def get_project_info(self, obj):
        """Get project information"""
        if obj.project:
            return {
                'id': obj.project.id,
                'title': obj.project.title,
                'slug': obj.project.slug,
            }
        return None
    
    def get_contract_info(self, obj):
        """Get contract information"""
        if obj.contract:
            return {
                'id': obj.contract.id,
                'title': obj.contract.title,
            }
        return None


class ReviewStatsSerializer(serializers.Serializer):
    """Serializer لإحصائيات التقييمات"""
    total_reviews = serializers.IntegerField()
    average_rating = serializers.DecimalField(max_digits=3, decimal_places=2)
    rating_distribution = serializers.DictField()
    
    # Detailed ratings averages
    average_quality = serializers.DecimalField(max_digits=3, decimal_places=2)
    average_communication = serializers.DecimalField(max_digits=3, decimal_places=2)
    average_timeliness = serializers.DecimalField(max_digits=3, decimal_places=2)
    average_professionalism = serializers.DecimalField(max_digits=3, decimal_places=2)
    
    # Recent activity
    recent_reviews_count = serializers.IntegerField()
    this_month_reviews = serializers.IntegerField()
    last_month_reviews = serializers.IntegerField()


class ReviewSummarySerializer(serializers.Serializer):
    """Serializer لملخص التقييمات"""
    professional_id = serializers.IntegerField()
    professional_name = serializers.CharField()
    total_reviews = serializers.IntegerField()
    average_rating = serializers.DecimalField(max_digits=3, decimal_places=2)
    latest_review = serializers.DateTimeField()
    five_star_percentage = serializers.DecimalField(max_digits=5, decimal_places=2)
    four_star_percentage = serializers.DecimalField(max_digits=5, decimal_places=2)
    three_star_percentage = serializers.DecimalField(max_digits=5, decimal_places=2)
    two_star_percentage = serializers.DecimalField(max_digits=5, decimal_places=2)
    one_star_percentage = serializers.DecimalField(max_digits=5, decimal_places=2)


class ReviewResponseSerializer(serializers.Serializer):
    """Serializer لردود المحترف على التقييمات"""
    response = serializers.CharField(max_length=1000)
    
    def validate_response(self, value):
        """Validate response content"""
        if not value or not value.strip():
            raise serializers.ValidationError("Response cannot be empty")
        return value.strip()


class ReviewFilterSerializer(serializers.Serializer):
    """Serializer لفلترة التقييمات"""
    professional_id = serializers.IntegerField(required=False)
    client_id = serializers.IntegerField(required=False)
    project_id = serializers.IntegerField(required=False)
    rating = serializers.IntegerField(required=False, min_value=1, max_value=5)
    rating_min = serializers.IntegerField(required=False, min_value=1, max_value=5)
    rating_max = serializers.IntegerField(required=False, min_value=1, max_value=5)
    date_from = serializers.DateField(required=False)
    date_to = serializers.DateField(required=False)
    has_comment = serializers.BooleanField(required=False)
    
    def validate(self, attrs):
        """Validate filter parameters"""
        rating_min = attrs.get('rating_min')
        rating_max = attrs.get('rating_max')
        
        if rating_min and rating_max and rating_min > rating_max:
            raise serializers.ValidationError("rating_min cannot be greater than rating_max")
        
        date_from = attrs.get('date_from')
        date_to = attrs.get('date_to')
        
        if date_from and date_to and date_from > date_to:
            raise serializers.ValidationError("date_from cannot be after date_to")
        
        return attrs


class ReviewReportSerializer(serializers.Serializer):
    """Serializer لتقرير التقييمات"""
    period = serializers.ChoiceField(
        choices=['week', 'month', 'quarter', 'year'],
        default='month'
    )
    professional_id = serializers.IntegerField(required=False)
    include_comments = serializers.BooleanField(default=False)
    include_detailed_ratings = serializers.BooleanField(default=True)
    
    def validate_professional_id(self, value):
        """Validate professional exists"""
        if value:
            try:
                User.objects.get(
                    id=value,
                    user_type__in=['home_pro', 'specialist', 'crew_member']
                )
            except User.DoesNotExist:
                raise serializers.ValidationError("Professional not found")
        
        return value