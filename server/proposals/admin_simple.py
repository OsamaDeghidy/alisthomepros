from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from django.db.models import Count, Avg, Sum
from django.utils import timezone
from .models import Proposal, ProposalMilestone, ProposalAttachment, ProposalView


@admin.register(Proposal)
class ProposalAdmin(admin.ModelAdmin):
    list_display = [
        'professional_name',
        'project_title', 
        'amount_simple',
        'status',
        'priority',
        'timeline',
        'created_at',
    ]
    
    list_filter = [
        'status',
        'priority',
        'is_featured',
        'includes_materials',
        'currency',
        'created_at',
        'professional__user_type',
        'professional__is_verified',
    ]
    
    search_fields = [
        'professional__first_name',
        'professional__last_name',
        'professional__email',
        'project__title',
        'cover_letter',
    ]
    
    readonly_fields = [
        'id',
        'created_at',
        'updated_at',
        'responded_at',
    ]
    
    list_per_page = 25
    date_hierarchy = 'created_at'
    ordering = ['-created_at']
    
    def professional_name(self, obj):
        """Professional name"""
        if obj.professional:
            name = obj.professional.get_full_name()
            if obj.professional.is_verified:
                name += " ✅"
            return name
        return '-'
    professional_name.short_description = 'Professional'
    
    def project_title(self, obj):
        """Project title"""
        if obj.project:
            return obj.project.title[:50]
        return '-'
    project_title.short_description = 'Project'
    
    def amount_simple(self, obj):
        """Simple amount display"""
        if obj.amount:
            return f"${float(obj.amount):,.2f}"
        return '-'
    amount_simple.short_description = 'Amount'


@admin.register(ProposalMilestone)
class ProposalMilestoneAdmin(admin.ModelAdmin):
    list_display = ['title', 'amount', 'timeline', 'order', 'created_at']
    list_filter = ['created_at']
    search_fields = ['title', 'description']
    ordering = ['proposal', 'order']


@admin.register(ProposalAttachment)
class ProposalAttachmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'file_type', 'created_at']
    list_filter = ['file_type', 'created_at']
    search_fields = ['name', 'description']


@admin.register(ProposalView)
class ProposalViewAdmin(admin.ModelAdmin):
    list_display = ['proposal', 'viewer', 'viewed_at', 'ip_address']
    list_filter = ['viewed_at']
    date_hierarchy = 'viewed_at'


# Set admin site headers
admin.site.site_header = 'A-List Home Professionals Admin'
admin.site.site_title = 'A-List Admin'
admin.site.index_title = 'Platform Administration' 