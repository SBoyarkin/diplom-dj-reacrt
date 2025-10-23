from rest_framework import routers
from .views import FileViewSet

router = routers.DefaultRouter()
router.register('files', FileViewSet)
