from django.utils import timezone
from django.core.exceptions import PermissionDenied
from rest_framework.generics import DestroyAPIView, UpdateAPIView
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponse
from .serializers import FileViewSetSerializer, RegistrationSerializer, ChangeStatusSerializer
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

    @action(detail=True, methods=['post'])
    def generate_public_link(self, request, pk=None):
        file_obj = self.get_object()
        expires_days = request.data.get('expires_days', None)

        public_url = file_obj.generate_public_url(request, expires_days)
        return Response({
            'public_url': public_url,
            'expires_at': file_obj.public_url_expires,
            'message': 'Публичная ссылка создана успешно'
        })

    @action(detail=True, methods=['post'])
    def revoke_public_link(self, request, pk=None):
        file_obj = self.get_object()
        file_obj.revoke_public_url()
        return Response({'message': 'Публичная ссылка отозвана'})

    @action(detail=False, methods=['get'], url_path='public/(?P<public_token>[^/.]+)', permission_classes=[])
    def public_download(self, request, public_token=None):
        try:
            file_obj = File.objects.get(public_token=public_token, is_public=True)

            if file_obj.public_url_expires and file_obj.public_url_expires < timezone.now():
                return Response({'error': 'Ссылка устарела'}, status=status.HTTP_410_GONE)

            file_handle = file_obj.file.open('rb')
            response = HttpResponse(file_handle, content_type='application/octet-stream')
            filename = file_obj.name
            response['Content-Disposition'] = f'attachment; filename="{filename}"'
            response['Content-Length'] = file_obj.file.size
            file_obj.update_download_date()

            return response

        except File.DoesNotExist:
            return Response({'error': 'Файл не найден или ссылка недействительна'},
                            status=status.HTTP_404_NOT_FOUND)


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


from rest_framework.generics import UpdateAPIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model

CustomUser = get_user_model()


class ChangeStatusViewSet(UpdateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = [IsAdmin]
    serializer_class = ChangeStatusSerializer

    def update(self, request, *args, **kwargs):
        user = self.get_object()

        is_staff = request.data.get('is_staff')

        if is_staff is None:
            return Response(
                {'error': 'Поле is_staff обязательно'},
                status=status.HTTP_400_BAD_REQUEST
            )
        user.is_staff = is_staff
        user.save()

        return Response({
            'message': f'Статус is_staff пользователя {user.username} изменен на {is_staff}',
            'user_id': user.id,
            'username': user.username,
            'is_staff': user.is_staff
        })

