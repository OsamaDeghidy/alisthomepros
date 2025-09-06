from django.contrib import admin
from django.utils.html import format_html
from .models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'project', 'assigned_to', 'assigned_by', 'status', 'priority', 'due_date', 'progress_bar']
    list_filter = ['status', 'priority', 'due_date', 'created_at', 'completed_at']
    search_fields = ['title', 'description', 'project__title', 'assigned_to__username']
    readonly_fields = ['created_at', 'updated_at', 'completed_at']
    autocomplete_fields = ['project', 'assigned_to', 'assigned_by']
    list_editable = ['status', 'priority']
    
    fieldsets = [
        ('معلومات المهمة', {
            'fields': ('title', 'description', 'project')
        }),
        ('التخصيص', {
            'fields': ('assigned_to', 'assigned_by')
        }),
        ('التفاصيل', {
            'fields': ('due_date', 'priority', 'status', 'progress')
        }),
        ('الطوابع الزمنية', {
            'fields': ('created_at', 'updated_at', 'completed_at'),
            'classes': ('collapse',)
        }),
    ]
    
    def progress_bar(self, obj):
        if obj.progress:
            progress = int(obj.progress) if obj.progress else 0
            color = 'green' if progress >= 100 else 'orange' if progress >= 50 else 'red'
            return format_html(
                '<div style="width: 100px; background-color: #f0f0f0;">'
                '<div style="width: {}%; background-color: {}; height: 20px; text-align: center; color: white;">{}%</div>'
                '</div>',
                progress, color, progress
            )
        return "0%"
    progress_bar.short_description = "Progress"
    
    actions = ['mark_as_completed', 'mark_as_in_progress']
    
    def mark_as_completed(self, request, queryset):
        queryset.update(status='completed', progress=100)
        self.message_user(request, f"{queryset.count()} tasks marked as completed.")
    mark_as_completed.short_description = "Mark selected tasks as completed"
    
    def mark_as_in_progress(self, request, queryset):
        queryset.update(status='in_progress')
        self.message_user(request, f"{queryset.count()} tasks marked as in progress.")
    mark_as_in_progress.short_description = "Mark selected tasks as in progress"
