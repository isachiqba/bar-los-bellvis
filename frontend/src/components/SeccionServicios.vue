<script setup>
import { bar, whatsappUrl } from '../bar'
import { idioma, t, tr } from '../i18n'
import { icono } from '../halloween'

// Mensaje para WhatsApp: siempre en castellano, que es lo que lee el bar
function enlaceInfo(servicio) {
  const lineas = [`Hola, me gustaría más información sobre: ${servicio.titulo.es}`]
  if (idioma.value === 'en') lineas.push('(Consulta hecha desde la web en inglés)')
  return whatsappUrl(lineas.join('\n'))
}

const iconoMensaje = 'M7.9 20A9 9 0 1 0 4 16.1L2 22Z'

// Trazos de los iconos (estilo Lucide, 24×24)
const iconos = {
  fiesta: [
    'M5.8 11.3 2 22l10.7-3.79',
    'M4 3h.01',
    'M22 8h.01',
    'M15 2h.01',
    'M22 20h.01',
    'm22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10',
    'm22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17',
    'm11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7',
    'M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z',
  ],
  microfono: [
    'M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z',
    'M19 10v2a7 7 0 0 1-14 0v-2',
    'M12 19v3',
  ],
  corazon: [
    'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z',
  ],
  maletin: [
    'M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16',
    'M4 6h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z',
  ],
  cubiertos: [
    'M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2',
    'M7 2v20',
    'M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7',
  ],
}
</script>

<template>
  <section id="servicios" class="seccion">
    <div class="contenedor">
      <header v-reveal class="seccion__cabecera">
        <p class="antetitulo">{{ t('servicios.antetitulo') }}{{ icono('👻') }}</p>
        <h2>
          {{ t('servicios.titulo')[0] }} <span class="dorado">{{ t('servicios.titulo')[1] }}</span>
        </h2>
        <p>{{ t('servicios.intro') }}</p>
      </header>

      <ul class="servicios">
        <li
          v-for="(servicio, i) in bar.servicios"
          :key="servicio.icono"
          v-reveal="i * 100"
          class="servicio cristal"
        >
          <div v-if="servicio.foto" class="servicio__foto">
            <img :src="servicio.foto" alt="" loading="lazy" />
          </div>
          <div class="servicio__cuerpo">
            <span class="servicio__icono">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path v-for="d in iconos[servicio.icono]" :key="d" :d="d" />
              </svg>
            </span>
            <h3>{{ tr(servicio.titulo) }}</h3>
            <p>{{ tr(servicio.texto) }}</p>
            <a
              :href="enlaceInfo(servicio)"
              target="_blank"
              rel="noopener"
              class="boton boton--borde boton--pequeno servicio__boton"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true"><path :d="iconoMensaje" /></svg>
              {{ t('servicios.saberMas') }}
            </a>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
/* Flex en vez de grid para que la última fila quede centrada (5 servicios = 3 + 2) */
.servicios {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.servicio {
  display: flex;
  flex: 1 1 18rem;
  flex-direction: column;
  max-width: 23rem;
  border-radius: 1.25rem;
  overflow: hidden;
  transition:
    border-color 0.3s,
    transform 0.3s,
    opacity 0.8s;
}

.servicio:hover {
  border-color: rgb(212 168 67 / 0.45);
}

.servicio__foto {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
}

/* Funde la foto con el fondo de la tarjeta */
.servicio__foto::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 55%, rgb(13 11 8 / 0.85));
}

.servicio__foto img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s;
}

.servicio:hover .servicio__foto img {
  transform: scale(1.06);
}

.servicio__cuerpo {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  padding: 2rem 1.75rem;
}

/* Abajo del todo, para que los botones queden alineados entre tarjetas */
.servicio__boton {
  margin-top: auto;
}

.servicio__boton svg {
  width: 1rem;
  height: 1rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* Con foto, el icono se monta sobre el borde inferior de la imagen */
.servicio__foto + .servicio__cuerpo {
  position: relative;
  padding-top: 0;
}

.servicio__foto + .servicio__cuerpo .servicio__icono {
  margin-top: -1.625rem;
  background: #1f1a12;
  border-color: rgb(212 168 67 / 0.5);
}

.servicio__icono {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  width: 3.25rem;
  height: 3.25rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgb(212 168 67 / 0.3);
  border-radius: 50%;
  background: rgb(212 168 67 / 0.1);
  color: var(--color-oro);
}

.servicio__icono svg {
  width: 1.4rem;
  height: 1.4rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.75;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.servicio h3 {
  margin-bottom: 0.75rem;
  font-size: 1.35rem;
}

.servicio p {
  margin: 0 0 1.5rem;
  font-size: 0.9rem;
  color: var(--color-suave);
}
</style>
