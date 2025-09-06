from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class PortfolioItem(models.Model):
    """معرض الأعمال"""
    professional = models.ForeignKey(User, on_delete=models.CASCADE, related_name='portfolio_items')
    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=100)
    project_duration = models.CharField(max_length=100, blank=True)
    project_cost = models.CharField(max_length=100, blank=True)
    completion_date = models.DateField()
    featured = models.BooleanField(default=False)
    
    likes = models.PositiveIntegerField(default=0)
    views = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'portfolio_items'
        verbose_name = 'Portfolio Item'
        verbose_name_plural = 'Portfolio Items'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.professional.username} - {self.title}"


class PortfolioImage(models.Model):
    """صور المعرض"""
    portfolio_item = models.ForeignKey(PortfolioItem, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='portfolio/')
    caption = models.CharField(max_length=255, blank=True)
    is_primary = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'portfolio_images'
        verbose_name = 'Portfolio Image'
        verbose_name_plural = 'Portfolio Images'
        ordering = ['order']
    
    def __str__(self):
        return f"Image for {self.portfolio_item.title}" 