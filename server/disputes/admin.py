from django.contrib import admin
from .models import Dispute, DisputeMessage, DisputeEvidence, DisputeResolution

@admin.register(Dispute)
class DisputeAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'title', 'status', 'dispute_type', 'priority',
        'raised_by', 'assigned_to', 'created_at', 'updated_at'
    ]
    list_filter = [
        'status', 'dispute_type', 'priority', 'created_at',
        'updated_at', 'resolution_date'
    ]
    search_fields = ['title', 'description', 'raised_by__username', 'against__username']
    readonly_fields = ['id', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'status', 'dispute_type', 'priority')
        }),
        ('Parties Involved', {
            'fields': ('raised_by', 'against', 'assigned_to')
        }),
        ('Related Objects', {
            'fields': ('contract', 'milestone', 'payment')
        }),
        ('Financial Impact', {
            'fields': ('disputed_amount', 'refund_amount')
        }),
        ('Resolution', {
            'fields': ('resolution_notes', 'resolution_date', 'resolved_by')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )

@admin.register(DisputeMessage)
class DisputeMessageAdmin(admin.ModelAdmin):
    list_display = ['id', 'dispute', 'sender', 'message_type', 'created_at']
    list_filter = ['message_type', 'created_at', 'is_internal']
    search_fields = ['dispute__title', 'sender__username', 'content']
    readonly_fields = ['id', 'created_at']

@admin.register(DisputeEvidence)
class DisputeEvidenceAdmin(admin.ModelAdmin):
    list_display = ['id', 'dispute', 'uploaded_by', 'evidence_type', 'created_at']
    list_filter = ['evidence_type', 'created_at']
    search_fields = ['dispute__title', 'uploaded_by__username', 'description']
    readonly_fields = ['id', 'created_at']

@admin.register(DisputeResolution)
class DisputeResolutionAdmin(admin.ModelAdmin):
    list_display = ['id', 'dispute', 'resolution_type', 'resolved_by', 'resolved_at']
    list_filter = ['resolution_type', 'resolved_at']
    search_fields = ['dispute__title', 'resolved_by__username']
    readonly_fields = ['id', 'resolved_at']