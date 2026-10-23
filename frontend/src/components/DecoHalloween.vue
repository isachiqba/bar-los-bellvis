<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { esHalloween } from '../halloween'

const activo = esHalloween
const sinMovimiento = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
const volando = ref(false)
let temporizadores = []

// Cada murciélago: altura de salida, tamaño, retraso, duración y dirección
const murcielagos = [
  { top: 18, tam: 160, retraso: 0, duracion: 9, alReves: false },
  { top: 34, tam: 112, retraso: 1, duracion: 10, alReves: false },
  { top: 10, tam: 86, retraso: 2, duracion: 10.5, alReves: true },
  { top: 48, tam: 128, retraso: 2.8, duracion: 9.5, alReves: true },
  { top: 26, tam: 74, retraso: 3.6, duracion: 11, alReves: false },
]

// Salen al segundo de entrar y vuelven a pasar mientras se está en la página
const DURACION_VUELO = 15500 // lo que tarda el último murciélago en cruzar
const CADA = 40000 // un vuelo cada 40 s (unos 25 s de pausa entre vuelos)
let intervalo = null

function vuelo() {
  if (document.hidden) return // con la pestaña en segundo plano no se anima
  volando.value = true
  temporizadores.push(setTimeout(() => (volando.value = false), DURACION_VUELO))
}

onMounted(() => {
  if (!activo || sinMovimiento) return
  temporizadores.push(setTimeout(vuelo, 900))
  intervalo = setInterval(vuelo, CADA)
})

onBeforeUnmount(() => {
  temporizadores.forEach(clearTimeout)
  clearInterval(intervalo)
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
        animationDelay: `${m.retraso}s`,
        animationDuration: `${m.duracion}s`,
      }"
    />
  </div>
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

@media (prefers-reduced-motion: reduce) {
  .murcielagos {
    display: none;
  }
}
</style>
