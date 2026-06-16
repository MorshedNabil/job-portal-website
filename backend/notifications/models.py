from django.conf import settings
from django.db import models


class Notification(models.Model):
    class Type(models.TextChoices):
        ACCEPTED = "accepted", "Accepted"
        REJECTED = "rejected", "Rejected"
        INFO = "info", "Info"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="notifications", on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    message = models.TextField()
    type = models.CharField(max_length=20, choices=Type.choices, default=Type.INFO)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} -> {self.user}"
