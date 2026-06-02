from django.contrib import admin

from .models import Job


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "location", "salary", "posted_by", "created_at")
    list_filter = ("location", "created_at")
    search_fields = ("title", "description", "location", "posted_by__email", "posted_by__name")
