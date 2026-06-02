from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path


def health(_request):
    return JsonResponse({"ok": True, "message": "Django backend running"})


urlpatterns = [
    path("", health),
    path("admin/", admin.site.urls),
    path("api/auth/", include("accounts.auth_urls")),
    path("api/auth", include("accounts.auth_urls")),
    path("api/users/", include("accounts.user_urls")),
    path("api/users", include("accounts.user_urls")),
    path("api/jobs/", include("jobs.urls")),
    path("api/jobs", include("jobs.urls")),
    path("api/applications/", include("applications.urls")),
    path("api/applications", include("applications.urls")),
    path("api/company/", include("applications.company_urls")),
    path("api/company", include("applications.company_urls")),
    path("api/cv/", include("cvs.urls")),
    path("api/cv", include("cvs.urls")),
    path("api/notifications/", include("notifications.urls")),
    path("api/notifications", include("notifications.urls")),
    path("api/admin/", include("admin_api.urls")),
    path("api/admin", include("admin_api.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
