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

// Salen cada vez que se carga la página, al segundo de entrar
onMounted(() => {
  if (!activo || sinMovimiento) return
  temporizadores.push(
    setTimeout(() => (volando.value = true), 900),
    setTimeout(() => (volando.value = false), 900 + 15500),
  )
})

onBeforeUnmount(() => temporizadores.forEach(clearTimeout))
</script>

<template>
  <template v-if="activo">
    <div v-if="volando" class="murcielagos" aria-hidden="true">
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
