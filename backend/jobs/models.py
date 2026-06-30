from django.conf import settings
from django.db import models


class Job(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=200, blank=True)
    salary = models.CharField(max_length=100, blank=True)
    image_url = models.URLField(blank=True)
    posted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, # defined in settings.py as AUTH_USER_MODEL = accounts.User so no need to import the user model at top; that will create circular import (Risky). It's done because of custom user model we have build
        related_name="posted_jobs",
        on_delete=models.CASCADE,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title
