from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Task

User = get_user_model()


class TaskSerializer(serializers.ModelSerializer):
    assigned_to = serializers.SerializerMethodField()
    assigned_by = serializers.SerializerMethodField()
    project_info = serializers.SerializerMethodField()
    
    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'project_info', 'assigned_to',
            'assigned_by', 'due_date', 'priority', 'status', 'progress',
            'created_at', 'updated_at', 'completed_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'completed_at']
    
    def get_assigned_to(self, obj):
        return {
            'id': obj.assigned_to.id,
            'name': obj.assigned_to.get_full_name(),
            'avatar': obj.assigned_to.avatar.url if obj.assigned_to.avatar else None
        }
    
    def get_assigned_by(self, obj):
        return {
            'id': obj.assigned_by.id,
            'name': obj.assigned_by.get_full_name(),
            'avatar': obj.assigned_by.avatar.url if obj.assigned_by.avatar else None
        }
    
    def get_project_info(self, obj):
        return {
            'id': obj.project.id,
            'title': obj.project.title,
            'slug': obj.project.slug
        }


class TaskCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = [
            'title', 'description', 'project', 'assigned_to', 
            'due_date', 'priority'
        ]
    
    def create(self, validated_data):
        validated_data['assigned_by'] = self.context['request'].user
        return super().create(validated_data)


class TaskUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = [
            'title', 'description', 'due_date', 'priority', 
            'status', 'progress'
        ] 