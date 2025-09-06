from django.contrib import admin
from django.utils.html import format_html
from django.db.models import Avg
from .models import Review


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    """
    Review Management
    """
    list_display = (
        'project_title', 'contract_title', 'reviewer', 'reviewee', 'review_type',
        'rating_stars', 'overall_rating', 'would_recommend', 'created_at'
    )
    list_filter = ('rating', 'review_type', 'would_recommend', 'is_public', 'created_at')
    search_fields = (
        'project__title', 'contract__title', 'reviewer__username', 'reviewee__username',
        'comment'
    )
    readonly_fields = ('created_at', 'updated_at', 'helpful_count')
    autocomplete_fields = ['project', 'contract', 'reviewer', 'reviewee']
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Review Information', {
            'fields': ('project', 'contract', 'reviewer', 'reviewee', 'review_type')
        }),
        ('Overall Rating', {
            'fields': ('rating', 'comment', 'would_recommend', 'is_public')
        }),
        ('Client to Professional Ratings', {
            'fields': (
                'quality_rating', 'communication_rating',
                'timeliness_rating', 'professionalism_rating'
            ),
            'classes': ('collapse',)
        }),
        ('Professional to Client Ratings', {
            'fields': (
                'cooperation_rating', 'payment_timeliness_rating', 'clarity_rating'
            ),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'helpful_count'),
            'classes': ('collapse',)
        }),
    )
    
    def project_title(self, obj):
        return obj.project.title if obj.project else '-'
    project_title.short_description = 'Project'
    
    def contract_title(self, obj):
        return obj.contract.title if obj.contract else '-'
    contract_title.short_description = 'Contract'
    
    def rating_stars(self, obj):
        stars = '⭐' * obj.rating
        return format_html(f'<span title="{obj.rating}/5">{stars}</span>')
    rating_stars.short_description = 'Rating'
    
    def overall_rating(self, obj):
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
        if valid_ratings:
            avg = sum(valid_ratings) / len(valid_ratings)
            return f'{avg:.1f}'
        return '-'
    overall_rating.short_description = 'Detailed Average'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'project', 'contract', 'reviewer', 'reviewee'
        )
