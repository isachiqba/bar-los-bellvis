from rest_framework import viewsets

from .models import Categoria
from .serializers import CategoriaSerializer


class CartaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Categoria.objects.prefetch_related('productos')
    serializer_class = CategoriaSerializer
