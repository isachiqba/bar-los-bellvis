from django.contrib import admin

from .models import Categoria, Producto


class ProductoInline(admin.TabularInline):
    model = Producto
    extra = 1


@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'orden']
    list_editable = ['orden']
    inlines = [ProductoInline]


@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'categoria', 'precio', 'precio_medio', 'orden', 'disponible']
    list_filter = ['categoria', 'disponible']
    list_editable = ['precio', 'precio_medio', 'orden', 'disponible']
    search_fields = ['nombre']
