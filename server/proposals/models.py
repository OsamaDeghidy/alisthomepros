from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from decimal import Decimal
import uuid

User = get_user_model()


class Proposal(models.Model):
    """
    Model for project proposals
    """
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('withdrawn', 'Withdrawn'),
        ('expired', 'Expired'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('normal', 'Normal'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    # Basic Information
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(
        'projects.Project',
        on_delete=models.CASCADE,
        related_name='proposals',
        verbose_name='Project'
    )
    professional = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='submitted_proposals',
        verbose_name='Professional'
    )
    
    # Proposal Details
    cover_letter = models.TextField(
        verbose_name='Cover Letter',
        help_text='Detailed explanation of how to execute the project'
    )
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        verbose_name='Amount Required',
        help_text='Total amount in USD'
    )
    currency = models.CharField(
        max_length=3,
        default='USD',
        verbose_name='Currency'
    )
    timeline = models.CharField(
        max_length=100,
        verbose_name='Timeline',
        help_text='e.g., 2-3 weeks'
    )
    estimated_hours = models.PositiveIntegerField(
        null=True,
        blank=True,
        verbose_name='Estimated Hours'
    )
    
    # Proposal Status
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name='Proposal Status'
    )
    priority = models.CharField(
        max_length=20,
        choices=PRIORITY_CHOICES,
        default='normal',
        verbose_name='Priority'
    )
    
    # Additional Information
    is_featured = models.BooleanField(
        default=False,
        verbose_name='Featured Proposal',
        help_text='Featured proposal appears first'
    )
    response_time = models.CharField(
        max_length=50,
        blank=True,
        verbose_name='Response Time',
        help_text='e.g., within an hour'
    )
    includes_materials = models.BooleanField(
        default=False,
        verbose_name='Includes Materials'
    )
    warranty_period = models.CharField(
        max_length=50,
        blank=True,
        verbose_name='Warranty Period'
    )
    
    # Files and Attachments
    portfolio_samples = models.JSONField(
        default=list,
        blank=True,
        verbose_name='Portfolio Samples'
    )
    attachments = models.JSONField(
        default=list,
        blank=True,
        verbose_name='Attachments'
    )
    
    # Response Information
    client_response = models.TextField(
        blank=True,
        verbose_name='Client Response'
    )
    rejection_reason = models.CharField(
        max_length=255,
        blank=True,
        verbose_name='Rejection Reason'
    )
    
    # Date Tracking
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Created At')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Updated At')
    responded_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='Response Date'
    )
    expires_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='Expiration Date'
    )
    
    # Contract Reference
    contract = models.ForeignKey(
        'contracts.Contract',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='proposal',
        verbose_name='Contract'
    )
    
    # Professional Information
    professional_rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name='Professional Rating'
    )
    professional_reviews_count = models.PositiveIntegerField(
        default=0,
        verbose_name='Reviews Count'
    )
    professional_completion_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name='Project Completion Rate'
    )
    
    class Meta:
        db_table = 'proposals'
        verbose_name = 'Proposal'
        verbose_name_plural = 'Proposals'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['project', 'status']),
            models.Index(fields=['professional', 'status']),
            models.Index(fields=['status', 'created_at']),
            models.Index(fields=['is_featured', 'created_at']),
            models.Index(fields=['amount']),
        ]
        unique_together = ['project', 'professional']
    
    def __str__(self):
        return f"{self.professional.get_full_name()} - {self.project.title} - ${self.amount}"
    
    def save(self, *args, **kwargs):
        # Update response time when status changes
        if self.pk:
            try:
                old_proposal = Proposal.objects.get(pk=self.pk)
                if old_proposal.status != self.status and self.status in ['accepted', 'rejected']:
                    self.responded_at = timezone.now()
            except Proposal.DoesNotExist:
                # New proposal, no need to compare status
                pass
        
        # Save proposal first
        is_new = not self.pk
        super().save(*args, **kwargs)
        
        # Update proposal counter in project after saving
        if is_new:
            try:
                self.project.increment_proposals()
            except:
                # If increment_proposals function doesn't exist, ignore error
                pass
    
    def get_status_display_en(self):
        """Get proposal status in English"""
        status_dict = {
            'pending': 'Pending',
            'accepted': 'Accepted',
            'rejected': 'Rejected',
            'withdrawn': 'Withdrawn',
            'expired': 'Expired',
        }
        return status_dict.get(self.status, self.status)
    
    def is_active(self):
        """Check if proposal is active"""
        return self.status == 'pending'
    
    def can_be_accepted(self):
        """Check if proposal can be accepted"""
        return self.status == 'pending' and self.project.can_receive_proposals()
    
    def can_be_rejected(self):
        """Check if proposal can be rejected"""
        return self.status == 'pending'
    
    def can_be_withdrawn(self):
        """Check if proposal can be withdrawn"""
        return self.status == 'pending'
    
    def get_response_time_display(self):
        """Display response time"""
        if self.response_time:
            return self.response_time
        
        if self.created_at:
            hours_since = (timezone.now() - self.created_at).total_seconds() / 3600
            if hours_since < 1:
                return "Within an hour"
            elif hours_since < 24:
                return f"Within {int(hours_since)} hours"
            else:
                return f"Within {int(hours_since/24)} days"
        
        return "Not specified"


class ProposalMilestone(models.Model):
    """
    Proposal milestones - dividing project into phases
    """
    proposal = models.ForeignKey(
        Proposal,
        on_delete=models.CASCADE,
        related_name='milestones',
        verbose_name='Proposal'
    )
    title = models.CharField(
        max_length=255,
        verbose_name='Milestone Title'
    )
    description = models.TextField(
        blank=True,
        verbose_name='Milestone Description'
    )
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        verbose_name='Milestone Amount'
    )
    timeline = models.CharField(
        max_length=100,
        verbose_name='Milestone Duration'
    )
    order = models.PositiveIntegerField(
        default=1,
        verbose_name='Milestone Order'
    )
    
    # Important dates
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'proposal_milestones'
        verbose_name = 'Proposal Milestone'
        verbose_name_plural = 'Proposal Milestones'
        ordering = ['proposal', 'order']
        unique_together = ['proposal', 'order']
    
    def __str__(self):
        return f"{self.proposal} - {self.title} - ${self.amount}"


class ProposalAttachment(models.Model):
    """
    Proposal attachments
    """
    FILE_TYPE_CHOICES = [
        ('image', 'Image'),
        ('document', 'Document'),
        ('video', 'Video'),
        ('other', 'Other'),
    ]
    
    proposal = models.ForeignKey(
        Proposal,
        on_delete=models.CASCADE,
        related_name='attachments_files',
        verbose_name='Proposal'
    )
    file = models.FileField(
        upload_to='proposal_attachments/',
        verbose_name='File'
    )
    name = models.CharField(
        max_length=255,
        verbose_name='File Name'
    )
    file_type = models.CharField(
        max_length=20,
        choices=FILE_TYPE_CHOICES,
        default='document',
        verbose_name='File Type'
    )
    file_size = models.PositiveIntegerField(
        null=True,
        blank=True,
        verbose_name='File Size (bytes)'
    )
    description = models.TextField(
        blank=True,
        verbose_name='File Description'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'proposal_attachments'
        verbose_name = 'Proposal Attachment'
        verbose_name_plural = 'Proposal Attachments'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.proposal} - {self.name}"
    
    def get_file_size_display(self):
        """Display file size in readable format"""
        if not self.file_size:
            return "Not specified"
        
        size = self.file_size
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size < 1024.0:
                return f"{size:.1f} {unit}"
            size /= 1024.0
        return f"{size:.1f} TB"


class ProposalView(models.Model):
    """
    Track proposal views
    """
    proposal = models.ForeignKey(
        Proposal,
        on_delete=models.CASCADE,
        related_name='views',
        verbose_name='Proposal'
    )
    viewer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name='Viewer'
    )
    viewed_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(
        null=True,
        blank=True,
        verbose_name='IP Address'
    )
    
    class Meta:
        db_table = 'proposal_views'
        verbose_name = 'Proposal View'
        verbose_name_plural = 'Proposal Views'
        unique_together = ['proposal', 'viewer']
        ordering = ['-viewed_at']
    
    def __str__(self):
        return f"{self.proposal} - {self.viewer.get_full_name()}"
