
from rest_framework import viewsets
from rest_framework.decorators import action

from django.http import HttpResponse


from .serializers import FileViewSetSerializer
from .models import File
from rest_framework.permissions import IsAuthenticated
from .permissions import IsOwnerOrAdmin


class FileViewSet(viewsets.ModelViewSet):
    queryset = File.objects.all()
    serializer_class = FileViewSetSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_queryset(self):
        if self.request.user.is_authenticated:
            if self.request.user.is_superuser:
                return File.objects.all()
            else:
                return File.objects.filter(owner=self.request.user)

    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        file_obj = self.get_object()
        file_handle = file_obj.file.open('rb')
        response = HttpResponse(file_handle, content_type='application/octet-stream')
        filename = file_obj.name
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        print(filename)
        response['Content-Length'] = file_obj.file.size
        file_obj.update_download_date()
        return response


