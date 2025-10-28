from django.core.exceptions import PermissionDenied
from rest_framework.generics import DestroyAPIView
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponse
from .serializers import FileViewSetSerializer, RegistrationSerializer
from .models import File, CustomUser
from .permissions import IsOwnerOrAdmin, IsAdmin


class FileViewSet(viewsets.ModelViewSet):
    queryset = File.objects.all()
    serializer_class = FileViewSetSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_queryset(self):
        if self.request.user.is_authenticated:
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

    @action(detail=False, methods=['get'], url_path='filter/(?P<owner>[^/.]+)', permission_classes=[IsAdmin])
    def selected_by_owner(self, request, owner=None):
        files = File.objects.filter(owner=owner)
        if files.count() > 0:
            serializer = self.get_serializer(files, many=True)
            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_204_NO_CONTENT)


class RegistrationViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = RegistrationSerializer

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            print(serializer.validated_data)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomUserDestroyView(DestroyAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = [IsAdmin]

    def perform_destroy(self, instance):
        if instance == self.request.user:
            raise PermissionDenied("Вы не можете удалить свой собственный аккаунт")
        instance.delete()

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
            return Response(
                {"detail": "Пользователь успешно удален"},
                status=status.HTTP_204_NO_CONTENT
            )
        except ValidationError as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )