<script setup>
import { computed } from 'vue'
import SeccionCarta from '../components/SeccionCarta.vue'
import SeccionGaleria from '../components/SeccionGaleria.vue'
import SeccionServicios from '../components/SeccionServicios.vue'
import SeccionVisita from '../components/SeccionVisita.vue'
import { bar, estadoHoy } from '../bar'
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

      <div class="contenedor portada__rejilla">
        <div class="portada__texto">
          <p class="insignia entrada">
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

          <div class="flotante flotante--arriba">
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
  outline-offset: 12px;
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

  .datos dd {
    font-size: 0.7rem;
  }
}
</style>
