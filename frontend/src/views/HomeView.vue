<script setup>
import { computed } from 'vue'
import SeccionCarta from '../components/SeccionCarta.vue'
import SeccionGaleria from '../components/SeccionGaleria.vue'
import SeccionServicios from '../components/SeccionServicios.vue'
import SeccionVisita from '../components/SeccionVisita.vue'
import { bar, estadoHoy } from '../bar'
import { esHalloween } from '../halloween'
import { localeIntl, t } from '../i18n'

const hoy = estadoHoy()

const datos = computed(() => [
  { icono: 'estrella', valor: bar.valoracion.nota, texto: t('portada.enGoogle') },
  { icono: 'reloj', valor: '8:30', texto: t('portada.abrimos') },
  { icono: 'grupo', valor: t('portada.dias'), texto: t('portada.semana') },
])
const diaHoy = computed(() =>
  new Intl.DateTimeFormat(localeIntl.value, { weekday: 'long' }).format(new Date()),
)

// Iconos (estilo Lucide, 24×24)
const iconos = {
  ubicacion: [
    'M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0',
    'M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',
  ],
  calendario: [
    'M8 2v4',
    'M16 2v4',
    'M3 10h18',
    'M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z',
  ],
  lista: ['M3 12h.01', 'M3 18h.01', 'M3 6h.01', 'M8 12h13', 'M8 18h13', 'M8 6h13'],
  estrella: [
    'M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.12 2.12 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.12 2.12 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.12 2.12 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16z',
  ],
  reloj: ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z', 'M12 6v6l4 2'],
  grupo: [
    'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2',
    'M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z',
    'M22 21v-2a4 4 0 0 0-3-3.87',
    'M16 3.13a4 4 0 0 1 0 7.75',
  ],
}

const microfono = [
  'M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z',
  'M19 10v2a7 7 0 0 1-14 0v-2',
  'M12 19v3',
]
</script>

<template>
  <main>
    <section id="inicio" class="portada">
      <!-- Fondo: la foto de portada desenfocada y oscurecida -->
      <img
        v-if="bar.fotoPortada"
        :src="bar.fotoPortada"
        alt=""
        class="portada__fondo"
        fetchpriority="high"
      />
      <div class="portada__velo"></div>

      <!-- Halloween: telaraña en la esquina (solo en temporada) -->
      <template v-if="esHalloween">
        <svg class="telarana" viewBox="0 0 200 200" aria-hidden="true">
          <path
            class="telarana__radios"
            d="M0 0L200.0 0.0M0 0L196.3 38.2M0 0L184.1 78.1M0 0L163.8 114.7M0 0L136.4 146.3M0 0L103.0 171.4M0 0L65.1 189.1M0 0L24.4 198.5M0 0L0.0 200.0"
          />
          <path
            d="M22.0 0.0Q18.8 1.8 21.6 4.2Q18.1 5.5 20.3 8.6Q16.5 9.2 18.0 12.6Q14.3 12.4 15.0 16.1Q11.4 15.1 11.3 18.9Q8.0 17.1 7.2 20.8Q4.3 18.4 2.7 21.8Q1.2 18.9 0.0 22.0M40.0 0.0Q34.2 3.3 39.3 7.6Q32.9 10.1 36.8 15.6Q30.1 16.7 32.8 22.9Q26.0 22.6 27.3 29.3Q20.7 27.5 20.6 34.3Q14.5 31.2 13.0 37.8Q7.7 33.5 4.9 39.7Q2.1 34.3 0.0 40.0M60.0 0.0Q51.4 4.9 58.9 11.4Q49.3 15.1 55.2 23.4Q45.1 25.0 49.1 34.4Q38.9 33.9 40.9 43.9Q31.1 41.2 30.9 51.4Q21.8 46.8 19.5 56.7Q11.6 50.3 7.3 59.6Q3.2 51.5 0.0 60.0M82.0 0.0Q70.2 6.8 80.5 15.6Q67.4 20.6 75.5 32.0Q61.7 34.2 67.2 47.0Q53.2 46.3 55.9 60.0Q42.4 56.3 42.2 70.3Q29.8 63.9 26.7 77.5Q15.9 68.7 10.0 81.4Q4.3 70.4 0.0 82.0M106.0 0.0Q90.7 8.7 104.1 20.2Q87.2 26.7 97.6 41.4Q79.7 44.2 86.8 60.8Q68.8 59.8 72.3 77.5Q54.9 72.8 54.6 90.9Q38.5 82.6 34.5 100.2Q20.5 88.8 12.9 105.2Q5.6 91.0 0.0 106.0M132.0 0.0Q113.0 10.9 129.6 25.2Q108.6 33.2 121.5 51.6Q99.3 55.0 108.1 75.7Q85.7 74.5 90.0 96.5Q68.3 90.7 68.0 113.1Q48.0 102.9 43.0 124.8Q25.5 110.6 16.1 131.0Q6.9 113.3 0.0 132.0M160.0 0.0Q137.0 13.2 157.1 30.5Q131.6 40.2 147.3 62.5Q120.3 66.7 131.1 91.8Q103.8 90.3 109.1 117.0Q82.8 109.9 82.4 137.1Q58.2 124.7 52.1 151.3Q31.0 134.1 19.5 158.8Q8.4 137.3 0.0 160.0M188.0 0.0Q160.9 15.5 184.5 35.9Q154.6 47.3 173.1 73.5Q141.4 78.4 154.0 107.8Q122.0 106.1 128.2 137.5Q97.3 129.1 96.8 161.1Q68.3 146.5 61.2 177.8Q36.4 157.5 22.9 186.6Q9.9 161.4 0.0 188.0"
          />
          <!-- Hilo suelto con una arañita colgando -->
          <path class="telarana__hilo" d="M128 96V176" />
          <circle class="telarana__arana" cx="128" cy="180" r="4" />
        </svg>
      </template>

      <div class="contenedor portada__rejilla">
        <div class="portada__texto">
          <p v-if="esHalloween" class="insignia insignia--halloween entrada">
            🎃 {{ t('halloween.banner') }}
          </p>
          <p v-else class="insignia entrada">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path v-for="d in iconos.ubicacion" :key="d" :d="d" />
            </svg>
            Bar · Plaça Major · Benissuera
          </p>

          <h1 class="entrada" style="animation-delay: 150ms">
            {{ t('portada.titulo')[0] }}
            <span class="dorado">{{ t('portada.titulo')[1] }}</span>
          </h1>

          <p class="portada__lema entrada" style="animation-delay: 350ms">
            {{ t('portada.lema') }}
          </p>

          <div class="portada__botones entrada" style="animation-delay: 450ms">
            <a href="#reservas" class="boton">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path v-for="d in iconos.calendario" :key="d" :d="d" />
              </svg>
              {{ t('nav.reservar') }}
            </a>
            <a href="#carta" class="boton boton--borde">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path v-for="d in iconos.lista" :key="d" :d="d" />
              </svg>
              {{ t('portada.verCarta') }}
            </a>
          </div>

          <dl class="datos entrada" style="animation-delay: 600ms">
            <div v-for="dato in datos" :key="dato.icono">
              <dt>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path v-for="d in iconos[dato.icono]" :key="d" :d="d" />
                </svg>
                {{ dato.valor }}
              </dt>
              <dd>{{ dato.texto }}</dd>
            </div>
          </dl>
        </div>

        <div class="destacado entrada" style="animation-delay: 400ms">
          <div class="destacado__circulo">
            <img src="/fotos/destacado.jpg" :alt="t('portada.alt')" />
          </div>

          <a
            v-if="esHalloween"
            href="#reservas"
            class="flotante flotante--arriba flotante--halloween"
          >
            <p class="flotante__etiqueta">👻 {{ t('halloween.noche') }}</p>
            <p class="flotante__texto">{{ t('halloween.celebrar') }} →</p>
          </a>
          <div v-else class="flotante flotante--arriba">
            <p class="flotante__etiqueta">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path v-for="d in microfono" :key="d" :d="d" />
              </svg>
              {{ t('portada.karaoke') }}
            </p>
            <p class="flotante__texto">{{ t('portada.karaokeTexto') }}</p>
          </div>

          <div class="flotante flotante--abajo">
            <p class="flotante__etiqueta">{{ t('portada.hoy') }} · {{ diaHoy }}</p>
            <p class="flotante__texto estado" :class="{ 'estado--abierto': hoy.abierto }">
              <span class="estado__punto"></span>
              {{ t(hoy.abierto ? 'portada.abierto' : 'portada.cerrado') }}
            </p>
            <p class="flotante__horas">
              {{ hoy.turnos.length ? hoy.turnos.join(' / ') : t('portada.descansamos') }}
            </p>
          </div>
        </div>
      </div>

      <a href="#servicios" class="portada__bajar" :aria-label="t('portada.bajar')">
        <span>{{ t('portada.descubrir') }}</span>
        <i></i>
      </a>
    </section>

    <SeccionServicios />

    <SeccionCarta />

    <SeccionGaleria />

    <SeccionVisita />
  </main>
</template>

<style scoped>
/* Portada: foto desenfocada de fondo, texto a la izquierda e imagen destacada a la derecha */
.portada {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 100vh;
  min-height: 100svh;
  overflow: hidden;
  background: var(--color-fondo-alt);
}

.portada__fondo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(3px) saturate(1.1);
  /* Ampliada para que el desenfoque no deje bordes claros */
  transform: scale(1.08);
}

.portada__velo {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to right, rgb(13 11 8 / 0.85) 20%, rgb(13 11 8 / 0.55) 60%, rgb(13 11 8 / 0.7)),
    linear-gradient(
      to bottom,
      rgb(13 11 8 / 0.6),
      transparent 30%,
      transparent 70%,
      var(--color-fondo)
    );
}

.portada__rejilla {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1.05fr;
  align-items: center;
  gap: 3rem;
  padding-top: 7.5rem;
  padding-bottom: 7rem;
}

.portada__texto > * + * {
  margin-top: 1.75rem;
}

.insignia {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  margin: 0;
  padding: 0.5rem 1rem;
  border: 1px solid rgb(212 168 67 / 0.35);
  border-radius: 999px;
  background: rgb(212 168 67 / 0.1);
  color: var(--color-oro);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

/* Halloween: toques naranja y morado sin cambiar el estilo del bar */
.insignia--halloween {
  font-size: 0.85rem;
  letter-spacing: 0.01em;
  text-transform: none;
  border-color: rgb(224 122 31 / 0.5);
  background: rgb(224 122 31 / 0.12);
  color: #f0a052;
}

.flotante--halloween {
  border-color: rgb(224 122 31 / 0.45);
  color: var(--color-texto);
}

.flotante--halloween .flotante__etiqueta {
  color: #f0a052;
}

.flotante--halloween:hover {
  border-color: #f0a052;
}

.telarana {
  position: absolute;
  top: var(--alto-cabecera);
  left: 0;
  width: 17rem;
  height: 17rem;
  fill: none;
  stroke: rgb(255 243 224 / 0.3);
  stroke-width: 0.7;
  pointer-events: none;
}

.telarana__radios {
  stroke: rgb(255 243 224 / 0.38);
  stroke-width: 0.9;
}

.telarana__hilo {
  stroke-width: 0.5;
}

.telarana__arana {
  fill: #1c140c;
  stroke: rgb(240 160 82 / 0.7);
  stroke-width: 1;
  transform-origin: 128px 96px;
  animation: colgar 4s ease-in-out infinite;
}

@keyframes colgar {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.insignia svg,
.portada__botones svg,
.datos svg {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.portada h1 {
  font-size: clamp(3rem, 7vw, 5.75rem);
  font-weight: 800;
  line-height: 1;
  text-shadow: 0 4px 24px rgb(0 0 0 / 0.5);
}

.portada h1 .dorado {
  display: block;
}

.portada__lema {
  max-width: 30rem;
  font-size: clamp(1.1rem, 1.8vw, 1.35rem);
  font-weight: 500;
  color: var(--color-texto);
}

.portada__botones {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.portada__botones .boton--borde {
  background: rgb(13 11 8 / 0.4);
}

.datos {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 0;
}

.datos > div {
  padding: 0 1.75rem;
  border-left: 1px solid rgb(212 168 67 / 0.25);
}

.datos > div:first-child {
  padding-left: 0;
  border-left: 0;
}

.datos dt {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--fuente-titulos);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-oro);
}

.datos dt svg {
  width: 1.2rem;
  height: 1.2rem;
}

.datos dd {
  margin: 0.2rem 0 0;
  font-size: 0.75rem;
  color: rgb(255 243 224 / 0.6);
}

/* Imagen destacada en círculo con etiquetas flotantes */
.destacado {
  position: relative;
  justify-self: center;
  width: min(100%, 34rem);
  aspect-ratio: 1;
}

.destacado__circulo {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgb(212 168 67 / 0.6);
  box-shadow: 0 40px 80px -20px rgb(0 0 0 / 0.7);
  /* Anillo exterior: solo la línea dorada, sin relleno */
  outline: 1.5px solid rgb(212 168 67 / 0.5);
  outline-offset: 6px;
}

.destacado__circulo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.flotante {
  position: absolute;
  padding: 0.7rem 1rem;
  border: 1px solid rgb(212 168 67 / 0.25);
  border-radius: 0.9rem;
  background: rgb(13 11 8 / 0.75);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  box-shadow: 0 15px 35px -10px rgb(0 0 0 / 0.6);
  animation: flotar 6s ease-in-out infinite;
}

.flotante p {
  margin: 0;
}

.flotante--arriba {
  top: 4%;
  right: -6%;
}

.flotante--abajo {
  bottom: 2%;
  left: -8%;
  animation-delay: -3s;
}

.flotante__etiqueta {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  color: var(--color-oro);
  font-size: 0.72rem;
  font-weight: 600;
}

.flotante__etiqueta svg {
  width: 0.85rem;
  height: 0.85rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.flotante__texto {
  margin-top: 0.15rem !important;
  font-size: 0.9rem;
  font-weight: 600;
}

.flotante__horas {
  font-size: 0.75rem;
  color: rgb(255 243 224 / 0.6);
  font-variant-numeric: tabular-nums;
}

.estado {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.estado__punto {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #c4573a;
}

.estado--abierto .estado__punto {
  background: #4caf6e;
  box-shadow: 0 0 0 3px rgb(76 175 110 / 0.25);
}

@keyframes flotar {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .flotante {
    animation: none;
  }
}

.portada__bajar {
  position: absolute;
  bottom: 1.75rem;
  left: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  transform: translateX(-50%);
  color: rgb(255 243 224 / 0.45);
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.portada__bajar i {
  width: 1px;
  height: 2rem;
  background: linear-gradient(to bottom, var(--color-oro), transparent);
}

/* En pantallas medianas el círculo llega al borde: la tarjeta no debe salirse */
@media (max-width: 1200px) {
  .flotante--arriba {
    right: 0;
  }
}

@media (max-width: 900px) {
  .portada__rejilla {
    grid-template-columns: 1fr;
    gap: 3.5rem;
    padding-bottom: 5rem;
  }

  .destacado {
    width: min(84%, 23rem);
  }

  .flotante--arriba {
    right: -12%;
  }

  .flotante--abajo {
    left: -14%;
  }

  .portada__bajar {
    display: none;
  }
}

@media (max-width: 520px) {
  .portada__botones {
    flex-wrap: nowrap;
    gap: 0.6rem;
  }

  .portada__botones .boton {
    flex: 1 1 0;
    gap: 0.4rem;
    padding: 0.85rem 0.5rem;
    font-size: 0.9rem;
    white-space: nowrap;
  }

  /* Tres columnas iguales para que las cifras no salten de línea */
  .datos {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }

  .datos > div {
    padding: 0 0.75rem;
  }

  .datos dt {
    gap: 0.35rem;
    font-size: 1.2rem;
  }

  .datos dt svg {
    width: 1rem;
    height: 1rem;
  }

  .datos dd {
    font-size: 0.7rem;
  }

  .telarana {
    width: 9rem;
    height: 9rem;
  }

  .insignia--halloween {
    font-size: 0.75rem;
  }

  /* Tarjetas flotantes más compactas en móvil */
  .flotante {
    padding: 0.45rem 0.65rem;
    border-radius: 0.7rem;
  }

  .flotante__etiqueta {
    font-size: 0.62rem;
  }

  .flotante__etiqueta svg {
    width: 0.7rem;
    height: 0.7rem;
  }

  .flotante__texto {
    font-size: 0.75rem;
  }

  .flotante__horas {
    font-size: 0.62rem;
  }

  .estado__punto {
    width: 6px;
    height: 6px;
  }

  .flotante--arriba {
    top: 2%;
    right: -6%;
  }

  .flotante--abajo {
    bottom: 4%;
    left: -8%;
  }
}
</style>
