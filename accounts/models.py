from django.contrib.auth.models import AbstractUser
from django.db import models


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

    def save(self, *args, **kwargs):
        if not self.username:
            self.username = self.email or self.admin_id
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name or self.email} ({self.role})"
