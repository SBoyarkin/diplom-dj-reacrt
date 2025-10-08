from rest_framework import serializers
from .models import File
class FileViewSetSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ['name','size','date_uploaded','date_downloaded','pub_url','file','comment','owner', 'url']
        read_only_fields = ('name', 'pub_url', 'size', 'date_downloaded', 'owner')

