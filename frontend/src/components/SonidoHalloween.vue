<script setup>
// Ambiente sonoro de Halloween generado en el navegador (Web Audio, sin archivos):
// una puerta vieja que chirría y murciélagos que pasan volando con sus chillidos.
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

// Puerta que chirría: la bisagra roza a tirones cientos de veces por segundo, lo que da un
// chirrido agudo y afinado ("iiiieeec") que sube y baja de tono mientras gira la puerta.
// La fricción no es regular: hay pequeños saltos y temblores que le dan el carácter de bisagra vieja.
function puerta() {
  const ahora = ctx.currentTime
  const dura = azar(1.2, 1.9)
  const sr = ctx.sampleRate
  const buffer = ctx.createBuffer(1, Math.ceil(sr * dura), sr)
  const datos = buffer.getChannelData(0)
  const base = azar(380, 520) // tono de partida del chirrido (Hz)
  const subida = azar(0.6, 1.1) // cuánto sube de tono a mitad del giro
  const temblor = azar(22, 34) // tirones de la fricción por segundo
  let fase = 0
  let tono = 1
  for (let i = 0; i < datos.length; i++) {
    const t = i / sr
    const u = i / datos.length
    // De vez en cuando la bisagra "salta" y el tono cambia un poco de golpe
    if (Math.random() < 0.0004) tono = azar(0.85, 1.15)
    const ritmo = base * tono * (1 + subida * Math.sin(Math.PI * u)) * (1 + 0.03 * Math.sin(t * 37))
    fase += ritmo / sr
    if (fase >= 1) {
      fase -= 1
      // Intensidad que tiembla con los tirones de la fricción
      const fuerza = (0.35 + 0.65 * Math.abs(Math.sin(Math.PI * temblor * t))) * azar(0.8, 1)
      for (let k = 0; k < 10 && i + k < datos.length; k++) {
        datos[i + k] += fuerza * Math.exp(-k / 2.5) * (k % 2 ? -1 : 1)
      }
    }
  }
  const fuente = ctx.createBufferSource()
  fuente.buffer = buffer
  // Sin graves (eran los que daban el sonido de eructo) y con el brillo del metal
  const sinGraves = ctx.createBiquadFilter()
  sinGraves.type = 'highpass'
  sinGraves.frequency.value = 600
  const brillo = ctx.createBiquadFilter()
  brillo.type = 'peaking'
  brillo.frequency.value = azar(1600, 2200)
  brillo.Q.value = 2
  brillo.gain.value = 8
  const suave = ctx.createBiquadFilter()
  suave.type = 'lowpass'
  suave.frequency.value = 5000
  const env = ctx.createGain()
  env.gain.setValueAtTime(0, ahora)
  env.gain.linearRampToValueAtTime(3.2, ahora + 0.08)
  env.gain.setValueAtTime(3.2, ahora + dura - 0.25)
  env.gain.linearRampToValueAtTime(0, ahora + dura)
  const panorama = ctx.createStereoPanner()
  panorama.pan.value = azar(-0.5, 0.5)
  fuente
    .connect(sinGraves)
    .connect(brillo)
    .connect(suave)
    .connect(env)
    .connect(panorama)
    .connect(salida)
  fuente.start(ahora)
}

// Murciélagos: uno o dos pasan volando de un lado al otro, con aleteos y chillidos agudos
function murcielagos() {
  const ahora = ctx.currentTime
  const vuelo = azar(1.6, 2.6)
  const desde = Math.random() < 0.5 ? -0.9 : 0.9
  const panorama = ctx.createStereoPanner()
  panorama.pan.setValueAtTime(desde, ahora)
  panorama.pan.linearRampToValueAtTime(-desde, ahora + vuelo)
  // Más fuerte al pasar por el centro, como si se acercara y se alejara
  const cerca = ctx.createGain()
  cerca.gain.setValueAtTime(0.25, ahora)
  cerca.gain.linearRampToValueAtTime(1, ahora + vuelo / 2)
  cerca.gain.linearRampToValueAtTime(0.25, ahora + vuelo)
  cerca.connect(panorama).connect(salida)

  // Aleteos: golpes graves y cortos de aire, unas 9 veces por segundo
  const aire = ruido(0.1)
  const cadencia = azar(0.1, 0.13)
  for (let t = 0; t < vuelo; t += cadencia * azar(0.9, 1.1)) {
    const inicio = ahora + t
    const golpe = ctx.createBufferSource()
    golpe.buffer = aire
    const filtro = ctx.createBiquadFilter()
    filtro.type = 'lowpass'
    filtro.frequency.value = azar(380, 600)
    const env = ctx.createGain()
    env.gain.setValueAtTime(0, inicio)
    env.gain.linearRampToValueAtTime(1.6, inicio + 0.015)
    env.gain.exponentialRampToValueAtTime(0.001, inicio + 0.07)
    golpe.connect(filtro).connect(env).connect(cerca)
    golpe.start(inicio)
    golpe.stop(inicio + 0.08)
  }

  // Chillidos: ráfagas de chirridos agudos que bajan de tono
  const rafagas = Math.round(azar(2, 4))
  for (let r = 0; r < rafagas; r++) {
    let inicio = ahora + azar(0.1, vuelo - 0.4)
    const chirridos = Math.round(azar(3, 7))
    for (let c = 0; c < chirridos; c++) {
      const osc = ctx.createOscillator()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(azar(4200, 5600), inicio)
      osc.frequency.exponentialRampToValueAtTime(azar(2400, 3000), inicio + 0.03)
      const env = ctx.createGain()
      env.gain.setValueAtTime(0, inicio)
      env.gain.linearRampToValueAtTime(0.55, inicio + 0.004)
      env.gain.exponentialRampToValueAtTime(0.0001, inicio + 0.04)
      osc.connect(env).connect(cerca)
      osc.start(inicio)
      osc.stop(inicio + 0.05)
      inicio += azar(0.035, 0.06)
    }
  }
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
  programar(murcielagos, 7, 14)
  programar(puerta, 14, 26)
}

async function encender() {
  if (!ctx) crearAudio()
  await ctx.resume()
  // Entrada y salida suaves para que no dé un golpe de volumen
  salida.gain.cancelScheduledValues(ctx.currentTime)
  salida.gain.setTargetAtTime(VOLUMEN, ctx.currentTime, 0.3)
  activo.value = true
  // Primeros sonidos enseguida, para que se note que se ha encendido
  temporizadores.push(
    setTimeout(() => activo.value && murcielagos(), 400),
    setTimeout(() => activo.value && puerta(), 3200),
  )
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
function alPrimerToque(evento) {
  // Si el primer toque es en el propio botón, ya lo gestiona alternar()
  if (evento.target.closest?.('.sonido')) return
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
