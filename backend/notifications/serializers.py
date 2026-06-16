from rest_framework import serializers

from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    _id = serializers.IntegerField(source="id", read_only=True)
    isRead = serializers.BooleanField(source="is_read", read_only=True)
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)
    updatedAt = serializers.DateTimeField(source="updated_at", read_only=True)

    class Meta:
        model = Notification
        fields = ("_id", "id", "title", "message", "type", "isRead", "createdAt", "updatedAt")
