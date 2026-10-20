from django.contrib import admin
from django.utils.html import format_html

from .models import Foto


@admin.register(Foto)
class FotoAdmin(admin.ModelAdmin):
    list_display = ['miniatura', 'titulo', 'orden', 'visible']
    list_display_links = ['miniatura', 'titulo']
    list_editable = ['orden', 'visible']

    @admin.display(description='foto')
    def miniatura(self, obj):
        return format_html('<img src="{}" style="height:60px;border-radius:4px">', obj.imagen.url)
