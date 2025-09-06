from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
import uuid

User = get_user_model()


class Dispute(models.Model):
    """
    نموذج النزاعات
    """
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_review', 'In Review'),
        ('resolved', 'Resolved'),
        ('escalated', 'Escalated'),
        ('closed', 'Closed'),
    ]
    
    DISPUTE_TYPE_CHOICES = [
        ('payment', 'Payment Dispute'),
        ('quality', 'Quality Dispute'),
        ('delivery', 'Delivery Dispute'),
        ('communication', 'Communication Dispute'),
        ('contract_breach', 'Contract Breach'),
        ('other', 'Other'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    # Basic Information
    dispute_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField()
    dispute_type = models.CharField(max_length=20, choices=DISPUTE_TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    
    # Parties involved
    raised_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='disputes_raised'
    )
    against = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='disputes_against'
    )
    
    # Related objects
    contract = models.ForeignKey(
        'contracts.Contract',
        on_delete=models.CASCADE,
        related_name='disputes',
        null=True,
        blank=True
    )
    milestone = models.ForeignKey(
        'contracts.ContractMilestone',
        on_delete=models.CASCADE,
        related_name='disputes',
        null=True,
        blank=True
    )
    payment = models.ForeignKey(
        'payments.Payment',
        on_delete=models.CASCADE,
        related_name='disputes',
        null=True,
        blank=True
    )
    
    # Resolution details
    resolved_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        related_name='disputes_resolved',
        null=True,
        blank=True
    )
    resolution_notes = models.TextField(blank=True)
    resolution_date = models.DateTimeField(null=True, blank=True)
    
    # Admin/Support assignment
    assigned_to = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        related_name='assigned_disputes',
        null=True,
        blank=True,
        limit_choices_to={'is_staff': True}
    )
    
    # Financial impact
    disputed_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )
    refund_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    due_date = models.DateTimeField(null=True, blank=True)
    
    # Metadata
    evidence_files = models.JSONField(default=list, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'created_at']),
            models.Index(fields=['raised_by', 'status']),
            models.Index(fields=['against', 'status']),
            models.Index(fields=['contract', 'status']),
        ]
    
    def __str__(self):
        return f"Dispute #{self.dispute_id.hex[:8]} - {self.title}"
    
    def save(self, *args, **kwargs):
        if self.status == 'resolved' and not self.resolution_date:
            self.resolution_date = timezone.now()
        super().save(*args, **kwargs)


class DisputeMessage(models.Model):
    """
    رسائل النزاع
    """
    MESSAGE_TYPE_CHOICES = [
        ('message', 'Message'),
        ('evidence', 'Evidence'),
        ('resolution', 'Resolution'),
        ('system', 'System'),
    ]
    
    dispute = models.ForeignKey(
        Dispute,
        on_delete=models.CASCADE,
        related_name='messages'
    )
    sender = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='dispute_messages'
    )
    
    message_type = models.CharField(max_length=20, choices=MESSAGE_TYPE_CHOICES, default='message')
    content = models.TextField()
    attachments = models.JSONField(default=list, blank=True)
    
    # Visibility
    is_internal = models.BooleanField(default=False)  # Only visible to admin/support
    is_system_message = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f"Message in Dispute #{self.dispute.dispute_id.hex[:8]} by {self.sender.get_full_name()}"


class DisputeEvidence(models.Model):
    """
    أدلة النزاع
    """
    EVIDENCE_TYPE_CHOICES = [
        ('document', 'Document'),
        ('image', 'Image'),
        ('video', 'Video'),
        ('audio', 'Audio'),
        ('screenshot', 'Screenshot'),
        ('contract', 'Contract'),
        ('communication', 'Communication'),
        ('other', 'Other'),
    ]
    
    dispute = models.ForeignKey(
        Dispute,
        on_delete=models.CASCADE,
        related_name='evidence'
    )
    uploaded_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='uploaded_evidence'
    )
    
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    evidence_type = models.CharField(max_length=20, choices=EVIDENCE_TYPE_CHOICES)
    file_path = models.FileField(upload_to='disputes/evidence/', null=True, blank=True)
    file_url = models.URLField(blank=True)
    file_size = models.PositiveIntegerField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Evidence: {self.title} for Dispute #{self.dispute.dispute_id.hex[:8]}"


class DisputeResolution(models.Model):
    """
    قرارات حل النزاعات
    """
    RESOLUTION_TYPE_CHOICES = [
        ('refund', 'Full Refund'),
        ('partial_refund', 'Partial Refund'),
        ('rework', 'Rework Required'),
        ('mediation', 'Mediation'),
        ('favor_client', 'Favor Client'),
        ('favor_professional', 'Favor Professional'),
        ('compromise', 'Compromise'),
        ('dismissed', 'Dismissed'),
    ]
    
    dispute = models.OneToOneField(
        Dispute,
        on_delete=models.CASCADE,
        related_name='resolution'
    )
    resolution_type = models.CharField(max_length=20, choices=RESOLUTION_TYPE_CHOICES)
    resolution_summary = models.TextField()
    resolution_details = models.TextField(blank=True)
    
    # Financial resolution
    refund_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )
    penalty_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )
    
    # Resolution timeline
    resolved_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='resolutions_made'
    )
    resolved_at = models.DateTimeField(auto_now_add=True)
    
    # Implementation
    is_implemented = models.BooleanField(default=False)
    implementation_date = models.DateTimeField(null=True, blank=True)
    implementation_notes = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-resolved_at']
    
    def __str__(self):
        return f"Resolution for Dispute #{self.dispute.dispute_id.hex[:8]} - {self.resolution_type}"