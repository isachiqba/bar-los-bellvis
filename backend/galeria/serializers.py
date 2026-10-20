from rest_framework import serializers

from .models import Foto


class FotoSerializer(serializers.ModelSerializer):
    # Ruta relativa (/media/...) para que funcione a través del proxy de Vite
    imagen = serializers.SerializerMethodField()

    class Meta:
        model = Foto
        fields = ['id', 'imagen', 'titulo', 'titulo_en']

    def get_imagen(self, obj):
        return obj.imagen.url
