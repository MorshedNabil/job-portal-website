from django.db import IntegrityError
from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import IsCompanyRole, IsWorkerRole
from jobs.models import Job
from notifications.models import Notification
from .models import Application
from .serializers import ApplicationCreateSerializer, ApplicationSerializer, ApplicationStatusSerializer

ALLOWED_CONTENT_TYPES = {
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}


def save_cv_file(file_obj):
    from django.core.files.storage import default_storage

    path = default_storage.save(f"cvs/{file_obj.name}", file_obj)
    return default_storage.url(path)


class ApplicationListCreateView(APIView):
    permission_classes = [IsAuthenticated, IsWorkerRole]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        apps = Application.objects.filter(applicant=request.user).select_related("job", "applicant", "job__posted_by")
        return Response(ApplicationSerializer(apps, many=True).data)

    def post(self, request):
        serializer = ApplicationCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        cv = request.FILES.get("cv")
        if not cv:
            return Response({"message": "CV file required (field name: cv)"}, status=status.HTTP_400_BAD_REQUEST)
        if cv.content_type not in ALLOWED_CONTENT_TYPES:
            return Response({"message": "Only PDF/DOC/DOCX files are allowed"}, status=status.HTTP_400_BAD_REQUEST)
        if cv.size > 5 * 1024 * 1024:
            return Response({"message": "CV file must be 5MB or smaller"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            job = Job.objects.get(pk=serializer.validated_data["jobId"])
        except Job.DoesNotExist:
            return Response({"message": "Job not found"}, status=status.HTTP_404_NOT_FOUND)
        try:
            app = Application.objects.create(job=job, applicant=request.user, cv_url=save_cv_file(cv))
        except IntegrityError:
            return Response({"message": "You already applied to this job."}, status=status.HTTP_400_BAD_REQUEST)
        return Response(ApplicationSerializer(app).data, status=status.HTTP_201_CREATED)


class CompanyApplicationsView(APIView):
    permission_classes = [IsAuthenticated, IsCompanyRole]

    def get(self, request):
        apps = Application.objects.filter(job__posted_by=request.user).select_related("job", "applicant", "job__posted_by")
        return Response(ApplicationSerializer(apps, many=True).data)


class CompanyApplicationStatusView(APIView):
    permission_classes = [IsAuthenticated, IsCompanyRole]

    def patch(self, request, pk):
        serializer = ApplicationStatusSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        new_status = serializer.validated_data["status"]
        if new_status not in ("accepted", "rejected"):
            return Response({"message": "Status must be accepted or rejected"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            app = Application.objects.select_related("job", "applicant").get(pk=pk, job__posted_by=request.user)
        except Application.DoesNotExist:
            return Response({"message": "Application not found"}, status=status.HTTP_404_NOT_FOUND)
        if app.status != Application.Status.PENDING:
            return Response({"message": "Status locked already"}, status=status.HTTP_400_BAD_REQUEST)

        app.status = new_status
        app.save(update_fields=["status", "updated_at"])
        Notification.objects.create(
            user=app.applicant,
            title="Accepted" if new_status == "accepted" else "Rejected",
            message=(
                f'You are accepted for "{app.job.title}". Company will contact you soon.'
                if new_status == "accepted"
                else f'Your application for "{app.job.title}" was rejected. Try next time!'
            ),
            type=new_status,
        )
        return Response({"message": "Status updated", "app": ApplicationSerializer(app).data})
