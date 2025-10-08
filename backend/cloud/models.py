from django.contrib.auth.models import User
from django.db import models


def user_directory_path(instance, filename):

    if hasattr(instance, 'user'):
        user_id = instance.user.id

    elif isinstance(instance, User):
        user_id = instance.id
    else:
        user_id = 'unknown'
    return f'uploads/{user_id}/{filename}'

class File(models.Model):
    name = models.CharField(max_length=255)
    unique_name = models.CharField(max_length=255)
    url = models.URLField(max_length=255, blank=True,)
    file = models.FileField(upload_to=user_directory_path)
    comment = models.TextField(blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)


# Create your models here.
