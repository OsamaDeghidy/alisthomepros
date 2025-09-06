from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.contrib import messages
from django.utils.safestring import mark_safe
from django.db.models import Count, Q
from datetime import datetime, timedelta, date
import json

from .models import Appointment, ProfessionalAvailability, UnavailableDate, AppointmentTemplate


class ProfessionalFilter(admin.SimpleListFilter):
    """Filter appointments by professional type"""
    title = 'Professional Type'
    parameter_name = 'professional_type'

    def lookups(self, request, model_admin):
        return (
            ('home_pro', 'Home Professional'),
            ('specialist', 'Specialist'),
            ('crew_member', 'Crew Member'),
        )

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(professional__user_type=self.value())


class DateRangeFilter(admin.SimpleListFilter):
    """Filter appointments by date range"""
    title = 'Date Range'
    parameter_name = 'date_range'

    def lookups(self, request, model_admin):
        return (
            ('today', 'Today'),
            ('tomorrow', 'Tomorrow'),
            ('this_week', 'This Week'),
            ('next_week', 'Next Week'),
            ('this_month', 'This Month'),
            ('next_month', 'Next Month'),
        )

    def queryset(self, request, queryset):
        today = date.today()
        if self.value() == 'today':
            return queryset.filter(date=today)
        elif self.value() == 'tomorrow':
            return queryset.filter(date=today + timedelta(days=1))
        elif self.value() == 'this_week':
            start_week = today - timedelta(days=today.weekday())
            end_week = start_week + timedelta(days=6)
            return queryset.filter(date__range=[start_week, end_week])
        elif self.value() == 'next_week':
            start_week = today + timedelta(days=7-today.weekday())
            end_week = start_week + timedelta(days=6)
            return queryset.filter(date__range=[start_week, end_week])
        elif self.value() == 'this_month':
            return queryset.filter(date__year=today.year, date__month=today.month)
        elif self.value() == 'next_month':
            if today.month == 12:
                return queryset.filter(date__year=today.year + 1, date__month=1)
            else:
                return queryset.filter(date__year=today.year, date__month=today.month + 1)


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = [
        'appointment_info', 'professional_info', 'client_info', 
        'schedule_info', 'status_badge', 'duration_display', 'actions_buttons'
    ]
    list_filter = [
        'status', 'type', ProfessionalFilter, DateRangeFilter, 
        'date', 'created_at', 'professional__is_available'
    ]
    search_fields = [
        'title', 'description', 'location',
        'professional__first_name', 'professional__last_name',
        'professional__email', 'professional__company_name',
        'client__first_name', 'client__last_name',
        'client__email', 'project__title'
    ]
    readonly_fields = [
        'created_at', 'updated_at', 'appointment_stats', 
        'professional_availability', 'conflict_check'
    ]
    date_hierarchy = 'date'
    ordering = ['-date', '-time']
    list_per_page = 20
    actions = [
        'confirm_appointments', 'cancel_appointments', 
        'complete_appointments', 'send_reminders'
    ]
    
    fieldsets = (
        ('📅 Appointment Information', {
            'fields': ('title', 'description', 'type'),
            'classes': ('wide',)
        }),
        ('👥 Participants', {
            'fields': ('professional', 'client', 'project'),
            'classes': ('wide',)
        }),
        ('🕐 Schedule Details', {
            'fields': ('date', 'time', 'duration', 'location', 'meeting_link'),
            'classes': ('wide',)
        }),
        ('📊 Status & Checks', {
            'fields': ('status', 'conflict_check', 'professional_availability'),
            'classes': ('wide',)
        }),
        ('📈 Statistics', {
            'fields': ('appointment_stats',),
            'classes': ('collapse', 'wide')
        }),
        ('🕒 Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'professional', 'client', 'project'
        ).prefetch_related('professional__received_reviews')

    def appointment_info(self, obj):
        """Display appointment info with icon"""
        type_icons = {
            'consultation': '💬',
            'site_visit': '🏠',
            'meeting': '🤝',
            'inspection': '🔍'
        }
        icon = type_icons.get(obj.type, '📅')
        return format_html(
            '{} <strong>{}</strong><br><small>{}</small>',
            icon, obj.title, obj.type.replace('_', ' ').title()
        )
    appointment_info.short_description = 'Appointment'

    def professional_info(self, obj):
        """Display professional info with availability"""
        status_icon = '🟢' if obj.professional.is_available else '🔴'
        professional_url = reverse('admin:authentication_user_change', args=[obj.professional.pk])
        return format_html(
            '{} <a href="{}" target="_blank">{} {}</a><br>'
            '<small>{} | Rating: ⭐ {:.1f}</small>',
            status_icon,
            professional_url,
            obj.professional.first_name,
            obj.professional.last_name,
            obj.professional.user_type.replace('_', ' ').title(),
            obj.professional.rating_average or 0
        )
    professional_info.short_description = 'Professional'

    def client_info(self, obj):
        """Display client info"""
        client_url = reverse('admin:authentication_user_change', args=[obj.client.pk])
        return format_html(
            '<a href="{}" target="_blank">{} {}</a><br><small>{}</small>',
            client_url,
            obj.client.first_name,
            obj.client.last_name,
            obj.client.email
        )
    client_info.short_description = 'Client'

    def schedule_info(self, obj):
        """Display schedule with time remaining"""
        appointment_datetime = datetime.combine(obj.date, obj.time)
        now = datetime.now()
        
        if appointment_datetime > now:
            time_diff = appointment_datetime - now
            if time_diff.days > 0:
                time_until = f"In {time_diff.days} days"
                color = "green"
            elif time_diff.seconds > 3600:
                hours = time_diff.seconds // 3600
                time_until = f"In {hours}h"
                color = "orange"
            else:
                minutes = time_diff.seconds // 60
                time_until = f"In {minutes}m"
                color = "red"
        else:
            time_until = "Past"
            color = "gray"
            
        return format_html(
            '<strong>{}</strong><br><strong>{}</strong><br>'
            '<small style="color: {};">{}</small>',
            obj.date.strftime('%b %d, %Y'),
            obj.time.strftime('%I:%M %p'),
            color,
            time_until
        )
    schedule_info.short_description = 'Schedule'

    def status_badge(self, obj):
        """Display status with colored badge"""
        colors = {
            'scheduled': '#007bff',
            'confirmed': '#28a745',
            'cancelled': '#dc3545',
            'completed': '#6c757d'
        }
        color = colors.get(obj.status, '#6c757d')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 8px; '
            'border-radius: 12px; font-size: 11px; font-weight: bold;">{}</span>',
            color,
            obj.status.upper()
        )
    status_badge.short_description = 'Status'

    def duration_display(self, obj):
        """Display duration in readable format"""
        hours = obj.duration // 60
        minutes = obj.duration % 60
        if hours > 0:
            return f"{hours}h {minutes}m" if minutes > 0 else f"{hours}h"
        return f"{minutes}m"
    duration_display.short_description = 'Duration'

    def actions_buttons(self, obj):
        """Display action buttons"""
        buttons = []
        
        if obj.status == 'scheduled':
            buttons.append(
                f'<a href="/admin/calendar_app/appointment/{obj.pk}/confirm/" '
                f'style="background: #28a745; color: white; padding: 2px 6px; '
                f'border-radius: 3px; text-decoration: none; font-size: 10px;">✓ Confirm</a>'
            )
        
        if obj.status in ['scheduled', 'confirmed']:
            buttons.append(
                f'<a href="/admin/calendar_app/appointment/{obj.pk}/cancel/" '
                f'style="background: #dc3545; color: white; padding: 2px 6px; '
                f'border-radius: 3px; text-decoration: none; font-size: 10px;">✗ Cancel</a>'
            )
            buttons.append(
                f'<a href="/admin/calendar_app/appointment/{obj.pk}/complete/" '
                f'style="background: #6c757d; color: white; padding: 2px 6px; '
                f'border-radius: 3px; text-decoration: none; font-size: 10px;">✓ Complete</a>'
            )
        
        return format_html(' '.join(buttons))
    actions_buttons.short_description = 'Actions'

    def conflict_check(self, obj):
        """Check for appointment conflicts"""
        conflicts = Appointment.objects.filter(
            professional=obj.professional,
            date=obj.date,
            status__in=['scheduled', 'confirmed']
        ).exclude(pk=obj.pk)
        
        conflict_found = False
        for conflict in conflicts:
            # Check time overlap
            obj_start = datetime.combine(obj.date, obj.time)
            obj_end = obj_start + timedelta(minutes=obj.duration)
            
            conflict_start = datetime.combine(conflict.date, conflict.time)
            conflict_end = conflict_start + timedelta(minutes=conflict.duration)
            
            if (obj_start < conflict_end and obj_end > conflict_start):
                conflict_found = True
                break
        
        if conflict_found:
            return format_html(
                '<span style="color: red; font-weight: bold;">⚠️ CONFLICT DETECTED</span>'
            )
        return format_html('<span style="color: green;">✅ No Conflicts</span>')
    conflict_check.short_description = 'Conflicts'

    def professional_availability(self, obj):
        """Show professional availability status"""
        if obj.professional.is_available:
            return format_html('<span style="color: green;">🟢 Available</span>')
        return format_html('<span style="color: red;">🔴 Unavailable</span>')
    professional_availability.short_description = 'Professional Status'

    def appointment_stats(self, obj):
        """Display appointment statistics"""
        professional = obj.professional
        today = date.today()
        
        # Get statistics
        total_appointments = Appointment.objects.filter(professional=professional).count()
        completed_appointments = Appointment.objects.filter(
            professional=professional, status='completed'
        ).count()
        upcoming_appointments = Appointment.objects.filter(
            professional=professional, 
            date__gte=today,
            status__in=['scheduled', 'confirmed']
        ).count()
        
        completion_rate = (completed_appointments / total_appointments * 100) if total_appointments > 0 else 0
        
        return format_html(
            '<div style="background: #f8f9fa; padding: 10px; border-radius: 5px;">'
            '<strong>📊 Professional Statistics:</strong><br>'
            '• Total Appointments: <strong>{}</strong><br>'
            '• Completed: <strong>{}</strong><br>'
            '• Upcoming: <strong>{}</strong><br>'
            '• Completion Rate: <strong>{:.1f}%</strong><br>'
            '• Rating: <strong>⭐ {:.1f}</strong>'
            '</div>',
            total_appointments,
            completed_appointments,
            upcoming_appointments,
            completion_rate,
            professional.rating_average or 0
        )
    appointment_stats.short_description = 'Statistics'

    # Admin Actions
    def confirm_appointments(self, request, queryset):
        """Confirm selected appointments"""
        updated = queryset.filter(status='scheduled').update(status='confirmed')
        messages.success(request, f'{updated} appointments confirmed successfully.')
    confirm_appointments.short_description = '✓ Confirm selected appointments'

    def cancel_appointments(self, request, queryset):
        """Cancel selected appointments"""
        updated = queryset.filter(status__in=['scheduled', 'confirmed']).update(status='cancelled')
        messages.warning(request, f'{updated} appointments cancelled.')
    cancel_appointments.short_description = '✗ Cancel selected appointments'

    def complete_appointments(self, request, queryset):
        """Mark selected appointments as completed"""
        updated = queryset.filter(status__in=['scheduled', 'confirmed']).update(status='completed')
        messages.success(request, f'{updated} appointments marked as completed.')
    complete_appointments.short_description = '✓ Mark as completed'

    def send_reminders(self, request, queryset):
        """Send reminders for upcoming appointments"""
        upcoming = queryset.filter(
            date__gte=date.today(),
            status__in=['scheduled', 'confirmed']
        )
        count = upcoming.count()
        # Here you would implement actual reminder sending
        messages.info(request, f'Reminders sent for {count} upcoming appointments.')
    send_reminders.short_description = '📧 Send reminders'

    def changelist_view(self, request, extra_context=None):
        """Enhanced changelist with statistics"""
        extra_context = extra_context or {}
        
        # Get appointment statistics
        today = date.today()
        tomorrow = today + timedelta(days=1)
        
        stats = {
            'today_appointments': Appointment.objects.filter(date=today).count(),
            'tomorrow_appointments': Appointment.objects.filter(date=tomorrow).count(),
            'pending_confirmations': Appointment.objects.filter(status='scheduled').count(),
            'active_professionals': Appointment.objects.filter(
                professional__is_available=True
            ).values('professional').distinct().count(),
        }
        
        extra_context['appointment_stats'] = stats
        
        return super().changelist_view(request, extra_context)


class ProfessionalAvailabilityInline(admin.TabularInline):
    """Inline for professional availability"""
    model = ProfessionalAvailability
    extra = 7  # One for each day of week
    max_num = 7
    fields = ['weekday', 'start_time', 'end_time', 'break_start', 'break_end', 'is_available']


@admin.register(ProfessionalAvailability)
class ProfessionalAvailabilityAdmin(admin.ModelAdmin):
    list_display = [
        'professional_name', 'weekday_display', 'time_range', 
        'break_display', 'availability_status', 'last_updated'
    ]
    list_filter = [
        'weekday', 'is_available', ProfessionalFilter, 'professional__is_available'
    ]
    search_fields = [
        'professional__first_name', 'professional__last_name',
        'professional__email', 'professional__company_name'
    ]
    ordering = ['professional', 'weekday']
    list_per_page = 50
    actions = ['enable_availability', 'disable_availability', 'copy_schedule']
    
    fieldsets = (
        ('👤 Professional', {
            'fields': ('professional',),
            'classes': ('wide',)
        }),
        ('📅 Schedule', {
            'fields': ('weekday', 'start_time', 'end_time', 'is_available'),
            'classes': ('wide',)
        }),
        ('☕ Break Time', {
            'fields': ('break_start', 'break_end'),
            'classes': ('collapse', 'wide'),
            'description': 'Optional lunch/break time during working hours'
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('professional')

    def professional_name(self, obj):
        """Display professional with link"""
        professional_url = reverse('admin:authentication_user_change', args=[obj.professional.pk])
        status_icon = '🟢' if obj.professional.is_available else '🔴'
        return format_html(
            '{} <a href="{}" target="_blank">{}</a>',
            status_icon,
            professional_url,
            obj.professional.get_full_name()
        )
    professional_name.short_description = 'Professional'

    def weekday_display(self, obj):
        """Display weekday with icon"""
        weekday_icons = {
            0: '📅 Monday',
            1: '📅 Tuesday', 
            2: '📅 Wednesday',
            3: '📅 Thursday',
            4: '📅 Friday',
            5: '📅 Saturday',
            6: '📅 Sunday'
        }
        return weekday_icons.get(obj.weekday, obj.get_weekday_display())
    weekday_display.short_description = 'Day'

    def time_range(self, obj):
        """Display time range"""
        return format_html(
            '<strong>{} - {}</strong>',
            obj.start_time.strftime('%I:%M %p'),
            obj.end_time.strftime('%I:%M %p')
        )
    time_range.short_description = 'Working Hours'

    def break_display(self, obj):
        """Display break time"""
        if obj.break_start and obj.break_end:
            return format_html(
                '<small>☕ {} - {}</small>',
                obj.break_start.strftime('%I:%M %p'),
                obj.break_end.strftime('%I:%M %p')
            )
        return format_html('<small style="color: gray;">No break</small>')
    break_display.short_description = 'Break Time'

    def availability_status(self, obj):
        """Display availability status"""
        if obj.is_available:
            return format_html('<span style="color: green;">✅ Available</span>')
        return format_html('<span style="color: red;">❌ Unavailable</span>')
    availability_status.short_description = 'Status'

    def last_updated(self, obj):
        """Display last update time"""
        return obj.updated_at.strftime('%b %d, %Y %I:%M %p')
    last_updated.short_description = 'Last Updated'

    # Admin Actions
    def enable_availability(self, request, queryset):
        """Enable availability for selected schedules"""
        updated = queryset.update(is_available=True)
        messages.success(request, f'{updated} schedules enabled.')
    enable_availability.short_description = '✅ Enable availability'

    def disable_availability(self, request, queryset):
        """Disable availability for selected schedules"""
        updated = queryset.update(is_available=False)
        messages.warning(request, f'{updated} schedules disabled.')
    disable_availability.short_description = '❌ Disable availability'

    def copy_schedule(self, request, queryset):
        """Copy schedule to other days"""
        # This would open a form to select target days
        messages.info(request, 'Schedule copy feature - to be implemented')
    copy_schedule.short_description = '📋 Copy schedule'


@admin.register(UnavailableDate)
class UnavailableDateAdmin(admin.ModelAdmin):
    list_display = [
        'professional_name', 'date_display', 'unavailability_type', 
        'time_range', 'reason_display', 'created_display'
    ]
    list_filter = [
        'is_full_day', 'date', ProfessionalFilter, 'created_at'
    ]
    search_fields = [
        'professional__first_name', 'professional__last_name',
        'professional__email', 'reason'
    ]
    ordering = ['-date']
    date_hierarchy = 'date'
    actions = ['remove_unavailability']
    
    fieldsets = (
        ('👤 Professional', {
            'fields': ('professional',),
            'classes': ('wide',)
        }),
        ('📅 Unavailable Date', {
            'fields': ('date', 'is_full_day', 'reason'),
            'classes': ('wide',)
        }),
        ('🕐 Partial Unavailability', {
            'fields': ('start_time', 'end_time'),
            'classes': ('collapse', 'wide'),
            'description': 'Only fill if not full day unavailability'
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('professional')

    def professional_name(self, obj):
        """Display professional with link"""
        professional_url = reverse('admin:authentication_user_change', args=[obj.professional.pk])
        return format_html(
            '<a href="{}" target="_blank">{}</a>',
            professional_url,
            obj.professional.get_full_name()
        )
    professional_name.short_description = 'Professional'

    def date_display(self, obj):
        """Display date with day of week"""
        return format_html(
            '<strong>{}</strong><br><small>{}</small>',
            obj.date.strftime('%b %d, %Y'),
            obj.date.strftime('%A')
        )
    date_display.short_description = 'Date'

    def unavailability_type(self, obj):
        """Display unavailability type"""
        if obj.is_full_day:
            return format_html('<span style="color: red;">🚫 Full Day</span>')
        return format_html('<span style="color: orange;">⏰ Partial</span>')
    unavailability_type.short_description = 'Type'

    def time_range(self, obj):
        """Display time range for partial unavailability"""
        if not obj.is_full_day and obj.start_time and obj.end_time:
            return format_html(
                '<strong>{} - {}</strong>',
                obj.start_time.strftime('%I:%M %p'),
                obj.end_time.strftime('%I:%M %p')
            )
        return format_html('<small style="color: gray;">-</small>')
    time_range.short_description = 'Time Range'

    def reason_display(self, obj):
        """Display reason"""
        if obj.reason:
            return obj.reason[:50] + '...' if len(obj.reason) > 50 else obj.reason
        return format_html('<small style="color: gray;">No reason</small>')
    reason_display.short_description = 'Reason'

    def created_display(self, obj):
        """Display creation time"""
        return obj.created_at.strftime('%b %d, %Y')
    created_display.short_description = 'Created'

    def remove_unavailability(self, request, queryset):
        """Remove selected unavailable dates"""
        count = queryset.count()
        queryset.delete()
        messages.success(request, f'{count} unavailable dates removed.')
    remove_unavailability.short_description = '🗑️ Remove unavailability'


@admin.register(AppointmentTemplate)
class AppointmentTemplateAdmin(admin.ModelAdmin):
    list_display = [
        'template_info', 'professional_name', 'duration_price', 
        'template_settings', 'activity_status', 'last_updated'
    ]
    list_filter = [
        'type', 'is_active', 'requires_confirmation', ProfessionalFilter
    ]
    search_fields = [
        'title', 'description', 'professional__first_name', 
        'professional__last_name', 'professional__email'
    ]
    ordering = ['professional', 'title']
    actions = ['activate_templates', 'deactivate_templates', 'duplicate_templates']
    
    fieldsets = (
        ('👤 Professional', {
            'fields': ('professional',),
            'classes': ('wide',)
        }),
        ('📋 Template Information', {
            'fields': ('title', 'description', 'type', 'duration', 'price'),
            'classes': ('wide',)
        }),
        ('⚙️ Template Settings', {
            'fields': ('is_active', 'requires_confirmation', 'buffer_time_before', 'buffer_time_after'),
            'classes': ('wide',)
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('professional')

    def template_info(self, obj):
        """Display template info with icon"""
        type_icons = {
            'consultation': '💬',
            'site_visit': '🏠',
            'meeting': '🤝',
            'inspection': '🔍'
        }
        icon = type_icons.get(obj.type, '📋')
        return format_html(
            '{} <strong>{}</strong><br><small>{}</small>',
            icon, obj.title, obj.type.replace('_', ' ').title()
        )
    template_info.short_description = 'Template'

    def professional_name(self, obj):
        """Display professional with link"""
        professional_url = reverse('admin:authentication_user_change', args=[obj.professional.pk])
        return format_html(
            '<a href="{}" target="_blank">{}</a>',
            professional_url,
            obj.professional.get_full_name()
        )
    professional_name.short_description = 'Professional'

    def duration_price(self, obj):
        """Display duration and price"""
        hours = obj.duration // 60
        minutes = obj.duration % 60
        duration_text = f"{hours}h {minutes}m" if hours > 0 else f"{minutes}m"
        
        if obj.price:
            return format_html(
                '<strong>{}</strong><br><small>${:.2f}</small>',
                duration_text, obj.price
            )
        return format_html('<strong>{}</strong><br><small>No price set</small>', duration_text)
    duration_price.short_description = 'Duration / Price'

    def template_settings(self, obj):
        """Display template settings"""
        settings = []
        if obj.requires_confirmation:
            settings.append('✅ Confirmation Required')
        if obj.buffer_time_before > 0:
            settings.append(f'⏰ {obj.buffer_time_before}m before')
        if obj.buffer_time_after > 0:
            settings.append(f'⏰ {obj.buffer_time_after}m after')
        
        if settings:
            return format_html('<small>{}</small>', '<br>'.join(settings))
        return format_html('<small style="color: gray;">Default settings</small>')
    template_settings.short_description = 'Settings'

    def activity_status(self, obj):
        """Display activity status"""
        if obj.is_active:
            return format_html('<span style="color: green;">✅ Active</span>')
        return format_html('<span style="color: red;">❌ Inactive</span>')
    activity_status.short_description = 'Status'

    def last_updated(self, obj):
        """Display last update time"""
        return obj.updated_at.strftime('%b %d, %Y')
    last_updated.short_description = 'Updated'

    # Admin Actions
    def activate_templates(self, request, queryset):
        """Activate selected templates"""
        updated = queryset.update(is_active=True)
        messages.success(request, f'{updated} templates activated.')
    activate_templates.short_description = '✅ Activate templates'

    def deactivate_templates(self, request, queryset):
        """Deactivate selected templates"""
        updated = queryset.update(is_active=False)
        messages.warning(request, f'{updated} templates deactivated.')
    deactivate_templates.short_description = '❌ Deactivate templates'

    def duplicate_templates(self, request, queryset):
        """Duplicate selected templates"""
        count = 0
        for template in queryset:
            template.pk = None
            template.title = f"{template.title} (Copy)"
            template.save()
            count += 1
        messages.success(request, f'{count} templates duplicated.')
    duplicate_templates.short_description = '📋 Duplicate templates' 