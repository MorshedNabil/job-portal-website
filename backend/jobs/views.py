from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import IsCompanyRole
from .models import Job
from .serializers import JobSerializer


class JobPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = "limit"
    max_page_size = 100


class JobListCreateView(APIView):
    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated(), IsCompanyRole()]
        return [AllowAny()]

    def get(self, request):
        queryset = Job.objects.select_related("posted_by").all()
        q = request.query_params.get("q", "").strip()
        location = request.query_params.get("location", "").strip()
        if q:
            queryset = queryset.filter(title__icontains=q)
        if location:
            queryset = queryset.filter(location__icontains=location)

        paginator = JobPagination()
        page = paginator.paginate_queryset(queryset, request)
        serializer = JobSerializer(page, many=True)
        total = queryset.count()
        limit = paginator.get_page_size(request)
        page_number = paginator.page.number
        return Response(
            {
                "items": serializer.data,
                "total": total,
                "page": page_number,
                "limit": limit,
                "totalPages": paginator.page.paginator.num_pages,
            }
        )

    def post(self, request):
        serializer = JobSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        job = serializer.save(posted_by=request.user)
        return Response(JobSerializer(job).data, status=status.HTTP_201_CREATED)


class JobDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            job = Job.objects.select_related("posted_by").get(pk=pk)
        except Job.DoesNotExist:
            return Response({"message": "Job not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(JobSerializer(job).data)
