from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Appointment

User = get_user_model()


class UserBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'avatar']


class AppointmentSerializer(serializers.ModelSerializer):
    professional = UserBasicSerializer(read_only=True)
    client = UserBasicSerializer(read_only=True)
    project_info = serializers.SerializerMethodField()
    
    class Meta:
        model = Appointment
        fields = [
            'id', 'title', 'description', 'professional', 'client', 
            'project_info', 'date', 'time', 'duration', 'location',
            'meeting_link', 'type', 'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_project_info(self, obj):
        if obj.project:
            return {
                'id': obj.project.id,
                'title': obj.project.title,
                'slug': obj.project.slug
            }
        return None


class AppointmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = [
            'title', 'description', 'professional', 'project', 
            'date', 'time', 'duration', 'location', 'meeting_link', 'type'
        ]
    
    def create(self, validated_data):
        validated_data['client'] = self.context['request'].user
        return super().create(validated_data)


class AppointmentUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = [
            'title', 'description', 'date', 'time', 'duration', 
            'location', 'meeting_link', 'type', 'status'
        ] 