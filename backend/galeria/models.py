from django.db import models


class Foto(models.Model):
    imagen = models.ImageField(upload_to='galeria/')
    titulo = models.CharField(max_length=150, blank=True)
    titulo_en = models.CharField('título (inglés)', max_length=150, blank=True)
    orden = models.PositiveIntegerField(default=0)
    visible = models.BooleanField(default=True)

    class Meta:
        ordering = ['orden', 'id']

    def __str__(self):
        return self.titulo or self.imagen.name
