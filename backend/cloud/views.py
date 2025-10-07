from django.shortcuts import render
from rest_framework import viewsets

from cloud.serializers import FileViewSetSerializer
from cloud.models import File


class FileViewSet(viewsets.ModelViewSet):
    queryset = File.objects.all()
    serializer_class = FileViewSetSerializer

# Create your views here.
