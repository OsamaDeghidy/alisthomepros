from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from django.urls import reverse
from django.utils.text import slugify
import uuid

User = get_user_model()


class Category(models.Model):
    """
    تصنيفات المشاريع
    """
    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=100, blank=True, help_text='CSS class for icon')
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'project_categories'
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'
        ordering = ['order', 'name']
    
    def __str__(self):
        return self.name


class Project(models.Model):
    """
    نموذج المشاريع
    """
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('paused', 'Paused'),
    ]
    
    URGENCY_CHOICES = [
        ('low', 'Low'),
        ('normal', 'Normal'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    BUDGET_TYPE_CHOICES = [
        ('fixed', 'Fixed Price'),
        ('hourly', 'Hourly Rate'),
        ('estimate', 'Estimate'),
    ]
    
    # Basic Information
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField()
    client = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='posted_projects',
        limit_choices_to={'user_type': 'client'}
    )
    
    # Project Details
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        related_name='projects'
    )
    
    location = models.CharField(
        max_length=255,
        help_text='Project location/address'
    )
    
    # Budget Information
    budget_type = models.CharField(
        max_length=20,
        choices=BUDGET_TYPE_CHOICES,
        default='fixed'
    )
    
    budget_min = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0)]
    )
    
    budget_max = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0)]
    )
    
    budget_display = models.CharField(
        max_length=100,
        blank=True,
        help_text='Display budget (e.g., "$5,000 - $10,000")'
    )
    
    # Timeline
    timeline = models.CharField(
        max_length=255,
        blank=True,
        help_text='Project timeline (e.g., "2-4 weeks")'
    )
    
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    
    # Requirements
    required_skills = models.JSONField(
        default=list,
        blank=True,
        help_text='List of required skills'
    )
    
    required_roles = models.JSONField(
        default=list,
        blank=True,
        help_text='List of required user roles'
    )
    
    additional_requirements = models.TextField(
        blank=True,
        help_text='Additional requirements and special instructions'
    )
    
    # Status and Priority
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='draft'
    )
    
    urgency = models.CharField(
        max_length=20,
        choices=URGENCY_CHOICES,
        default='normal'
    )
    
    # Project Flags
    is_featured = models.BooleanField(default=False)
    is_remote_allowed = models.BooleanField(default=False)
    requires_license = models.BooleanField(default=False)
    requires_insurance = models.BooleanField(default=False)
    is_paid = models.BooleanField(default=False, help_text='Whether the project has been paid for')
    
    # Engagement
    views_count = models.PositiveIntegerField(default=0)
    favorites_count = models.PositiveIntegerField(default=0)
    proposals_count = models.PositiveIntegerField(default=0)
    
    # Assigned Professional
    assigned_professional = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_projects',
        limit_choices_to={'user_type__in': ['home_pro', 'specialist', 'crew_member']}
    )
    
    # Completion
    completion_percentage = models.PositiveIntegerField(
        default=0,
        validators=[MaxValueValidator(100)]
    )
    
    # Timestamps
    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'projects'
        verbose_name = 'Project'
        verbose_name_plural = 'Projects'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['category']),
            models.Index(fields=['location']),
            models.Index(fields=['client']),
            models.Index(fields=['assigned_professional']),
            models.Index(fields=['published_at']),
            models.Index(fields=['urgency']),
        ]
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title) + '-' + str(uuid.uuid4())[:8]
        
        if self.status == 'published' and not self.published_at:
            self.published_at = timezone.now()
        
        super().save(*args, **kwargs)
    
    def get_absolute_url(self):
        return reverse('projects:detail', kwargs={'slug': self.slug})
    
    def get_budget_display(self):
        """Get formatted budget display"""
        if self.budget_display:
            return self.budget_display
        
        if self.budget_min and self.budget_max:
            return f"${self.budget_min:,.0f} - ${self.budget_max:,.0f}"
        elif self.budget_min:
            return f"${self.budget_min:,.0f}+"
        else:
            return "Budget not specified"
    
    def is_active(self):
        """Check if project is active"""
        return self.status in ['published', 'in_progress']
    
    def can_receive_proposals(self):
        """Check if project can receive proposals"""
        return self.status == 'published' and not self.assigned_professional
    
    def increment_views(self):
        """Increment views count"""
        self.views_count += 1
        self.save(update_fields=['views_count'])
    
    def increment_proposals(self):
        """Increment proposals count"""
        self.proposals_count += 1
        self.save(update_fields=['proposals_count'])
    
    def update_completion(self, percentage):
        """Update completion percentage"""
        self.completion_percentage = max(0, min(100, percentage))
        if self.completion_percentage == 100:
            self.status = 'completed'
        self.save(update_fields=['completion_percentage', 'status'])


class ProjectImage(models.Model):
    """
    صور المشاريع
    """
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='images'
    )
    image = models.ImageField(upload_to='projects/')
    caption = models.CharField(max_length=255, blank=True)
    is_primary = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'project_images'
        verbose_name = 'Project Image'
        verbose_name_plural = 'Project Images'
        ordering = ['order', 'created_at']
    
    def __str__(self):
        return f"Image for {self.project.title}"


class ProjectFile(models.Model):
    """
    ملفات المشاريع
    """
    FILE_TYPE_CHOICES = [
        ('document', 'Document'),
        ('image', 'Image'),
        ('video', 'Video'),
        ('audio', 'Audio'),
        ('other', 'Other'),
    ]
    
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='files'
    )
    file = models.FileField(upload_to='projects/files/')
    filename = models.CharField(max_length=255)
    file_type = models.CharField(max_length=20, choices=FILE_TYPE_CHOICES)
    file_size = models.PositiveIntegerField()  # in bytes
    description = models.TextField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'project_files'
        verbose_name = 'Project File'
        verbose_name_plural = 'Project Files'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.filename} - {self.project.title}"
    
    def get_file_size_display(self):
        """Get human readable file size"""
        if self.file_size < 1024:
            return f"{self.file_size} bytes"
        elif self.file_size < 1024**2:
            return f"{self.file_size/1024:.1f} KB"
        elif self.file_size < 1024**3:
            return f"{self.file_size/(1024**2):.1f} MB"
        else:
            return f"{self.file_size/(1024**3):.1f} GB"


class ProjectFavorite(models.Model):
    """
    المشاريع المفضلة
    """
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='favorite_projects'
    )
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='favorited_by'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'project_favorites'
        verbose_name = 'Project Favorite'
        verbose_name_plural = 'Project Favorites'
        unique_together = ['user', 'project']
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.project.title}"


class ProjectView(models.Model):
    """
    مشاهدات المشاريع
    """
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='project_views'
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='viewed_projects'
    )
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'project_views'
        verbose_name = 'Project View'
        verbose_name_plural = 'Project Views'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['project', 'created_at']),
            models.Index(fields=['user', 'created_at']),
        ]
    
    def __str__(self):
        return f"View: {self.project.title} at {self.created_at}"


class ProjectUpdate(models.Model):
    """
    تحديثات المشاريع
    """
    UPDATE_TYPE_CHOICES = [
        ('status', 'Status Change'),
        ('progress', 'Progress Update'),
        ('milestone', 'Milestone'),
        ('general', 'General Update'),
    ]
    
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='updates'
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='project_updates'
    )
    update_type = models.CharField(
        max_length=20,
        choices=UPDATE_TYPE_CHOICES,
        default='general'
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    
    # Progress tracking
    previous_status = models.CharField(max_length=20, blank=True)
    new_status = models.CharField(max_length=20, blank=True)
    previous_completion = models.PositiveIntegerField(null=True, blank=True)
    new_completion = models.PositiveIntegerField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'project_updates'
        verbose_name = 'Project Update'
        verbose_name_plural = 'Project Updates'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.project.title} - {self.title}"

class IntakeLead(models.Model):
    """Requests from public intake/contact form."""
    full_name = models.CharField(max_length=120)
    email = models.EmailField()
    phone = models.CharField(max_length=30)
    message = models.TextField(blank=True)
    source_path = models.CharField(max_length=255, blank=True)
    language = models.CharField(max_length=10, blank=True)
    consent = models.BooleanField(default=False)
    status = models.CharField(
        max_length=20,
        choices=(
            ('new', 'New'),
            ('contacted', 'Contacted'),
            ('converted', 'Converted'),
        ),
        default='new'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'intake_leads'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.full_name} ({self.email})"
