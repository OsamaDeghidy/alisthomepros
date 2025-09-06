from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import TimeEntry

User = get_user_model()


class TimeEntrySerializer(serializers.ModelSerializer):
    professional = serializers.SerializerMethodField()
    project_info = serializers.SerializerMethodField()
    
    class Meta:
        model = TimeEntry
        fields = [
            'id', 'project_info', 'professional', 'task', 'date',
            'start_time', 'end_time', 'duration', 'hourly_rate',
            'total_cost', 'notes', 'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'duration', 'total_cost', 'created_at', 'updated_at']
    
    def get_professional(self, obj):
        return {
            'id': obj.professional.id,
            'name': obj.professional.get_full_name(),
            'avatar': obj.professional.avatar.url if obj.professional.avatar else None
        }
    
    def get_project_info(self, obj):
        return {
            'id': obj.project.id,
            'title': obj.project.title,
            'slug': obj.project.slug
        }


class TimeEntryCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeEntry
        fields = [
            'project', 'task', 'date', 'start_time', 'end_time', 'notes'
        ]
    
    def create(self, validated_data):
        validated_data['professional'] = self.context['request'].user
        
        # Calculate duration and cost
        start_time = validated_data['start_time']
        end_time = validated_data['end_time']
        duration = (end_time.hour * 60 + end_time.minute) - (start_time.hour * 60 + start_time.minute)
        
        validated_data['duration'] = duration
        validated_data['hourly_rate'] = self.context['request'].user.hourly_rate or 0
        validated_data['total_cost'] = (duration / 60) * validated_data['hourly_rate']
        
        return super().create(validated_data)


class TimeEntryUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeEntry
        fields = [
            'task', 'date', 'start_time', 'end_time', 'notes', 'status'
        ] 