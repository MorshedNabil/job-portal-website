import re

from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


def token_for_user(user):
    refresh = RefreshToken.for_user(user)
    return str(refresh.access_token)


class UserSerializer(serializers.ModelSerializer):
    _id = serializers.IntegerField(source="id", read_only=True)
    adminId = serializers.CharField(source="admin_id", read_only=True)
    cvUrl = serializers.CharField(source="cv_url", read_only=True)

    class Meta:
        model = User
        fields = ("_id", "id", "name", "email", "role", "adminId", "cvUrl")
        read_only_fields = ("id", "role", "adminId", "cvUrl")


class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    role = serializers.ChoiceField(choices=("worker", "company"))

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data["email"],
            email=validated_data["email"],
            password=validated_data["password"],
            name=validated_data["name"],
            role=validated_data["role"],
        )


class AdminRegisterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    confirmPassword = serializers.CharField(write_only=True)
    adminId = serializers.CharField(max_length=12)

    def validate(self, attrs):
        if attrs["password"] != attrs["confirmPassword"]:
            raise serializers.ValidationError({"message": "Passwords do not match"})
        if not re.fullmatch(r"\d{12}", attrs["adminId"]):
            raise serializers.ValidationError({"message": "Admin ID must be 12 digits"})
        if User.objects.filter(email__iexact=attrs["email"]).exists() or User.objects.filter(admin_id=attrs["adminId"]).exists():
            raise serializers.ValidationError({"message": "Email or Admin ID already exists"})
        return attrs

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data["email"],
            email=validated_data["email"],
            password=validated_data["password"],
            name=validated_data["name"],
            role=User.Role.ADMIN,
            admin_id=validated_data["adminId"],
            is_staff=True,
        )


class LoginSerializer(serializers.Serializer):
    identifier = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        identifier = attrs["identifier"]
        user = User.objects.filter(email__iexact=identifier).first() or User.objects.filter(admin_id=identifier).first()
        if not user:
            raise serializers.ValidationError({"message": "Invalid credentials"})
        authenticated = authenticate(username=user.email, password=attrs["password"])
        if not authenticated:
            raise serializers.ValidationError({"message": "Invalid credentials"})
        attrs["user"] = authenticated
        return attrs
