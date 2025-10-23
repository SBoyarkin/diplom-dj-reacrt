from djoser.serializers import UserSerializer


from cloud.models import CustomUser


class CustomUserSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        model = CustomUser
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'is_staff')