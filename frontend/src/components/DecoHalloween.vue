<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { esHalloween } from '../halloween'

const activo = esHalloween
const sinMovimiento = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
const volando = ref(false)
let temporizador = null

// Cada murciélago: altura de salida, tamaño, retraso, duración (en una pantalla de móvil) y dirección
const murcielagos = [
  { top: 18, tam: 160, retraso: 0, duracion: 9, alReves: false },
  { top: 34, tam: 112, retraso: 1, duracion: 10, alReves: false },
  { top: 10, tam: 86, retraso: 2, duracion: 10.5, alReves: true },
  { top: 48, tam: 128, retraso: 2.8, duracion: 9.5, alReves: true },
  { top: 26, tam: 74, retraso: 3.6, duracion: 11, alReves: false },
]

// La animación cruza toda la pantalla: en pantallas anchas se alarga la duración para que
// vuelen igual de despacio que en el móvil (misma velocidad, no mismo tiempo)
const ANCHO_MOVIL = 400
const escala = ref(1)
const ajustarEscala = () => (escala.value = Math.max(1, window.innerWidth / ANCHO_MOVIL))

// Empiezan al segundo de entrar y, como la animación se repite sin fin, no paran nunca.
// Con la pestaña en segundo plano el navegador detiene la animación por su cuenta.
onMounted(() => {
  if (!activo || sinMovimiento) return
  ajustarEscala()
  window.addEventListener('resize', ajustarEscala)
  temporizador = setTimeout(() => (volando.value = true), 900)
})

onBeforeUnmount(() => {
  clearTimeout(temporizador)
  window.removeEventListener('resize', ajustarEscala)
})
</script>

<template>
  <div v-if="activo && volando" class="murcielagos" aria-hidden="true">
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
        animationDelay: `${m.retraso * escala}s`,
        animationDuration: `${m.duracion * escala}s, 0.6s`,
      }"
    />
  </div>
</template>

<style scoped>
/* Murciélagos: cruzan la pantalla sin parar, por encima de todo pero sin tapar clics */
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
    cruzar linear infinite,
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

@media (prefers-reduced-motion: reduce) {
  .murcielagos {
    display: none;
  }
}
</style>
