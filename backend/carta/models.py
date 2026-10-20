from django.db import models


class Categoria(models.Model):
    nombre = models.CharField(max_length=100)
    nombre_en = models.CharField('nombre (inglés)', max_length=100, blank=True)
    orden = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['orden', 'nombre']
        verbose_name_plural = 'categorías'

    def __str__(self):
        return self.nombre


class Producto(models.Model):
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name='productos')
    nombre = models.CharField(max_length=150)
    nombre_en = models.CharField('nombre (inglés)', max_length=150, blank=True)
    descripcion = models.TextField(blank=True)
    descripcion_en = models.TextField('descripción (inglés)', blank=True)
    precio = models.DecimalField(max_digits=6, decimal_places=2)
    precio_medio = models.DecimalField(
        max_digits=6, decimal_places=2, null=True, blank=True,
        help_text='Solo si también se sirve medio (p. ej. bocadillos)',
    )
    orden = models.PositiveIntegerField(default=0)
    disponible = models.BooleanField(default=True)

    class Meta:
        ordering = ['orden', 'nombre']

    def __str__(self):
        return self.nombre
