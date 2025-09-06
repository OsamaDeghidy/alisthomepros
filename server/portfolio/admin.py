from django.contrib import admin
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from .models import PortfolioItem, PortfolioImage


@admin.register(PortfolioItem)
class PortfolioItemAdmin(admin.ModelAdmin):
    list_display = ['title', 'professional', 'category', 'completion_date', 'featured', 'views', 'likes']
    list_filter = ['featured', 'category', 'completion_date', 'created_at']
    search_fields = ['title', 'description', 'professional__username', 'category']
    readonly_fields = ['created_at', 'updated_at']
    autocomplete_fields = ['professional']
    list_editable = ['featured']
    
    fieldsets = [
        ('معلومات أساسية', {
            'fields': ('professional', 'title', 'description')
        }),
        ('تفاصيل المشروع', {
            'fields': ('category', 'project_duration', 'project_cost', 'completion_date')
        }),
        ('الإعدادات', {
            'fields': ('featured',)
        }),
        ('الإحصائيات', {
            'fields': ('views', 'likes')
        }),
        ('الطوابع الزمنية', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    ]
    
    actions = ['mark_as_featured', 'unmark_as_featured']
    
    def mark_as_featured(self, request, queryset):
        queryset.update(featured=True)
        self.message_user(request, f"{queryset.count()} portfolio items marked as featured.")
    mark_as_featured.short_description = "Mark selected items as featured"
    
    def unmark_as_featured(self, request, queryset):
        queryset.update(featured=False)
        self.message_user(request, f"{queryset.count()} portfolio items unmarked as featured.")
    unmark_as_featured.short_description = "Unmark selected items as featured"


@admin.register(PortfolioImage)
class PortfolioImageAdmin(admin.ModelAdmin):
    list_display = ['portfolio_item', 'caption', 'is_primary', 'order', 'image_preview', 'created_at']
    list_filter = ['is_primary', 'created_at']
    search_fields = ['portfolio_item__title', 'caption']
    readonly_fields = ['image_preview', 'created_at']
    autocomplete_fields = ['portfolio_item']
    list_editable = ['is_primary', 'order']
    
    def image_preview(self, obj):
        if obj.image:
            return mark_safe(f'<img src="{obj.image.url}" style="max-width: 100px; max-height: 100px;" />')
        return "No Image"
    image_preview.short_description = "Preview"
    
    fieldsets = [
        ('معلومات الصورة', {
            'fields': ('portfolio_item', 'image', 'image_preview')
        }),
        ('التفاصيل', {
            'fields': ('caption', 'is_primary', 'order')
        }),
        ('الطوابع الزمنية', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    ]
