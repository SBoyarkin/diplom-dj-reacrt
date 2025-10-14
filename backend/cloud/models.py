from django.contrib.auth.models import User
from django.db import models

from backend.utils import get_config


def user_directory_path(instance, filename):
    if hasattr(instance, 'owner'):
        user_id = instance.owner.id
    elif isinstance(instance, User):
        user_id = instance.id
    else:
        user_id = 'unknown'
    return f'{get_config().get("path", "save_url")}/{user_id}/{filename}'

class File(models.Model):
    name = models.CharField(max_length=255)
    size = models.IntegerField()
    date_uploaded = models.DateTimeField(auto_now_add=True)
    date_downloaded = models.DateTimeField(blank=True, null=True)
    pub_url = models.URLField(max_length=255, blank=True,)
    file = models.FileField(upload_to=user_directory_path)
    comment = models.TextField(blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        if self.file:
            if not self.name:
                self.name = self.file.name
            if not self.size:
                self.size = self.file.size
        super().save(*args, **kwargs)


# Create your models here.
