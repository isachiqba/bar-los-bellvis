<script setup>
import { computed, onMounted, ref } from 'vue'
import { mapaUrl } from '../bar'
import { campo, t } from '../i18n'
import { urlDatos } from '../datos'

const fotos = ref([])
const cargada = ref(false)
const ampliada = ref(null)
const dialogo = ref(null)

// Con pocas fotos el mosaico queda descompensado: se muestran centradas y del mismo tamaño
const pocas = computed(() => fotos.value.length < 4)

onMounted(async () => {
  try {
    const respuesta = await fetch(urlDatos('galeria'))
    if (respuesta.ok) fotos.value = await respuesta.json()
  } finally {
    cargada.value = true
  }
})

const abrir = (foto) => {
  ampliada.value = foto
  dialogo.value.showModal()
}
</script>

<template>
  <section id="galeria" class="seccion">
    <div class="contenedor">
      <header v-reveal class="seccion__cabecera">
        <p class="antetitulo">{{ t('galeria.antetitulo') }}</p>
        <h2>
          {{ t('galeria.titulo')[0] }} <span class="dorado">{{ t('galeria.titulo')[1] }}</span>
        </h2>
        <p>{{ t('galeria.intro') }}</p>
      </header>

      <div v-if="fotos.length" class="rejilla" :class="{ 'rejilla--pocas': pocas }">
        <button
          v-for="(foto, i) in fotos"
          :key="foto.id"
          v-reveal="(i % 4) * 80"
          class="rejilla__foto"
          :class="{ 'rejilla__foto--grande': !pocas && i % 7 === 0 }"
          @click="abrir(foto)"
        >
          <img
            :src="foto.imagen"
            :alt="campo(foto, 'titulo') || t('galeria.fotoDelBar')"
            loading="lazy"
          />
          <span v-if="foto.titulo" class="rejilla__titulo">{{ campo(foto, 'titulo') }}</span>
        </button>
      </div>

      <div v-else-if="cargada" v-reveal class="sin-fotos cristal">
        <p>{{ t('galeria.sinFotos') }}</p>
        <a :href="mapaUrl" target="_blank" rel="noopener" class="boton boton--borde boton--pequeno">
          {{ t('galeria.verEnMaps') }}
        </a>
      </div>
    </div>

    <dialog ref="dialogo" class="visor" @click="dialogo.close()">
      <figure v-if="ampliada">
        <img :src="ampliada.imagen" :alt="campo(ampliada, 'titulo') || t('galeria.fotoDelBar')" />
        <figcaption v-if="ampliada.titulo">{{ campo(ampliada, 'titulo') }}</figcaption>
      </figure>
      <button class="visor__cerrar" :aria-label="t('galeria.cerrar')">×</button>
    </dialog>
  </section>
</template>

<style scoped>
.rejilla {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 14rem;
  grid-auto-flow: dense;
  gap: 1rem;
}

.rejilla--pocas {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.rejilla--pocas .rejilla__foto {
  width: min(100%, 24rem);
  aspect-ratio: 4 / 5;
}

.rejilla__foto {
  position: relative;
  padding: 0;
  border: 0;
  border-radius: 1rem;
  overflow: hidden;
  background: var(--color-fondo-alt);
  cursor: zoom-in;
}

.rejilla__foto--grande {
  grid-column: span 2;
  grid-row: span 2;
}

.rejilla__foto img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.rejilla__foto:hover img {
  transform: scale(1.05);
}

.rejilla__titulo {
  position: absolute;
  inset: auto 0 0;
  padding: 2.5rem 1rem 0.9rem;
  background: linear-gradient(to top, rgb(13 11 8 / 0.85), transparent);
  color: #fff;
  font-size: 0.85rem;
  font-weight: 500;
  text-align: left;
  opacity: 0;
  transition: opacity 0.3s;
}

.rejilla__foto:hover .rejilla__titulo,
.rejilla__foto:focus-visible .rejilla__titulo {
  opacity: 1;
}

@media (max-width: 760px) {
  .rejilla {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 10rem;
  }
}

.sin-fotos {
  max-width: 32rem;
  margin: 0 auto;
  padding: 2.5rem 2rem;
  border-radius: 1.5rem;
  text-align: center;
}

.sin-fotos p {
  margin: 0 0 1.5rem;
  color: var(--color-suave);
}

.visor {
  max-width: min(92vw, 1100px);
  max-height: 92vh;
  padding: 0;
  border: 0;
  background: transparent;
  overflow: visible;
}

.visor::backdrop {
  background: rgb(7 5 3 / 0.92);
}

.visor figure {
  margin: 0;
}

.visor img {
  display: block;
  max-width: 100%;
  max-height: 84vh;
  border-radius: 0.75rem;
}

.visor figcaption {
  margin-top: 0.75rem;
  text-align: center;
  color: var(--color-suave);
  font-size: 0.9rem;
}

.visor__cerrar {
  position: fixed;
  top: 1rem;
  right: 1.25rem;
  background: none;
  border: 0;
  color: var(--color-texto);
  font-size: 2.5rem;
  line-height: 1;
  cursor: pointer;
}
</style>
