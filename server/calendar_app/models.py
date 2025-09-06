from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Appointment(models.Model):
    """المواعيد"""
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]
    
    TYPE_CHOICES = [
        ('consultation', 'Consultation'),
        ('site_visit', 'Site Visit'),
        ('meeting', 'Meeting'),
        ('inspection', 'Inspection'),
    ]
    
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    
    professional = models.ForeignKey(User, on_delete=models.CASCADE, related_name='professional_appointments')
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='client_appointments')
    project = models.ForeignKey('projects.Project', on_delete=models.CASCADE, related_name='appointments', null=True, blank=True)
    
    date = models.DateField()
    time = models.TimeField()
    duration = models.PositiveIntegerField(help_text='Duration in minutes')
    location = models.CharField(max_length=255, blank=True)
    meeting_link = models.URLField(blank=True)
    
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='consultation')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'appointments'
        verbose_name = 'Appointment'
        verbose_name_plural = 'Appointments'
        ordering = ['date', 'time']
    
    def __str__(self):
        return f"{self.title} - {self.date} {self.time}"


class ProfessionalAvailability(models.Model):
    """Professional Availability Schedule"""
    WEEKDAY_CHOICES = [
        (0, 'Monday'),
        (1, 'Tuesday'),
        (2, 'Wednesday'),
        (3, 'Thursday'),
        (4, 'Friday'),
        (5, 'Saturday'),
        (6, 'Sunday'),
    ]
    
    professional = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='availability_schedule',
        limit_choices_to={'user_type__in': ['home_pro', 'specialist', 'crew_member']}
    )
    weekday = models.IntegerField(choices=WEEKDAY_CHOICES)
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_available = models.BooleanField(default=True)
    
    # Break times
    break_start = models.TimeField(null=True, blank=True, help_text='Lunch break start time')
    break_end = models.TimeField(null=True, blank=True, help_text='Lunch break end time')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'professional_availability'
        verbose_name = 'Professional Availability'
        verbose_name_plural = 'Professional Availability'
        unique_together = ['professional', 'weekday']
        ordering = ['professional', 'weekday']
    
    def __str__(self):
        return f"{self.professional.get_full_name()} - {self.get_weekday_display()}: {self.start_time}-{self.end_time}"


class UnavailableDate(models.Model):
    """Specific dates when professional is unavailable"""
    professional = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='unavailable_dates',
        limit_choices_to={'user_type__in': ['home_pro', 'specialist', 'crew_member']}
    )
    date = models.DateField()
    reason = models.CharField(max_length=255, blank=True)
    is_full_day = models.BooleanField(default=True)
    
    # Partial unavailability
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'unavailable_dates'
        verbose_name = 'Unavailable Date'
        verbose_name_plural = 'Unavailable Dates'
        unique_together = ['professional', 'date']
        ordering = ['date']
    
    def __str__(self):
        if self.is_full_day:
            return f"{self.professional.get_full_name()} - {self.date} (Full Day)"
        return f"{self.professional.get_full_name()} - {self.date} ({self.start_time}-{self.end_time})"


class AppointmentTemplate(models.Model):
    """Template for recurring appointments"""
    professional = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='appointment_templates',
        limit_choices_to={'user_type__in': ['home_pro', 'specialist', 'crew_member']}
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    duration = models.PositiveIntegerField(help_text='Duration in minutes')
    type = models.CharField(max_length=20, choices=Appointment.TYPE_CHOICES)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # Template settings
    is_active = models.BooleanField(default=True)
    requires_confirmation = models.BooleanField(default=True)
    buffer_time_before = models.PositiveIntegerField(default=0, help_text='Buffer time before appointment in minutes')
    buffer_time_after = models.PositiveIntegerField(default=0, help_text='Buffer time after appointment in minutes')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'appointment_templates'
        verbose_name = 'Appointment Template'
        verbose_name_plural = 'Appointment Templates'
        ordering = ['professional', 'title']
    
    def __str__(self):
        return f"{self.professional.get_full_name()} - {self.title} ({self.duration}min)" 