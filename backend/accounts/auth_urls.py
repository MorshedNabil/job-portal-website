from django.urls import path

from .views import AdminRegisterView, LoginView, RegisterView

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("register", RegisterView.as_view()),
    path("login/", LoginView.as_view()),
    path("login", LoginView.as_view()),
    path("admin-register/", AdminRegisterView.as_view()),
    path("admin-register", AdminRegisterView.as_view()),
]
