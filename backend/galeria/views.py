from rest_framework import viewsets

from .models import Foto
from .serializers import FotoSerializer


class GaleriaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Foto.objects.filter(visible=True)
    serializer_class = FotoSerializer
