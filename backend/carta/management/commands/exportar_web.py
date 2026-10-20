import json
import shutil
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand

from carta.models import Categoria
from carta.serializers import CategoriaSerializer
from galeria.models import Foto
from galeria.serializers import FotoSerializer


class Command(BaseCommand):
    help = (
        'Guarda la carta y la galería como archivos dentro del frontend, '
        'para publicar la web sin Django (p. ej. en Vercel).'
    )

    def add_arguments(self, parser):
        parser.add_argument(
            '--destino',
            type=Path,
            default=settings.BASE_DIR.parent / 'frontend' / 'public',
            help='Carpeta public/ del frontend',
        )

    def handle(self, *args, destino, **options):
        datos = destino / 'datos'
        datos.mkdir(parents=True, exist_ok=True)

        carta = CategoriaSerializer(Categoria.objects.prefetch_related('productos'), many=True).data
        self._guardar(datos / 'carta.json', carta)

        fotos = Foto.objects.filter(visible=True)
        self._guardar(datos / 'galeria.json', FotoSerializer(fotos, many=True).data)

        # Las fotos se copian con la misma ruta (/media/...) que usa la API
        media = destino / 'media'
        if media.exists():
            shutil.rmtree(media)
        for foto in fotos:
            copia = media / foto.imagen.name
            copia.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(foto.imagen.path, copia)

        productos = sum(len(c['productos']) for c in carta)
        self.stdout.write(self.style.SUCCESS(
            f'Exportado: {len(carta)} categorías, {productos} productos y {fotos.count()} fotos en {destino}'
        ))

    def _guardar(self, ruta, contenido):
        ruta.write_text(json.dumps(contenido, ensure_ascii=False, indent=2), encoding='utf-8')
