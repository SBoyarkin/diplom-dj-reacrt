from django.contrib.auth.models import User
from django.db import models


class File(models.Model):
    name = models.CharField(max_length=255)
    file_name = models.CharField(max_length=255)
    url = models.URLField(max_length=255)
    file = models.FileField(upload_to='files')
    coment = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)


# Create your models here.
