from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ("id", "email", "name", "role", "admin_id", "is_staff", "is_active")
    list_filter = ("role", "is_staff", "is_active", "google_auth")
    search_fields = ("email", "name", "admin_id")
    ordering = ("id",)
    fieldsets = UserAdmin.fieldsets + (
        ("Job Portal Profile", {"fields": ("name", "role", "admin_id", "google_auth", "cv_url")}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ("Job Portal Profile", {"fields": ("email", "name", "role", "admin_id")}),
    )
