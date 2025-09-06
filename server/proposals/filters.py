import django_filters
from django.db.models import Q
from .models import Proposal


class ProposalFilter(django_filters.FilterSet):
    """فلاتر للعروض"""
    
    # تصفية حسب الحالة
    status = django_filters.ChoiceFilter(choices=Proposal.STATUS_CHOICES)
    
    # تصفية حسب الأولوية
    priority = django_filters.ChoiceFilter(choices=Proposal.PRIORITY_CHOICES)
    
    # تصفية حسب المبلغ
    amount_min = django_filters.NumberFilter(field_name='amount', lookup_expr='gte')
    amount_max = django_filters.NumberFilter(field_name='amount', lookup_expr='lte')
    
    # تصفية حسب التاريخ
    created_after = django_filters.DateFilter(field_name='created_at', lookup_expr='gte')
    created_before = django_filters.DateFilter(field_name='created_at', lookup_expr='lte')
    
    # البحث النصي
    search = django_filters.CharFilter(method='filter_search')
    
    # تصفية حسب المحترف
    professional = django_filters.NumberFilter(field_name='professional__id')
    professional_verified = django_filters.BooleanFilter(field_name='professional__is_verified')
    professional_rating_min = django_filters.NumberFilter(
        field_name='professional__rating_average', 
        lookup_expr='gte'
    )
    
    # تصفية حسب المشروع
    project = django_filters.NumberFilter(field_name='project__id')
    project_category = django_filters.CharFilter(field_name='project__category__slug')
    
    # العروض المميزة
    is_featured = django_filters.BooleanFilter()
    
    # العروض التي تشمل المواد
    includes_materials = django_filters.BooleanFilter()
    
    # ترتيب
    ordering = django_filters.OrderingFilter(
        fields=(
            ('created_at', 'created_at'),
            ('amount', 'amount'),
            ('professional__rating_average', 'rating'),
            ('timeline', 'timeline'),
        ),
        field_labels={
            'created_at': 'تاريخ الإنشاء',
            'amount': 'المبلغ',
            'rating': 'التقييم',
            'timeline': 'المدة الزمنية',
        }
    )
    
    class Meta:
        model = Proposal
        fields = [
            'status', 'priority', 'amount_min', 'amount_max',
            'created_after', 'created_before', 'search',
            'professional', 'professional_verified', 'professional_rating_min',
            'project', 'project_category', 'is_featured', 'includes_materials'
        ]
    
    def filter_search(self, queryset, name, value):
        """البحث في المحتوى"""
        if not value:
            return queryset
        
        return queryset.filter(
            Q(cover_letter__icontains=value) |
            Q(professional__first_name__icontains=value) |
            Q(professional__last_name__icontains=value) |
            Q(professional__company_name__icontains=value) |
            Q(project__title__icontains=value) |
            Q(timeline__icontains=value)
        ) 