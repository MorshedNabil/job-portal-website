import re

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import IsAdminRole
from accounts.serializers import UserSerializer
from applications.models import Application
from applications.serializers import ApplicationSerializer, ApplicationStatusSerializer
from jobs.models import Job
from jobs.serializers import JobSerializer

User = get_user_model()


class AdminUsersView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get(self, request):
        return Response(UserSerializer(User.objects.all(), many=True).data)


class AdminUserDeleteView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def delete(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        user.delete()
        return Response({"message": "User deleted"})


class AdminJobsView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get(self, request):
        return Response(JobSerializer(Job.objects.select_related("posted_by").all(), many=True).data)


class AdminJobDeleteView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def delete(self, request, pk):
        try:
            job = Job.objects.get(pk=pk)
        except Job.DoesNotExist:
            return Response({"message": "Job not found"}, status=status.HTTP_404_NOT_FOUND)
        job.delete()
        return Response({"message": "Job deleted"})


class AdminApplicationsView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get(self, request):
        apps = Application.objects.select_related("job", "applicant", "job__posted_by").all()
        return Response(ApplicationSerializer(apps, many=True).data)


class AdminApplicationDeleteView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def delete(self, request, pk):
        try:
            app = Application.objects.get(pk=pk)
        except Application.DoesNotExist:
            return Response({"message": "Application not found"}, status=status.HTTP_404_NOT_FOUND)
        app.delete()
        return Response({"message": "Application deleted"})


class AdminApplicationStatusView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def patch(self, request, pk):
        serializer = ApplicationStatusSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            app = Application.objects.select_related("job", "applicant", "job__posted_by").get(pk=pk)
        except Application.DoesNotExist:
            return Response({"message": "Application not found"}, status=status.HTTP_404_NOT_FOUND)
        app.status = serializer.validated_data["status"]
        app.save(update_fields=["status", "updated_at"])
        return Response(ApplicationSerializer(app).data)


class AdminListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get(self, request):
        admins = User.objects.filter(role=User.Role.ADMIN)
        return Response(UserSerializer(admins, many=True).data)


class AdminAddView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def post(self, request):
        name = request.data.get("name")
        email = request.data.get("email")
        password = request.data.get("password")
        admin_id = request.data.get("adminId")
        if not all([name, email, password, admin_id]):
            return Response({"message": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)
        if not re.fullmatch(r"\d{12}", admin_id):
            return Response({"message": "Admin ID must be 12 digits"}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(email__iexact=email).exists() or User.objects.filter(admin_id=admin_id).exists():
            return Response({"message": "Email or Admin ID already exists"}, status=status.HTTP_400_BAD_REQUEST)

        admin = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            name=name,
            role=User.Role.ADMIN,
            admin_id=admin_id,
            is_staff=True,
        )
        return Response({"message": "Admin added successfully", "admin": UserSerializer(admin).data}, status=status.HTTP_201_CREATED)
