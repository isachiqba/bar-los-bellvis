from rest_framework.routers import SimpleRouter

from .views import GaleriaViewSet

router = SimpleRouter()
router.register('galeria', GaleriaViewSet, basename='galeria')

urlpatterns = router.urls
