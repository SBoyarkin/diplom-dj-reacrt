from django.shortcuts import render
from rest_framework import viewsets

from cloud.serializers import FileViewSetSerializer
from cloud.models import File
from rest_framework.permissions import IsAuthenticated


class FileViewSet(viewsets.ModelViewSet):
    queryset = File.objects.all()
    serializer_class = FileViewSetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        print(dir(self.request.user))
        if self.request.user.is_authenticated:
            if self.request.user.is_superuser:
                return File.objects.all()
            else:
                return File.objects.filter(user=self.request.user)




# Create your views here.
