from django.contrib import admin
from .models import Proposal, ProposalMilestone, ProposalAttachment, ProposalView


@admin.register(Proposal)
class ProposalAdmin(admin.ModelAdmin):
    list_display = [
        'get_professional_name',
        'get_project_title', 
        'get_amount',
        'status',
        'priority',
        'timeline',
        'created_at',
    ]
    
    list_filter = [
        'status',
        'priority',
        'is_featured',
        'currency',
        'created_at',
    ]
    
    search_fields = [
        'professional__first_name',
        'professional__last_name',
        'project__title',
        'cover_letter',
    ]
    
    readonly_fields = ['id', 'created_at', 'updated_at']
    list_per_page = 25
    ordering = ['-created_at']
    
    def get_professional_name(self, obj):
        if obj.professional:
            return obj.professional.get_full_name()
        return '-'
    get_professional_name.short_description = 'Professional'
    
    def get_project_title(self, obj):
        if obj.project:
            return obj.project.title
        return '-'
    get_project_title.short_description = 'Project'
    
    def get_amount(self, obj):
        if obj.amount:
            return f"${obj.amount}"
        return '-'
    get_amount.short_description = 'Amount'


@admin.register(ProposalMilestone)
class ProposalMilestoneAdmin(admin.ModelAdmin):
    list_display = ['title', 'amount', 'timeline', 'order']
    ordering = ['proposal', 'order']


@admin.register(ProposalAttachment)
class ProposalAttachmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'file_type', 'created_at']
    list_filter = ['file_type']


@admin.register(ProposalView)
class ProposalViewAdmin(admin.ModelAdmin):
    list_display = ['proposal', 'viewer', 'viewed_at']
    list_filter = ['viewed_at']
