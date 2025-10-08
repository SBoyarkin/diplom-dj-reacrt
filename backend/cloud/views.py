from django.shortcuts import render
from rest_framework import viewsets

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
        print(dir(self.request.user))
        if self.request.user.is_authenticated:
            if self.request.user.is_superuser:
                return File.objects.all()
            else:
                return File.objects.filter(owner=self.request.user)




# Create your views here.
