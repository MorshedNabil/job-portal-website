from django.urls import path

from .views import MarkNotificationReadView, MyNotificationsView

urlpatterns = [
    path("me/", MyNotificationsView.as_view()),
    path("me", MyNotificationsView.as_view()),
    path("<int:pk>/read/", MarkNotificationReadView.as_view()),
    path("<int:pk>/read", MarkNotificationReadView.as_view()),
]
