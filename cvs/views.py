from django.core.files.storage import default_storage
from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

ALLOWED_CONTENT_TYPES = {
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}


class MyCVView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        return Response({"cvUrl": request.user.cv_url or None})

    def post(self, request):
        cv = request.FILES.get("cv")
        if not cv:
            return Response({"message": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)
        if cv.content_type not in ALLOWED_CONTENT_TYPES:
            return Response({"message": "Only PDF/DOC/DOCX files are allowed"}, status=status.HTTP_400_BAD_REQUEST)
        if cv.size > 5 * 1024 * 1024:
            return Response({"message": "CV file must be 5MB or smaller"}, status=status.HTTP_400_BAD_REQUEST)

        path = default_storage.save(f"cvs/{cv.name}", cv)
        request.user.cv_url = default_storage.url(path)
        request.user.save(update_fields=["cv_url"])
        return Response({"cvUrl": request.user.cv_url})
