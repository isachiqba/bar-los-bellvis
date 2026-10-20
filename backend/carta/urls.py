from rest_framework.routers import DefaultRouter

from .views import CartaViewSet

router = DefaultRouter()
router.register('carta', CartaViewSet, basename='carta')

urlpatterns = router.urls
