from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Notification
        fields = [
            'id', 'user', 'type', 'title', 'message', 'is_read', 
            'data', 'created_at', 'read_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'read_at']


class NotificationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['type', 'title', 'message', 'data']


class NotificationUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['is_read']