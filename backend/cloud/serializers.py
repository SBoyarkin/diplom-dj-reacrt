import re

from rest_framework import serializers

from django.contrib.auth.models import User
from .models import File, CustomUser


class FileViewSetSerializer(serializers.ModelSerializer):
    download_url = serializers.SerializerMethodField()
    class Meta:
        model = File
        fields = ['id', 'name','size','date_uploaded','date_downloaded','pub_url', 'file', 'comment','owner', 'download_url']
        read_only_fields = ('id', 'pub_url', 'size', 'date_downloaded', 'owner')


    def get_download_url(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(f'/cloud/files/{obj.id}/download/')



class RegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True, min_length=6)
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'password2', 'login']

    def validate_login(self, value):
        if len(value) < 4 or len(value) > 20:
            raise serializers.ValidationError('Username must be between 4 and 20 characters long.')
        if not value[0].isalpha():
            raise serializers.ValidationError('First character must be a letter.')
        if not re.match(r'^[a-zA-Z][a-zA-Z0-9]*$', value):
            raise serializers.ValidationError('Username can only contain Latin letters and numbers.')
        return value

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password2": "Passwords don't match."})
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        return CustomUser.objects.create_user(**validated_data)
