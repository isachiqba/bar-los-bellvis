from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

admin.site.site_header = 'Bar los Bellvis'
admin.site.site_title = 'Bar los Bellvis'

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('carta.urls')),
    path('api/', include('galeria.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)  # solo sirve /media/ con DEBUG
