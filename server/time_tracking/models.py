from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class TimeEntry(models.Model):
    """إدخالات الوقت"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    project = models.ForeignKey('projects.Project', on_delete=models.CASCADE, related_name='time_entries')
    professional = models.ForeignKey(User, on_delete=models.CASCADE, related_name='project_time_entries')
    task = models.CharField(max_length=255)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    duration = models.PositiveIntegerField(help_text='Duration in minutes')
    hourly_rate = models.DecimalField(max_digits=8, decimal_places=2)
    total_cost = models.DecimalField(max_digits=10, decimal_places=2)
    notes = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'time_entries'
        verbose_name = 'Time Entry'
        verbose_name_plural = 'Time Entries'
        ordering = ['-date', '-start_time']
    
    def __str__(self):
        return f"{self.professional.username} - {self.task} - {self.date}" 