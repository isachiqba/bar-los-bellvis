from rest_framework import serializers

from .models import Categoria, Producto


class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = [
            'id', 'nombre', 'nombre_en', 'descripcion', 'descripcion_en',
            'precio', 'precio_medio', 'disponible',
        ]


class CategoriaSerializer(serializers.ModelSerializer):
    productos = serializers.SerializerMethodField()

    class Meta:
        model = Categoria
        fields = ['id', 'nombre', 'nombre_en', 'productos']

    def get_productos(self, obj):
        return ProductoSerializer(obj.productos.filter(disponible=True), many=True).data
