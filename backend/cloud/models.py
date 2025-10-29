import uuid
from datetime import datetime

from django.contrib.auth.models import AbstractUser
from django.db import models
from backend.utils import get_config


def user_directory_path(instance, filename):
    if hasattr(instance, 'owner'):
        user_id = instance.owner.id
    elif isinstance(instance, CustomUser):
        user_id = instance.id
    else:
        user_id = 'unknown'
    return f'{get_config().get("path", "save_url")}/{user_id}/{filename}'

class CustomUser(AbstractUser):
    login = models.CharField(max_length=255, unique=True)



class File(models.Model):
    name = models.CharField(max_length=255, blank=True)
    size = models.IntegerField()
    date_uploaded = models.DateTimeField(auto_now_add=True)
    date_downloaded = models.DateTimeField(blank=True, null=True)
    pub_url = models.URLField(max_length=255, blank=True,)
    file = models.FileField(upload_to=user_directory_path)
    comment = models.TextField(blank=True)
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    public_token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    is_public = models.BooleanField(default=False)
    public_url_expires = models.DateTimeField(blank=True, null=True)

    def save(self, *args, **kwargs):
        if self.file:
            if not self.name:
                self.name = self.file.name
            if not self.size:
                self.size = self.file.size
        super().save(*args, **kwargs)

    def update_download_date(self):
        self.date_downloaded = datetime.now()
        self.save()

    def generate_public_url(self, request, expires_days=None):
        self.is_public = True
        if expires_days:
            from django.utils import timezone
            self.public_url_expires = timezone.now() + timezone.timedelta(days=expires_days)
        self.save()
        return request.build_absolute_uri(f'/cloud/files/public/{self.public_token}/')

    def revoke_public_url(self):
        self.is_public = False
        self.public_token = uuid.uuid4()
        self.public_url_expires = None
        self.save()
