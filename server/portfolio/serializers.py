from rest_framework import serializers
from .models import PortfolioItem, PortfolioImage


class PortfolioImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioImage
        fields = ['id', 'image', 'caption', 'is_primary', 'order']


class PortfolioItemSerializer(serializers.ModelSerializer):
    images = PortfolioImageSerializer(many=True, read_only=True)
    professional_info = serializers.SerializerMethodField()
    
    class Meta:
        model = PortfolioItem
        fields = [
            'id', 'title', 'description', 'category', 'project_duration',
            'project_cost', 'completion_date', 'featured', 'likes',
            'views', 'images', 'professional_info', 'created_at'
        ]
        read_only_fields = ['id', 'likes', 'views', 'created_at']
    
    def get_professional_info(self, obj):
        return {
            'id': obj.professional.id,
            'name': obj.professional.get_full_name(),
            'avatar': obj.professional.avatar.url if obj.professional.avatar else None
        }


class PortfolioItemCreateSerializer(serializers.ModelSerializer):
    project_url = serializers.URLField(required=False, allow_blank=True)
    technologies = serializers.ListField(
        child=serializers.CharField(max_length=100),
        required=False,
        allow_empty=True
    )
    
    class Meta:
        model = PortfolioItem
        fields = [
            'title', 'description', 'category', 'project_duration',
            'project_cost', 'completion_date', 'featured', 'project_url', 'technologies'
        ]
    
    def create(self, validated_data):
        # Remove fields that are not in the model
        project_url = validated_data.pop('project_url', '')
        technologies = validated_data.pop('technologies', [])
        
        validated_data['professional'] = self.context['request'].user
        portfolio_item = super().create(validated_data)
        
        # Store additional data in description or create separate fields if needed
        if project_url or technologies:
            additional_info = ''
            if project_url:
                additional_info += f'\n\nProject URL: {project_url}'
            if technologies:
                additional_info += f'\n\nTechnologies: {", ".join(technologies)}'
            
            portfolio_item.description += additional_info
            portfolio_item.save()
        
        return portfolio_item