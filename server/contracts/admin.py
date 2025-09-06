from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import (
    Contract, ContractMilestone, ContractDocument, 
    ContractLocation, ContractCalendarEvent
)


@admin.register(Contract)
class ContractAdmin(admin.ModelAdmin):
    list_display = [
        'contract_number', 'title', 'client', 'professional', 
        'total_amount', 'contract_balance_display', 'professional_balance_display', 'paid_amount',
        'status', 'progress_bar', 'is_signed', 'view_milestones_link', 'view_documents_link', 'created_at'
    ]
    list_filter = ['status', 'payment_type', 'client_signed', 'professional_signed', 'created_at']
    search_fields = ['contract_number', 'title', 'client__username', 'professional__username']
    readonly_fields = [
        'contract_number', 'created_at', 'updated_at', 'remaining_amount',
        'available_contract_balance', 'is_professional_balance_available',
        'platform_commission_amount', 'net_amount_to_professional'
    ]
    autocomplete_fields = ['client', 'professional', 'project']
    
    fieldsets = [
        ('معلومات أساسية', {
            'fields': ('contract_number', 'title', 'description')
        }),
        ('الأطراف', {
            'fields': ('client', 'professional', 'project')
        }),
        ('التفاصيل المالية', {
            'fields': (
                'total_amount', 'contract_balance', 'professional_balance', 'paid_amount', 
                'remaining_amount', 'available_contract_balance', 'payment_type', 'hourly_rate'
            )
        }),
        ('العمولة والمبالغ الصافية', {
            'fields': (
                'platform_commission_rate', 'platform_commission_amount', 
                'net_amount_to_professional', 'professional_balance_release_date',
                'is_professional_balance_available'
            ),
            'classes': ('collapse',)
        }),
        ('الجدول الزمني', {
            'fields': ('start_date', 'end_date', 'actual_end_date')
        }),
        ('الحالة والإكمال', {
            'fields': ('status', 'completion_percentage')
        }),
        ('شروط العقد', {
            'fields': ('terms_and_conditions', 'warranty_period', 'payment_terms')
        }),
        ('التوقيعات', {
            'fields': ('client_signed', 'client_signed_date', 'professional_signed', 'professional_signed_date')
        }),
        ('الطوابع الزمنية', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    ]
    
    def progress_bar(self, obj):
        if obj.completion_percentage:
            percentage = int(obj.completion_percentage) if obj.completion_percentage else 0
            color = 'green' if percentage >= 100 else 'orange' if percentage >= 50 else 'red'
            return format_html(
                '<div style="width: 100px; background-color: #f0f0f0; border-radius: 3px;">' +
                '<div style="width: {}%; background-color: {}; height: 20px; border-radius: 3px; text-align: center; color: white; font-size: 12px; line-height: 20px;">' +
                '{}%</div></div>',
                percentage, color, percentage
            )
        return format_html('<span style="color: gray;">0%</span>')
    progress_bar.short_description = "Progress"
    
    def is_signed(self, obj):
        if obj.client_signed and obj.professional_signed:
            return format_html('<span style="color: green;">✓ موقع بالكامل</span>')
        elif obj.client_signed or obj.professional_signed:
            return format_html('<span style="color: orange;">⚠ موقع جزئياً</span>')
        else:
            return format_html('<span style="color: red;">✗ غير موقع</span>')
    is_signed.short_description = "Signature Status"
    
    def contract_balance_display(self, obj):
        """Display contract balance with color coding"""
        balance = obj.contract_balance or 0
        color = 'green' if balance > 0 else 'red' if balance == 0 else 'orange'
        return format_html(
            '<span style="color: {}; font-weight: bold;">${}</span>',
            color, f"{float(balance):.2f}"
        )
    contract_balance_display.short_description = "Contract Balance"
    
    def professional_balance_display(self, obj):
        """Display professional balance with availability status"""
        balance = obj.professional_balance or 0
        is_available = obj.is_professional_balance_available
        color = 'green' if is_available else 'orange'
        status = '(Available)' if is_available else '(Pending)'
        return format_html(
            '<span style="color: {}; font-weight: bold;">${} {}</span>',
            color, f"{float(balance):.2f}", status
        )
    professional_balance_display.short_description = "Professional Balance"
    
    def view_milestones_link(self, obj):
        """Link to view contract milestones"""
        url = reverse('admin:contracts_contractmilestone_changelist')
        return format_html(
            '<a href="{}?contract__id__exact={}" target="_blank">View Milestones ({})</a>',
            url, obj.id, obj.milestones.count()
        )
    view_milestones_link.short_description = "Milestones"
    
    def view_documents_link(self, obj):
        """Link to view contract documents"""
        url = reverse('admin:contracts_contractdocument_changelist')
        return format_html(
            '<a href="{}?contract__id__exact={}" target="_blank">View Documents ({})</a>',
            url, obj.id, obj.documents.count()
        )
    view_documents_link.short_description = "Documents"


@admin.register(ContractMilestone)
class ContractMilestoneAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'contract', 'amount', 'due_date', 'milestone_progress', 'payment_status_display',
        'completion_date', 'payment_date', 'order'
    ]
    list_filter = ['status', 'payment_status', 'due_date', 'completion_date', 'payment_date']
    search_fields = ['title', 'contract__contract_number', 'contract__title']
    autocomplete_fields = ['contract']
    readonly_fields = [
        'created_at', 'updated_at', 'platform_commission_amount', 
        'net_amount_to_professional', 'payment_requested_at', 'payment_approved_at'
    ]
    
    fieldsets = [
        ('معلومات المرحلة', {
            'fields': ('contract', 'title', 'description', 'order')
        }),
        ('التفاصيل المالية', {
            'fields': (
                'amount', 'platform_commission_rate', 'platform_commission_amount',
                'net_amount_to_professional'
            )
        }),
        ('الجدول الزمني', {
            'fields': ('due_date', 'completion_date', 'payment_date')
        }),
        ('الحالة والدفع', {
            'fields': (
                'status', 'payment_status', 'payment_requested_at', 
                'payment_approved_at', 'payment_notes'
            )
        }),
        ('الطوابع الزمنية', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    ]
    
    def payment_status_display(self, obj):
        """Display payment status with color coding"""
        status_colors = {
            'not_requested': 'gray',
            'requested': 'orange',
            'approved': 'blue',
            'paid': 'green',
            'rejected': 'red'
        }
        color = status_colors.get(obj.payment_status, 'black')
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color, obj.get_payment_status_display()
        )
    payment_status_display.short_description = "Payment Status"
    
    def milestone_progress(self, obj):
        """Display milestone progress"""
        if obj.status == 'completed':
            return format_html('<span style="color: green; font-weight: bold;">✓ مكتملة</span>')
        elif obj.status == 'in_progress':
            return format_html('<span style="color: orange; font-weight: bold;">⚠ قيد التنفيذ</span>')
        elif obj.status == 'cancelled':
            return format_html('<span style="color: red; font-weight: bold;">✗ ملغية</span>')
        else:
            return format_html('<span style="color: gray;">⏳ معلقة</span>')
    milestone_progress.short_description = "Progress"


@admin.register(ContractDocument)
class ContractDocumentAdmin(admin.ModelAdmin):
    list_display = ['name', 'contract', 'document_type', 'uploaded_by', 'signature_status', 'created_at']
    list_filter = ['document_type', 'is_signed', 'created_at', 'uploaded_by']
    search_fields = ['name', 'contract__contract_number', 'contract__title']
    autocomplete_fields = ['contract', 'uploaded_by']
    readonly_fields = ['created_at']
    
    def signature_status(self, obj):
        """Display signature status with color coding"""
        if obj.is_signed:
            return format_html('<span style="color: green; font-weight: bold;">✓ موقع</span>')
        else:
            return format_html('<span style="color: red; font-weight: bold;">✗ غير موقع</span>')
    signature_status.short_description = "Signature Status"
    
    fieldsets = [
        ('معلومات المستند', {
            'fields': ('contract', 'name', 'document_type')
        }),
        ('الملف', {
            'fields': ('file', 'uploaded_by')
        }),
        ('حالة التوقيع', {
            'fields': ('is_signed',)
        }),
        ('الطوابع الزمنية', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    ]


@admin.register(ContractLocation)
class ContractLocationAdmin(admin.ModelAdmin):
    list_display = ['name', 'contract', 'city', 'state', 'country', 'is_primary', 'created_at']
    list_filter = ['is_primary', 'city', 'state', 'country', 'created_at']
    search_fields = ['name', 'address', 'city', 'contract__contract_number']
    autocomplete_fields = ['contract']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = [
        ('معلومات الموقع', {
            'fields': ('contract', 'name', 'is_primary')
        }),
        ('العنوان', {
            'fields': ('address', 'city', 'state', 'zip_code', 'country')
        }),
        ('الإحداثيات', {
            'fields': ('latitude', 'longitude'),
            'classes': ('collapse',)
        }),
        ('الطوابع الزمنية', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    ]


@admin.register(ContractCalendarEvent)
class ContractCalendarEventAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'contract', 'event_type', 'date', 'start_time', 
        'end_time', 'event_status', 'priority_display', 'assigned_to'
    ]
    list_filter = ['event_type', 'status', 'priority', 'date', 'assigned_to']
    search_fields = ['title', 'description', 'contract__contract_number', 'location']
    autocomplete_fields = ['contract', 'assigned_to']
    readonly_fields = ['created_at', 'updated_at', 'duration']
    
    def event_status(self, obj):
        """Display event status with color coding"""
        status_colors = {
            'scheduled': 'blue',
            'completed': 'green',
            'cancelled': 'red',
            'postponed': 'orange'
        }
        color = status_colors.get(obj.status, 'black')
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color, obj.get_status_display()
        )
    event_status.short_description = "Status"
    
    def priority_display(self, obj):
        """Display priority with color coding"""
        priority_colors = {
            'high': 'red',
            'medium': 'orange',
            'low': 'green'
        }
        color = priority_colors.get(obj.priority, 'black')
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color, obj.get_priority_display()
        )
    priority_display.short_description = "Priority"
    
    fieldsets = [
        ('معلومات الحدث', {
            'fields': ('contract', 'title', 'description', 'event_type')
        }),
        ('التوقيت والمكان', {
            'fields': ('date', 'start_time', 'end_time', 'location', 'duration')
        }),
        ('الحالة والأولوية', {
            'fields': ('status', 'priority', 'assigned_to')
        }),
        ('ملاحظات', {
            'fields': ('notes',),
            'classes': ('collapse',)
        }),
        ('الطوابع الزمنية', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    ]
