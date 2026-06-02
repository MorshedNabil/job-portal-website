from django.urls import path

from .views import CompanyApplicationsView, CompanyApplicationStatusView

urlpatterns = [
    path("applications/", CompanyApplicationsView.as_view()),
    path("applications", CompanyApplicationsView.as_view()),
    path("applications/<int:pk>/status/", CompanyApplicationStatusView.as_view()),
    path("applications/<int:pk>/status", CompanyApplicationStatusView.as_view()),
]
