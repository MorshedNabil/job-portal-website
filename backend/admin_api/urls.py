from django.urls import path

from .views import (
    AdminAddView,
    AdminApplicationDeleteView,
    AdminApplicationsView,
    AdminApplicationStatusView,
    AdminJobDeleteView,
    AdminJobsView,
    AdminListView,
    AdminUserDeleteView,
    AdminUsersView,
)

urlpatterns = [
    path("users/", AdminUsersView.as_view()),
    path("users", AdminUsersView.as_view()),
    path("users/<int:pk>/", AdminUserDeleteView.as_view()),
    path("users/<int:pk>", AdminUserDeleteView.as_view()),
    path("jobs/", AdminJobsView.as_view()),
    path("jobs", AdminJobsView.as_view()),
    path("jobs/<int:pk>/", AdminJobDeleteView.as_view()),
    path("jobs/<int:pk>", AdminJobDeleteView.as_view()),
    path("applications/", AdminApplicationsView.as_view()),
    path("applications", AdminApplicationsView.as_view()),
    path("applications/<int:pk>/", AdminApplicationDeleteView.as_view()),
    path("applications/<int:pk>", AdminApplicationDeleteView.as_view()),
    path("applications/<int:pk>/status/", AdminApplicationStatusView.as_view()),
    path("applications/<int:pk>/status", AdminApplicationStatusView.as_view()),
    path("all/", AdminListView.as_view()),
    path("all", AdminListView.as_view()),
    path("add/", AdminAddView.as_view()),
    path("add", AdminAddView.as_view()),
]
