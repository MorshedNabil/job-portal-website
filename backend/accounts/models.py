from django.contrib.auth.models import AbstractUser, UserManager
from django.db import models


class CustomUserManager(UserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        extra_fields.setdefault("username", email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("role", User.Role.ADMIN)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "admin", "Admin"
        WORKER = "worker", "Worker"
        COMPANY = "company", "Company"

    name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.WORKER)
    admin_id = models.CharField(max_length=12, unique=True, null=True, blank=True)
    google_auth = models.BooleanField(default=False)
    cv_url = models.URLField(blank=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]
    objects = CustomUserManager()

    def save(self, *args, **kwargs):
        if not self.username:
            self.username = self.email or self.admin_id
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name or self.email} ({self.role})"
