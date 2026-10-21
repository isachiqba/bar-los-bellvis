<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterView } from 'vue-router'
import { bar, mapaUrl, telefonoEnlace } from './bar'
import { idioma, idiomas, t, tr } from './i18n'

const enlaces = [
  { href: '#servicios', clave: 'nav.servicios' },
  { href: '#carta', clave: 'nav.carta' },
  { href: '#galeria', clave: 'nav.galeria' },
  { href: '#visitanos', clave: 'nav.visitanos' },
]

const conScroll = ref(false)
const menuAbierto = ref(false)

const alHacerScroll = () => {
  conScroll.value = window.scrollY > 40
}

onMounted(() => {
  alHacerScroll()
  window.addEventListener('scroll', alHacerScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', alHacerScroll))
</script>

<template>
  <header
    class="cabecera"
    :class="{ 'cabecera--solida': conScroll || menuAbierto, 'cabecera--abierta': menuAbierto }"
  >
    <nav class="contenedor cabecera__fila">
      <a href="#inicio" class="marca" @click="menuAbierto = false">
        <span class="marca__nombre"><span class="dorado">Bar</span> Los Bellvis</span>
        <span class="marca__sub">Benissuera · Valencia</span>
      </a>

      <ul class="cabecera__enlaces">
        <li v-for="enlace in enlaces" :key="enlace.href">
          <a :href="enlace.href">{{ t(enlace.clave) }}</a>
        </li>
      </ul>

      <a href="#reservas" class="boton boton--pequeno cabecera__reservar">
        {{ t('nav.reservar') }}
      </a>

      <button
        class="cabecera__hamburguesa"
        :aria-expanded="menuAbierto"
        :aria-label="t('nav.abrirMenu')"
        @click="menuAbierto = !menuAbierto"
      >
        <span></span><span></span><span></span>
      </button>

      <!-- Siempre el último elemento de la barra -->
      <div class="idiomas" role="group" :aria-label="t('nav.idioma')">
        <button
          v-for="codigo in idiomas"
          :key="codigo"
          :lang="codigo"
          class="idiomas__boton"
          :class="{ 'idiomas__boton--activo': idioma === codigo }"
          :aria-pressed="idioma === codigo"
          @click="idioma = codigo"
        >
          {{ codigo.toUpperCase() }}
        </button>
      </div>
    </nav>

    <div v-if="menuAbierto" class="menu-movil">
      <a
        v-for="enlace in enlaces"
        :key="enlace.href"
        :href="enlace.href"
        @click="menuAbierto = false"
      >
        {{ t(enlace.clave) }}
      </a>
      <a href="#reservas" class="boton" @click="menuAbierto = false">{{ t('nav.reservar') }}</a>
    </div>
  </header>

  <RouterView />

  <footer class="pie">
    <div class="contenedor pie__rejilla">
      <div>
        <p class="marca__nombre"><span class="dorado">Bar</span> Los Bellvis</p>
        <p class="marca__sub">{{ t('pie.sub') }}</p>
        <p class="pie__texto">{{ tr(bar.lema) }}.</p>
      </div>
      <div>
        <h3 class="pie__titulo">{{ t('pie.contacto') }}</h3>
        <a :href="mapaUrl" target="_blank" rel="noopener" class="pie__enlace">
          {{ bar.direccion }}, {{ bar.localidad }}
        </a>
        <a :href="telefonoEnlace" class="pie__enlace">{{ bar.telefono }}</a>
      </div>
      <div>
        <h3 class="pie__titulo">{{ t('pie.navegacion') }}</h3>
        <a v-for="enlace in enlaces" :key="enlace.href" :href="enlace.href" class="pie__enlace">
          {{ t(enlace.clave) }}
        </a>
      </div>
    </div>
    <p class="pie__copy">
      © {{ new Date().getFullYear() }} {{ bar.nombre }} · {{ t('pie.desarrolladoPor') }}
      <a href="https://lorba.es" target="_blank" rel="noopener" class="pie__autor">Lorba SL</a>
    </p>
  </footer>
</template>

<style scoped>
.cabecera {
  position: fixed;
  inset: 0 0 auto;
  z-index: 50;
  border-bottom: 1px solid transparent;
  transition:
    background 0.5s,
    border-color 0.5s;
}

.cabecera--solida {
  background: rgb(13 11 8 / 0.85);
  border-bottom-color: rgb(212 168 67 / 0.2);
  -webkit-backdrop-filter: blur(16px);
  backdrop-filter: blur(16px);
}

.cabecera--abierta {
  background: var(--color-fondo);
}

.cabecera__fila {
  display: flex;
  align-items: center;
  gap: 2rem;
  height: var(--alto-cabecera);
}

.marca {
  display: flex;
  flex-direction: column;
  line-height: 1;
  margin-right: auto;
}

.marca__nombre {
  margin: 0;
  white-space: nowrap;
  font-family: var(--fuente-titulos);
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-texto);
}

.marca__sub {
  margin: 0.35rem 0 0;
  font-size: 0.625rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgb(212 168 67 / 0.7);
}

.cabecera__enlaces {
  display: flex;
  gap: 2rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.cabecera__enlaces a {
  font-size: 0.875rem;
  letter-spacing: 0.03em;
  color: rgb(255 243 224 / 0.8);
}

.cabecera__enlaces a:hover {
  color: var(--color-oro);
}

.idiomas {
  display: flex;
  padding: 3px;
  border: 1px solid rgb(212 168 67 / 0.3);
  border-radius: 999px;
}

.idiomas__boton {
  padding: 0.3rem 0.6rem;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: rgb(255 243 224 / 0.7);
  font: 600 0.75rem var(--fuente-texto);
  letter-spacing: 0.05em;
  cursor: pointer;
  transition:
    background 0.3s,
    color 0.3s;
}

.idiomas__boton:hover {
  color: var(--color-oro);
}

.idiomas__boton--activo,
.idiomas__boton--activo:hover {
  background: var(--color-oro);
  color: var(--color-fondo);
}

.cabecera__hamburguesa {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 0.5rem;
  background: none;
  border: 0;
  cursor: pointer;
}

.cabecera__hamburguesa span {
  width: 22px;
  height: 2px;
  background: var(--color-texto);
}

.menu-movil {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1rem 1.5rem 2rem;
}

.menu-movil a:not(.boton) {
  font-size: 1.125rem;
  color: rgb(255 243 224 / 0.8);
}

@media (max-width: 1023px) {
  .cabecera__enlaces,
  .cabecera__reservar {
    display: none;
  }

  .cabecera__hamburguesa {
    display: flex;
  }
}

@media (max-width: 480px) {
  .cabecera__fila {
    gap: 0.75rem;
  }

  .marca__nombre {
    font-size: 1.3rem;
  }

  .marca__sub {
    letter-spacing: 0.2em;
  }

  .idiomas__boton {
    padding: 0.25rem 0.5rem;
  }
}

.pie {
  padding: 5rem 0 2rem;
  background: var(--color-fondo-pie);
  border-top: 1px solid rgb(212 168 67 / 0.1);
}

.pie__rejilla {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  gap: 2.5rem;
}

.pie__texto {
  max-width: 20rem;
  margin: 1.25rem 0 0;
  font-size: 0.875rem;
  color: var(--color-tenue);
}

.pie__titulo {
  margin-bottom: 1rem;
  font-family: var(--fuente-texto);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-oro);
}

.pie__enlace {
  display: block;
  margin-bottom: 0.6rem;
  font-size: 0.875rem;
  color: var(--color-tenue);
}

.pie__copy {
  margin: 4rem 0 0;
  padding-top: 2rem;
  border-top: 1px solid rgb(212 168 67 / 0.08);
  text-align: center;
  font-size: 0.75rem;
  color: rgb(255 243 224 / 0.3);
}

.pie__autor {
  color: rgb(255 243 224 / 0.5);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.pie__autor:hover {
  color: var(--color-oro);
}
</style>
