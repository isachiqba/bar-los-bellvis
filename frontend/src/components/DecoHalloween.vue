<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { esHalloween } from '../halloween'
import { t } from '../i18n'

const activo = esHalloween
const sinMovimiento = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
const vuelo = ref(0) // cambia la key para repetir la animación
const volando = ref(false)
const mensaje = ref(false)
let temporizadores = []

// Cada murciélago: altura de salida, tamaño, retraso, duración y dirección
const murcielagos = [
  { top: 18, tam: 160, retraso: 0, duracion: 9, alReves: false },
  { top: 34, tam: 112, retraso: 1, duracion: 10, alReves: false },
  { top: 10, tam: 86, retraso: 2, duracion: 10.5, alReves: true },
  { top: 48, tam: 128, retraso: 2.8, duracion: 9.5, alReves: true },
  { top: 26, tam: 74, retraso: 3.6, duracion: 11, alReves: false },
]

function soltarMurcielagos() {
  if (sinMovimiento) return
  vuelo.value++
  volando.value = true
  temporizadores.push(setTimeout(() => (volando.value = false), 15500))
}

function pulsarCalabaza() {
  soltarMurcielagos()
  mensaje.value = true
  temporizadores.push(setTimeout(() => (mensaje.value = false), 2600))
}

onMounted(() => {
  if (!activo) return
  // Una vez por visita al entrar, para no cansar
  let visto = false
  try {
    visto = sessionStorage.getItem('murcielagos') === '1'
    sessionStorage.setItem('murcielagos', '1')
  } catch {
    // Sin sessionStorage: se muestran igualmente
  }
  if (!visto) temporizadores.push(setTimeout(soltarMurcielagos, 900))
})

onBeforeUnmount(() => temporizadores.forEach(clearTimeout))
</script>

<template>
  <template v-if="activo">
    <div v-if="volando" :key="vuelo" class="murcielagos" aria-hidden="true">
      <img
        v-for="(m, i) in murcielagos"
        :key="i"
        src="/halloween/murcielago.webp"
        alt=""
        class="murcielago"
        :class="{ 'murcielago--reves': m.alReves }"
        :style="{
          top: `${m.top}%`,
          width: `${m.tam}px`,
          animationDelay: `${m.retraso}s`,
          animationDuration: `${m.duracion}s`,
        }"
      />
    </div>

    <div class="calabaza-caja">
      <span v-if="mensaje" class="calabaza__mensaje" role="status">{{ t('halloween.feliz') }}</span>
      <span v-if="!mensaje" class="calabaza__etiqueta" aria-hidden="true">Halloween</span>
      <button class="calabaza" :aria-label="t('halloween.calabaza')" @click="pulsarCalabaza">
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path class="calabaza__tallo" d="M30 14c0-5 2-9 6-10l2 3c-3 1-4 4-4 7z" />
          <ellipse class="calabaza__gajo" cx="20" cy="38" rx="14" ry="20" />
          <ellipse class="calabaza__gajo" cx="44" cy="38" rx="14" ry="20" />
          <ellipse class="calabaza__cuerpo" cx="32" cy="38" rx="15" ry="21" />
          <g class="calabaza__cara">
            <path d="M20 32l6-6 4 6z" />
            <path d="M34 32l4-6 6 6z" />
            <path d="M19 42c4 6 22 6 26 0l-4 1-2 3-3-3-4 3-3-3-3 3-3-3z" />
          </g>
        </svg>
      </button>
    </div>
  </template>
</template>

<style scoped>
/* Murciélagos: cruzan la pantalla una vez, por encima de todo pero sin tapar clics */
.murcielagos {
  position: fixed;
  inset: 0;
  z-index: 60;
  overflow: hidden;
  pointer-events: none;
}

.murcielago {
  position: absolute;
  left: 0;
  height: auto;
  opacity: 0;
  filter: drop-shadow(0 0 10px rgb(255 170 60 / 0.35));
  animation:
    cruzar linear forwards,
    aletear 0.6s ease-in-out infinite alternate;
}

.murcielago--reves {
  animation-name: cruzar-reves, aletear;
}

@keyframes aletear {
  from {
    scale: 1 1;
  }
  to {
    scale: 1 0.85;
  }
}

@keyframes cruzar {
  0% {
    opacity: 0;
    transform: translate(-10vw, 0);
  }
  8% {
    opacity: 1;
  }
  25% {
    transform: translate(20vw, -7vh);
  }
  50% {
    transform: translate(50vw, 3vh);
  }
  75% {
    transform: translate(80vw, -5vh);
  }
  92% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translate(110vw, 2vh);
  }
}

@keyframes cruzar-reves {
  0% {
    opacity: 0;
    transform: translate(110vw, 0) scaleX(-1);
  }
  8% {
    opacity: 1;
  }
  25% {
    transform: translate(80vw, 6vh) scaleX(-1);
  }
  50% {
    transform: translate(50vw, -4vh) scaleX(-1);
  }
  75% {
    transform: translate(20vw, 5vh) scaleX(-1);
  }
  92% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translate(-10vw, -2vh) scaleX(-1);
  }
}

/* Calabaza en la esquina inferior derecha (la caja no se mueve; la calabaza se balancea) */
.calabaza-caja {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  position: fixed;
  right: 1.25rem;
  bottom: 1.25rem;
  z-index: 40;
}

.calabaza {
  display: block;
  position: relative;
  width: 4.75rem;
  height: 4.75rem;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
  filter: drop-shadow(0 6px 14px rgb(0 0 0 / 0.5));
  transform-origin: 50% 100%;
  animation: balanceo 4s ease-in-out infinite;
  transition: transform 0.2s;
}

.calabaza:hover {
  animation-play-state: paused;
  transform: scale(1.12);
}

/* Halo naranja que late detrás de la calabaza */
.calabaza::before {
  content: '';
  position: absolute;
  inset: 8%;
  border-radius: 50%;
  background: radial-gradient(circle, rgb(255 140 0 / 0.55), transparent 70%);
  z-index: -1;
  animation: halo 2.4s ease-in-out infinite;
}

.calabaza__etiqueta {
  padding: 0.35rem 0.75rem;
  border: 1px solid rgb(224 122 31 / 0.5);
  border-radius: 999px;
  background: rgb(13 11 8 / 0.85);
  color: #f0a052;
  font: 600 0.75rem var(--fuente-texto);
  letter-spacing: 0.05em;
}

@keyframes halo {
  0%,
  100% {
    opacity: 0.5;
    transform: scale(0.9);
  }
  50% {
    opacity: 1;
    transform: scale(1.25);
  }
}

.calabaza svg {
  width: 100%;
  height: 100%;
}

.calabaza__gajo {
  fill: #c75f12;
}

.calabaza__cuerpo {
  fill: #e07a1f;
}

.calabaza__tallo {
  fill: #5d6b2c;
}

.calabaza__cara path {
  fill: #ffd36b;
  animation: vela 2.2s ease-in-out infinite;
}

.calabaza__mensaje {
  position: absolute;
  bottom: calc(100% + 0.6rem);
  right: 0;
  padding: 0.45rem 0.8rem;
  border: 1px solid rgb(212 168 67 / 0.35);
  border-radius: 999px;
  background: rgb(13 11 8 / 0.9);
  color: var(--color-oro);
  font: 600 0.8rem var(--fuente-texto);
  white-space: nowrap;
  animation: aparecer 0.3s ease-out;
}

@keyframes balanceo {
  0%,
  100% {
    transform: rotate(-6deg);
  }
  50% {
    transform: rotate(6deg);
  }
}

@keyframes vela {
  0%,
  100% {
    fill: #ffd36b;
    filter: drop-shadow(0 0 2px #ffb000);
  }
  45% {
    fill: #ffb347;
    filter: drop-shadow(0 0 5px #ff8a00);
  }
  60% {
    fill: #ffe08a;
  }
}

@keyframes aparecer {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
}

@media (max-width: 520px) {
  .calabaza-caja {
    right: 0.9rem;
    bottom: 0.9rem;
  }

  .calabaza {
    width: 3.75rem;
    height: 3.75rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .calabaza,
  .calabaza::before,
  .calabaza__cara path {
    animation: none;
  }
}
</style>
