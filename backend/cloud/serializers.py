from rest_framework import serializers
from .models import File
class FileViewSetSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = '__all__'
        read_only_fields = ('name', 'unique_name', 'url',)

    def create(self, validated_data):
        name = validated_data.get('file')
        validated_data['name'] = name
        print(name)
        print(validated_data)
        return super().create(validated_data)
