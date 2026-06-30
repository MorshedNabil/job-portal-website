from rest_framework import serializers

from accounts.serializers import UserSerializer
from .models import Job


class JobSerializer(serializers.ModelSerializer):
    _id       = serializers.IntegerField(source="id", read_only=True)
    imageUrl  = serializers.URLField(source="image_url", required=False, allow_blank=True)
    postedBy  = UserSerializer(source="posted_by", read_only=True)
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)
    updatedAt = serializers.DateTimeField(source="updated_at", read_only=True)
    company   = serializers.SerializerMethodField()

    def get_company(self, obj):
        return {
            "name":    obj.company_name,
            "about":   obj.company_about,
            "address": obj.company_address,
        }

    class Meta:
        model = Job
        fields = (
            "_id",
            "id",
            "title",
            "description",
            "location",
            "salary",
            "vacancy",
            "age_range",
            "experience",
            "deadline",
            "education",
            "skills",
            "requirements",
            "responsibilities",
            "company",
            "company_name",
            "company_about",
            "company_address",
            "imageUrl",
            "postedBy",
            "createdAt",
            "updatedAt",
        )
