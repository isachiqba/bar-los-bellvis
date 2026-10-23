<script setup>
// Ambiente sonoro de Halloween generado en el navegador (Web Audio, sin archivos):
// viento de fondo, chillidos lejanos de murciélago y algún crujido de madera.
// Empieza siempre en silencio: suena solo si el visitante lo activa con el botón.
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { esHalloween } from '../halloween'
import { t } from '../i18n'

const VOLUMEN = 0.35
const CLAVE = 'sonido-halloween'

const activo = ref(false)
let ctx = null
let salida = null
let temporizadores = []

const azar = (min, max) => min + Math.random() * (max - min)

function ruido(segundos) {
  const buffer = ctx.createBuffer(1, ctx.sampleRate * segundos, ctx.sampleRate)
  const datos = buffer.getChannelData(0)
  for (let i = 0; i < datos.length; i++) datos[i] = Math.random() * 2 - 1
  return buffer
}

// Viento: ruido filtrado cuyo filtro y volumen suben y bajan despacio
function viento() {
  const fuente = ctx.createBufferSource()
  fuente.buffer = ruido(4)
  fuente.loop = true
  const filtro = ctx.createBiquadFilter()
  filtro.type = 'bandpass'
  filtro.frequency.value = 420
  filtro.Q.value = 0.8
  const volumen = ctx.createGain()
  volumen.gain.value = 0.22

  // Ráfagas: osciladores muy lentos que mueven el filtro y el volumen
  const lfoFiltro = ctx.createOscillator()
  lfoFiltro.frequency.value = 0.07
  const profundidadFiltro = ctx.createGain()
  profundidadFiltro.gain.value = 260
  lfoFiltro.connect(profundidadFiltro).connect(filtro.frequency)
  const lfoVolumen = ctx.createOscillator()
  lfoVolumen.frequency.value = 0.11
  const profundidadVolumen = ctx.createGain()
  profundidadVolumen.gain.value = 0.12
  lfoVolumen.connect(profundidadVolumen).connect(volumen.gain)

  fuente.connect(filtro).connect(volumen).connect(salida)
  fuente.start()
  lfoFiltro.start()
  lfoVolumen.start()
}

// Murciélago: dos o tres chirridos agudos muy cortos, lejanos
function murcielago() {
  const ahora = ctx.currentTime
  const veces = Math.round(azar(2, 3))
  const panorama = ctx.createStereoPanner()
  panorama.pan.value = azar(-0.8, 0.8)
  panorama.connect(salida)
  for (let i = 0; i < veces; i++) {
    const inicio = ahora + i * azar(0.09, 0.14)
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(azar(5200, 6500), inicio)
    osc.frequency.exponentialRampToValueAtTime(azar(3200, 3800), inicio + 0.05)
    const env = ctx.createGain()
    env.gain.setValueAtTime(0, inicio)
    env.gain.linearRampToValueAtTime(0.05, inicio + 0.008)
    env.gain.exponentialRampToValueAtTime(0.0001, inicio + 0.06)
    osc.connect(env).connect(panorama)
    osc.start(inicio)
    osc.stop(inicio + 0.07)
  }
}

// Crujido de madera: tono grave que tiembla, como una puerta o una viga vieja
function crujido() {
  const ahora = ctx.currentTime
  const dura = azar(0.6, 1.1)
  const osc = ctx.createOscillator()
  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(azar(70, 95), ahora)
  osc.frequency.linearRampToValueAtTime(azar(110, 140), ahora + dura)
  const temblor = ctx.createOscillator()
  temblor.frequency.value = azar(18, 26)
  const profundidad = ctx.createGain()
  profundidad.gain.value = 9
  temblor.connect(profundidad).connect(osc.frequency)
  const filtro = ctx.createBiquadFilter()
  filtro.type = 'lowpass'
  filtro.frequency.value = 700
  const env = ctx.createGain()
  env.gain.setValueAtTime(0, ahora)
  env.gain.linearRampToValueAtTime(0.05, ahora + 0.15)
  env.gain.linearRampToValueAtTime(0, ahora + dura)
  osc.connect(filtro).connect(env).connect(salida)
  osc.start(ahora)
  temblor.start(ahora)
  osc.stop(ahora + dura + 0.05)
  temblor.stop(ahora + dura + 0.05)
}

// Repite un sonido a intervalos irregulares mientras esté activo
function programar(sonido, min, max) {
  const temporizador = setTimeout(
    () => {
      if (activo.value && ctx.state === 'running') sonido()
      programar(sonido, min, max)
    },
    azar(min, max) * 1000,
  )
  temporizadores.push(temporizador)
}

function crearAudio() {
  ctx = new AudioContext()
  salida = ctx.createGain()
  salida.gain.value = 0
  salida.connect(ctx.destination)
  viento()
  programar(murcielago, 6, 14)
  programar(crujido, 18, 35)
}

async function encender() {
  if (!ctx) crearAudio()
  await ctx.resume()
  // Entrada y salida suaves para que no dé un golpe de volumen
  salida.gain.cancelScheduledValues(ctx.currentTime)
  salida.gain.setTargetAtTime(VOLUMEN, ctx.currentTime, 0.6)
  activo.value = true
}

function apagar() {
  activo.value = false
  if (!ctx) return
  salida.gain.cancelScheduledValues(ctx.currentTime)
  salida.gain.setTargetAtTime(0, ctx.currentTime, 0.2)
  setTimeout(() => !activo.value && ctx.suspend(), 800)
}

function guardar(valor) {
  try {
    localStorage.setItem(CLAVE, valor ? '1' : '0')
  } catch {
    // Sin localStorage la elección solo dura esta visita
  }
}

function alternar() {
  const encendido = !activo.value
  quitarEscuchaToque()
  if (encendido) encender()
  else apagar()
  guardar(encendido)
}

// Si el visitante lo dejó encendido, vuelve a sonar al primer toque en la página
// (los navegadores no permiten que suene antes de que el visitante interactúe)
function alPrimerToque() {
  quitarEscuchaToque()
  if (!activo.value) encender()
}
const quitarEscuchaToque = () => {
  window.removeEventListener('pointerdown', alPrimerToque)
  window.removeEventListener('keydown', alPrimerToque)
}

// Con la pestaña en segundo plano se pausa
function alCambiarVisibilidad() {
  if (!ctx || !activo.value) return
  if (document.hidden) ctx.suspend()
  else ctx.resume()
}

onMounted(() => {
  if (!esHalloween) return
  let recordado = false
  try {
    recordado = localStorage.getItem(CLAVE) === '1'
  } catch {
    // Sin localStorage empieza apagado
  }
  if (recordado) {
    window.addEventListener('pointerdown', alPrimerToque)
    window.addEventListener('keydown', alPrimerToque)
  }
  document.addEventListener('visibilitychange', alCambiarVisibilidad)
})

onBeforeUnmount(() => {
  temporizadores.forEach(clearTimeout)
  quitarEscuchaToque()
  document.removeEventListener('visibilitychange', alCambiarVisibilidad)
  ctx?.close()
})
</script>

<template>
  <button
    v-if="esHalloween"
    class="sonido"
    :class="{ 'sonido--activo': activo }"
    :aria-pressed="activo"
    :aria-label="t(activo ? 'halloween.silenciar' : 'halloween.activarSonido')"
    :title="t(activo ? 'halloween.silenciar' : 'halloween.activarSonido')"
    @click.stop="alternar"
  >
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M11 5 6 9H2v6h4l5 4V5z" />
      <template v-if="activo">
        <path d="M15.5 8.5a5 5 0 0 1 0 7" />
        <path d="M19 5a10 10 0 0 1 0 14" />
      </template>
      <template v-else>
        <path d="m22 9-6 6" />
        <path d="m16 9 6 6" />
      </template>
    </svg>
    <span class="sonido__texto">{{ t('halloween.ambiente') }}</span>
  </button>
</template>

<style scoped>
.sonido {
  position: fixed;
  right: 1.25rem;
  bottom: 1.25rem;
  z-index: 40;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.95rem;
  border: 1px solid rgb(224 122 31 / 0.45);
  border-radius: 999px;
  background: rgb(13 11 8 / 0.85);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  color: #f0a052;
  font: 600 0.8rem var(--fuente-texto);
  cursor: pointer;
  box-shadow: 0 10px 25px -10px rgb(0 0 0 / 0.6);
  transition:
    border-color 0.3s,
    color 0.3s;
}

.sonido:hover {
  border-color: #f0a052;
  color: #ffc07a;
}

.sonido svg {
  width: 1.1rem;
  height: 1.1rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* Encendido: un pulso suave para que se note que está sonando */
.sonido--activo {
  border-color: #f0a052;
  animation: pulso 2.4s ease-in-out infinite;
}

@keyframes pulso {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgb(240 160 82 / 0.35);
  }
  50% {
    box-shadow: 0 0 0 8px rgb(240 160 82 / 0);
  }
}

@media (max-width: 520px) {
  .sonido {
    right: 0.9rem;
    bottom: 0.9rem;
    padding: 0.6rem;
  }

  .sonido__texto {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sonido--activo {
    animation: none;
  }
}
</style>
