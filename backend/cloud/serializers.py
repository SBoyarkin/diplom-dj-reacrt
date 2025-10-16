from rest_framework import serializers
from .models import File
from backend.utils import get_config
class FileViewSetSerializer(serializers.ModelSerializer):
    download_url = serializers.SerializerMethodField()
    class Meta:
        model = File
        fields = ['id', 'name','size','date_uploaded','date_downloaded','pub_url','comment','owner', 'download_url']
        read_only_fields = ('id', 'name', 'pub_url', 'size', 'date_downloaded', 'owner')

    def get_download_url(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(f'/cloud/files/{obj.id}/download/')

