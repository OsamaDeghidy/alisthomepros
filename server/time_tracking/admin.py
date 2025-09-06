from django.contrib import admin
from django.utils.html import format_html
from .models import TimeEntry


@admin.register(TimeEntry)
class TimeEntryAdmin(admin.ModelAdmin):
    """
    إدارة إدخالات الوقت
    """
    list_display = (
        'professional', 'project', 'task', 'date',
        'duration_formatted', 'total_cost_formatted', 'status'
    )
    list_filter = ('status', 'date', 'created_at')
    search_fields = (
        'task', 'notes', 'professional__username', 'project__title'
    )
    readonly_fields = ('duration', 'total_cost', 'created_at', 'updated_at')
    autocomplete_fields = ['project', 'professional']
    list_editable = ('status',)
    date_hierarchy = 'date'
    ordering = ('-date', '-start_time')
    
    fieldsets = (
        ('Time Entry Information', {
            'fields': ('project', 'professional', 'task')
        }),
        ('Time Details', {
            'fields': ('date', 'start_time', 'end_time', 'duration')
        }),
        ('Cost Calculation', {
            'fields': ('hourly_rate', 'total_cost')
        }),
        ('Additional Information', {
            'fields': ('notes', 'status')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def duration_formatted(self, obj):
        hours = obj.duration // 60
        minutes = obj.duration % 60
        return f"{hours}س {minutes}د"
    duration_formatted.short_description = 'المدة'
    
    def total_cost_formatted(self, obj):
        return f"${obj.total_cost:,.2f}"
    total_cost_formatted.short_description = 'التكلفة الإجمالية'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'project', 'professional'
        )
