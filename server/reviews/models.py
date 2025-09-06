from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator

User = get_user_model()


class Review(models.Model):
    """Reviews System - Supports bidirectional reviews"""
    
    REVIEW_TYPE_CHOICES = [
        ('client_to_professional', 'Client to Professional'),
        ('professional_to_client', 'Professional to Client'),
    ]
    
    # Core relationships
    project = models.ForeignKey('projects.Project', on_delete=models.CASCADE, related_name='reviews', null=True, blank=True)
    contract = models.ForeignKey('contracts.Contract', on_delete=models.CASCADE, related_name='reviews', null=True, blank=True)
    
    # Review participants
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews_given')
    reviewee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews_received')
    
    # Review type and content
    review_type = models.CharField(max_length=30, choices=REVIEW_TYPE_CHOICES)
    rating = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField(blank=True)
    
    # Detailed ratings for professionals (when client reviews professional)
    quality_rating = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)], null=True, blank=True)
    communication_rating = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)], null=True, blank=True)
    timeliness_rating = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)], null=True, blank=True)
    professionalism_rating = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)], null=True, blank=True)
    
    # Detailed ratings for clients (when professional reviews client)
    cooperation_rating = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)], null=True, blank=True)
    payment_timeliness_rating = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)], null=True, blank=True)
    clarity_rating = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)], null=True, blank=True)
    
    # Additional fields
    would_recommend = models.BooleanField(default=True)
    is_public = models.BooleanField(default=True)
    helpful_count = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'reviews'
        verbose_name = 'Review'
        verbose_name_plural = 'Reviews'
        unique_together = [
            ['project', 'reviewer', 'review_type'],
            ['contract', 'reviewer', 'review_type']
        ]
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['review_type']),
            models.Index(fields=['reviewer']),
            models.Index(fields=['reviewee']),
            models.Index(fields=['rating']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.get_review_type_display()}: {self.reviewer.username} → {self.reviewee.username}"
    
    @property
    def professional(self):
        """Backward compatibility - returns the professional in the review"""
        if self.review_type == 'client_to_professional':
            return self.reviewee
        return self.reviewer
    
    @property
    def client(self):
        """Backward compatibility - returns the client in the review"""
        if self.review_type == 'client_to_professional':
            return self.reviewer
        return self.reviewee
    
    def can_be_reviewed_by(self, user):
        """Check if a user can review this project/contract"""
        if not self.project or self.project.status != 'completed':
            return False
        
        # Check if user is part of the project
        if user not in [self.project.client, self.project.professional]:
            return False
        
        # Check if review already exists
        review_type = 'client_to_professional' if user == self.project.client else 'professional_to_client'
        existing_review = Review.objects.filter(
            project=self.project,
            reviewer=user,
            review_type=review_type
        ).exists()
        
        return not existing_review
