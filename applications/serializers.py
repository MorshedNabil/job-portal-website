from rest_framework import serializers

from accounts.serializers import UserSerializer
from jobs.serializers import JobSerializer
from .models import Application


class ApplicationSerializer(serializers.ModelSerializer):
    _id = serializers.IntegerField(source="id", read_only=True)
    cvUrl = serializers.URLField(source="cv_url", read_only=True)
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)
    updatedAt = serializers.DateTimeField(source="updated_at", read_only=True)
    job = JobSerializer(read_only=True)
    applicant = UserSerializer(read_only=True)

    class Meta:
        model = Application
        fields = ("_id", "id", "job", "applicant", "cvUrl", "status", "createdAt", "updatedAt")


class ApplicationCreateSerializer(serializers.Serializer):
    jobId = serializers.IntegerField()
    cv = serializers.FileField(required=False)


class ApplicationStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=("pending", "accepted", "rejected"))
