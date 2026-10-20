from django.test import TestCase

from .models import Categoria, Producto


class CartaApiTests(TestCase):
    def test_carta_solo_muestra_productos_disponibles(self):
        tapas = Categoria.objects.create(nombre='Tapas')
        Producto.objects.create(categoria=tapas, nombre='Patatas bravas', precio='4.50')
        Producto.objects.create(categoria=tapas, nombre='Agotado', precio='3.00', disponible=False)

        response = self.client.get('/api/carta/')

        self.assertEqual(response.status_code, 200)
        productos = response.json()[0]['productos']
        self.assertEqual([p['nombre'] for p in productos], ['Patatas bravas'])
