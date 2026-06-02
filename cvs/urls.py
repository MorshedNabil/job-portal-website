from django.urls import path

from .views import MyCVView

urlpatterns = [
    path("me/", MyCVView.as_view()),
    path("me", MyCVView.as_view()),
    path("", MyCVView.as_view()),
]
