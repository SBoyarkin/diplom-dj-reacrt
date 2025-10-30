import re

from rest_framework import serializers

from .models import File, CustomUser

class FileViewSetSerializer(serializers.ModelSerializer):
    download_url = serializers.SerializerMethodField()
    public_access_url = serializers.SerializerMethodField()
    is_public = serializers.BooleanField(read_only=True)
    public_url_expires = serializers.DateTimeField(read_only=True)

    class Meta:
        model = File
        fields = [
            'id', 'name', 'size', 'date_uploaded', 'date_downloaded',
            'pub_url', 'file', 'comment', 'owner', 'download_url',
            'public_access_url', 'is_public', 'public_url_expires'
        ]
        read_only_fields = ('id', 'pub_url', 'size', 'date_downloaded', 'owner')

    def get_download_url(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(f'/cloud/files/{obj.id}/download/')

    def get_public_access_url(self, obj):
        if obj.is_public:
            request = self.context.get('request')
            return request.build_absolute_uri(f'/cloud/files/public/{obj.public_token}/')
        return None



class RegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True, min_length=6)
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'password2', 'login']

    def validate_login(self, value):
        if len(value) < 4 or len(value) > 20:
            raise serializers.ValidationError('Имя пользователя должно содеражть от 4 до 20 символовю')
        if not value[0].isalpha():
            raise serializers.ValidationError('Первый символ должен быть буква')
        if not re.match(r'^[a-zA-Z][a-zA-Z0-9]*$', value):
            raise serializers.ValidationError('Имя пользователя может содержать только имя буквы и цифры.')
        return value

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password2": "Пароли не совпадают."})
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        return CustomUser.objects.create_user(**validated_data)
