from django.conf import settings
from django.db import models

from jobs.models import Job


class Application(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        ACCEPTED = "accepted", "Accepted"
        REJECTED = "rejected", "Rejected"

    job = models.ForeignKey(Job, related_name="applications", on_delete=models.CASCADE)
    applicant = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="applications", on_delete=models.CASCADE)
    cv_url = models.URLField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(fields=["job", "applicant"], name="unique_application_per_job")
        ]

    def __str__(self):
        return f"{self.applicant} -> {self.job}"
