<script setup>
import { computed, onMounted, ref } from 'vue'
import { campo, localeIntl, t } from '../i18n'
import { urlDatos } from '../datos'

const categorias = ref([])
const activa = ref(null)
const estado = ref('cargando') // cargando | listo | error

const formatoPrecio = computed(
  () => new Intl.NumberFormat(localeIntl.value, { style: 'currency', currency: 'EUR' }),
)
const precio = (valor) => formatoPrecio.value.format(valor)

const categoriaActiva = computed(() => categorias.value.find((c) => c.id === activa.value))

onMounted(async () => {
  try {
    const respuesta = await fetch(urlDatos('carta'))
    if (!respuesta.ok) throw new Error(respuesta.statusText)
    categorias.value = (await respuesta.json()).filter((c) => c.productos.length)
    activa.value = categorias.value[0]?.id ?? null
    estado.value = 'listo'
  } catch {
    estado.value = 'error'
  }
})
</script>

<template>
  <section id="carta" class="seccion seccion--alt">
    <div class="contenedor">
      <header v-reveal class="seccion__cabecera">
        <p class="antetitulo">{{ t('carta.antetitulo') }}</p>
        <h2>
          {{ t('carta.titulo')[0] }} <span class="dorado">{{ t('carta.titulo')[1] }}</span>
          {{ t('carta.titulo')[2] }}
        </h2>
        <p>{{ t('carta.intro') }}</p>
      </header>

      <p v-if="estado === 'cargando'" class="aviso">{{ t('carta.cargando') }}</p>
      <p v-else-if="estado === 'error'" class="aviso">{{ t('carta.error') }}</p>
      <p v-else-if="!categorias.length" class="aviso">{{ t('carta.vacia') }}</p>

      <template v-else>
        <div v-reveal class="pestanas" role="tablist">
          <button
            v-for="categoria in categorias"
            :key="categoria.id"
            role="tab"
            :aria-selected="categoria.id === activa"
            class="pestana"
            :class="{ 'pestana--activa': categoria.id === activa }"
            @click="activa = categoria.id"
          >
            {{ campo(categoria, 'nombre') }}
          </button>
        </div>

        <ul :key="activa" class="platos" role="tabpanel">
          <li
            v-for="(producto, i) in categoriaActiva.productos"
            :key="producto.id"
            class="plato cristal entrada"
            :style="{ animationDelay: `${i * 60}ms` }"
          >
            <div class="plato__fila">
              <h3>{{ campo(producto, 'nombre') }}</h3>
              <span v-if="!producto.precio_medio" class="plato__precio">
                {{ precio(producto.precio) }}
              </span>
            </div>
            <p v-if="campo(producto, 'descripcion')">{{ campo(producto, 'descripcion') }}</p>
            <div v-if="producto.precio_medio" class="plato__precios">
              <span class="plato__precio"
                >{{ t('carta.entero') }} {{ precio(producto.precio) }}</span
              >
              <span class="plato__precio plato__precio--suave">
                {{ t('carta.medio') }} {{ precio(producto.precio_medio) }}
              </span>
            </div>
          </li>
        </ul>
      </template>
    </div>
  </section>
</template>

<style scoped>
.aviso {
  text-align: center;
  color: var(--color-suave);
}

.pestanas {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 3rem;
}

.pestana {
  padding: 0.75rem 1.5rem;
  border: 1px solid rgb(212 168 67 / 0.3);
  border-radius: 999px;
  background: transparent;
  color: rgb(255 243 224 / 0.7);
  font: 600 0.875rem var(--fuente-texto);
  letter-spacing: 0.03em;
  cursor: pointer;
  transition: all 0.3s;
}

.pestana:hover {
  border-color: var(--color-oro);
  color: var(--color-oro);
}

.pestana--activa,
.pestana--activa:hover {
  background: var(--color-oro);
  border-color: var(--color-oro);
  color: var(--color-fondo);
  box-shadow: 0 10px 25px -10px rgb(212 168 67 / 0.5);
}

.platos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(17rem, 1fr));
  gap: 1.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.plato {
  padding: 1.5rem;
  border-radius: 1rem;
  transition:
    border-color 0.3s,
    transform 0.3s;
}

.plato:hover {
  border-color: rgb(212 168 67 / 0.45);
  transform: translateY(-4px);
}

.plato__fila {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.plato h3 {
  font-family: var(--fuente-texto);
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
  transition: color 0.3s;
}

.plato:hover h3 {
  color: var(--color-oro);
}

.plato__precio {
  flex-shrink: 0;
  padding: 0.2rem 0.75rem;
  border-radius: 999px;
  background: var(--color-oro);
  color: var(--color-fondo);
  font-size: 0.875rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.plato__precios {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 1rem;
}

.plato__precios .plato__precio {
  padding: 0.2rem 0.6rem;
  font-size: 0.8rem;
}

.plato__precio--suave {
  background: transparent;
  border: 1px solid rgb(212 168 67 / 0.5);
  color: var(--color-oro);
}

.plato p {
  margin: 0.5rem 0 0;
  font-size: 0.8rem;
  color: rgb(255 243 224 / 0.55);
}
</style>
