from django.contrib import admin
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from .models import Category, Project, ProjectImage, ProjectFile, ProjectFavorite, ProjectView, ProjectUpdate, IntakeLead


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'is_active', 'order', 'projects_count']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['created_at', 'updated_at']
    
    def projects_count(self, obj):
        return obj.projects.count()
    projects_count.short_description = "Projects Count"


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'client', 'category', 'status', 'urgency', 
        'budget_display', 'views_count', 'progress_bar', 'created_at','is_paid'
    ]
    list_filter = ['status', 'urgency', 'category', 'is_featured', 'budget_type', 'created_at']
    search_fields = ['title', 'description', 'client__username', 'location']
    readonly_fields = ['slug', 'views_count', 'favorites_count', 'proposals_count', 'created_at', 'updated_at', 'published_at']
    autocomplete_fields = ['client', 'category', 'assigned_professional']
    
    fieldsets = [
        ('معلومات أساسية', {
            'fields': ('title', 'slug', 'description', 'client')
        }),
        ('تفاصيل المشروع', {
            'fields': ('category', 'location')
        }),
        ('الميزانية', {
            'fields': ('budget_type', 'budget_min', 'budget_max', 'budget_display')
        }),
        ('الجدول الزمني', {
            'fields': ('timeline', 'start_date', 'end_date')
        }),
        ('المتطلبات', {
            'fields': ('required_skills', 'required_roles')
        }),
        ('الحالة والأولوية', {
            'fields': ('status', 'urgency', 'completion_percentage')
        }),
        ('ميزات المشروع', {
            'fields': ('is_featured', 'is_remote_allowed', 'requires_license', 'requires_insurance')
        }),
        ('الإحصائيات', {
            'fields': ('views_count', 'favorites_count', 'proposals_count')
        }),
        ('التخصيص', {
            'fields': ('assigned_professional',)
        }),
        ('الطوابع الزمنية', {
            'fields': ('published_at', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    ]
    
    actions = ['mark_as_published', 'mark_as_featured']
    
    def progress_bar(self, obj):
        if obj.completion_percentage:
            percentage = int(obj.completion_percentage) if obj.completion_percentage else 0
            color = 'green' if percentage >= 100 else 'orange' if percentage >= 50 else 'red'
            return format_html(
                '<div style="width: 100px; background-color: #f0f0f0;">'
                '<div style="width: {}%; background-color: {}; height: 20px; text-align: center; color: white;">{}%</div>'
                '</div>',
                percentage, color, percentage
            )
        return "0%"
    progress_bar.short_description = "Progress"
    
    def mark_as_published(self, request, queryset):
        queryset.update(status='published')
        self.message_user(request, f"{queryset.count()} projects marked as published.")
    mark_as_published.short_description = "Mark selected projects as published"
    
    def mark_as_featured(self, request, queryset):
        queryset.update(is_featured=True)
        self.message_user(request, f"{queryset.count()} projects marked as featured.")
    mark_as_featured.short_description = "Mark selected projects as featured"


@admin.register(ProjectImage)
class ProjectImageAdmin(admin.ModelAdmin):
    list_display = ['project', 'caption', 'is_primary', 'order', 'image_preview']
    list_filter = ['is_primary', 'created_at']
    search_fields = ['project__title', 'caption']
    autocomplete_fields = ['project']
    readonly_fields = ['image_preview', 'created_at']
    
    def image_preview(self, obj):
        if obj.image:
            return mark_safe(f'<img src="{obj.image.url}" style="max-width: 100px; max-height: 100px;" />')
        return "No Image"
    image_preview.short_description = "Preview"


@admin.register(ProjectFile)
class ProjectFileAdmin(admin.ModelAdmin):
    list_display = ['filename', 'project', 'file_type', 'file_size_display', 'created_at']
    list_filter = ['file_type', 'created_at']
    search_fields = ['filename', 'project__title']
    autocomplete_fields = ['project']
    readonly_fields = ['file_size_display', 'created_at']
    
    def file_size_display(self, obj):
        return obj.get_file_size_display()
    file_size_display.short_description = "File Size"


@admin.register(ProjectFavorite)
class ProjectFavoriteAdmin(admin.ModelAdmin):
    list_display = ['user', 'project', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__username', 'project__title']
    autocomplete_fields = ['user', 'project']


@admin.register(ProjectView)
class ProjectViewAdmin(admin.ModelAdmin):
    list_display = ['project', 'user', 'ip_address', 'created_at']
    list_filter = ['created_at']
    search_fields = ['project__title', 'user__username', 'ip_address']
    readonly_fields = ['created_at']
    autocomplete_fields = ['project', 'user']


@admin.register(ProjectUpdate)
class ProjectUpdateAdmin(admin.ModelAdmin):
    list_display = ['title', 'project', 'user', 'update_type', 'created_at']
    list_filter = ['update_type', 'created_at']
    search_fields = ['title', 'project__title', 'user__username']
    readonly_fields = ['created_at']
    autocomplete_fields = ['project', 'user']
    
    fieldsets = [
        ('معلومات التحديث', {
            'fields': ('project', 'user', 'update_type', 'title', 'description')
        }),
        ('تتبع التقدم', {
            'fields': ('previous_status', 'new_status', 'previous_completion', 'new_completion')
        }),
        ('الطوابع الزمنية', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    ]


# Intake leads admin
@admin.register(IntakeLead)
class IntakeLeadAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'email', 'phone', 'status', 'consent', 'source_path', 'language', 'created_at']
    list_filter = ['status', 'consent', 'language', 'created_at']
    search_fields = ['full_name', 'email', 'phone', 'message', 'source_path']
    readonly_fields = ['created_at', 'updated_at']
    actions = ['mark_contacted', 'mark_converted']

    def mark_contacted(self, request, queryset):
        updated = queryset.update(status='contacted')
        self.message_user(request, f"{updated} leads marked as contacted.")
    mark_contacted.short_description = "Mark selected as contacted"

    def mark_converted(self, request, queryset):
        updated = queryset.update(status='converted')
        self.message_user(request, f"{updated} leads marked as converted.")
    mark_converted.short_description = "Mark selected as converted"

# تخصيص موقع الإدارة
admin.site.site_header = 'A-List Projects Admin'
admin.site.site_title = 'Projects Management'
admin.site.index_title = 'إدارة المشاريع'
