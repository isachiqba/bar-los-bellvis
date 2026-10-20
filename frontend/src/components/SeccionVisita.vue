<script setup>
import { computed, reactive, watch } from 'vue'
import { bar, horasReserva, mapaUrl, telefonoEnlace, whatsappUrl } from '../bar'
import { idioma, t, tr } from '../i18n'

const iconos = {
  direccion: [
    'M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0',
    'M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',
  ],
  telefono: [
    'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z',
  ],
  horario: ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z', 'M12 6v6l4 2'],
  enviar: [
    'M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z',
    'm21.854 2.147-10.94 10.939',
  ],
}

const mapaEmbed = computed(
  () =>
    `https://maps.google.com/maps?q=${encodeURIComponent(`${bar.direccion}, ${bar.localidad}`)}&z=16&hl=${idioma.value}&output=embed`,
)

// Formulario de reserva: no se guarda nada, se abre WhatsApp con el mensaje preparado
const reserva = reactive({ nombre: '', fecha: '', hora: '', personas: '2', comentarios: '' })

const aISO = (fecha) =>
  `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`
const hoyISO = aISO(new Date())

const fechaElegida = computed(() => {
  if (!reserva.fecha) return null
  const [a, m, d] = reserva.fecha.split('-').map(Number)
  return new Date(a, m - 1, d)
})

const diaCerrado = computed(() => fechaElegida.value && !horasReserva(fechaElegida.value).length)

// Si es para hoy, solo las horas que faltan (con media hora de margen)
const horas = computed(() => {
  if (!fechaElegida.value) return []
  const todas = horasReserva(fechaElegida.value)
  if (reserva.fecha !== hoyISO) return todas
  const ahora = new Date()
  const limite = ahora.getHours() * 60 + ahora.getMinutes() + 30
  return todas.filter((hora) => {
    const [h, m] = hora.split(':').map(Number)
    return h * 60 + m >= limite
  })
})

const aviso = computed(() => {
  if (diaCerrado.value) return t('reserva.cerradoEseDia')
  if (fechaElegida.value && !horas.value.length) return t('reserva.sinHoras')
  return ''
})

watch(horas, (lista) => {
  if (!lista.includes(reserva.hora)) reserva.hora = ''
})

const personas = [...Array(10).keys()].map((n) => String(n + 1)).concat('+10')

const etiquetaPersonas = (n) => {
  if (n === '+10') return t('reserva.masDe')
  return `${n} ${t(n === '1' ? 'reserva.persona' : 'reserva.personasPlural')}`
}

// El mensaje va siempre en castellano, que es lo que lee el bar
function mensajeReserva() {
  const dia = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(fechaElegida.value)
  const lineas = [
    `Hola, quiero reservar mesa en el ${bar.nombre}:`,
    `• Nombre: ${reserva.nombre.trim()}`,
    `• Día: ${dia}`,
    `• Hora: ${reserva.hora}`,
    `• Personas: ${reserva.personas === '+10' ? 'más de 10' : reserva.personas}`,
  ]
  if (reserva.comentarios.trim()) lineas.push(`• Comentarios: ${reserva.comentarios.trim()}`)
  if (idioma.value === 'en') lineas.push('(Reserva hecha desde la web en inglés)')
  return lineas.join('\n')
}

function enviar() {
  if (aviso.value) return
  const url = whatsappUrl(mensajeReserva())
  const ventana = window.open(url, '_blank')
  if (ventana) ventana.opener = null
  else window.location.href = url
}
</script>

<template>
  <section id="visitanos" class="seccion seccion--alt">
    <div class="contenedor">
      <header v-reveal class="seccion__cabecera">
        <p class="antetitulo">{{ t('visita.antetitulo') }}</p>
        <h2>
          {{ t('visita.titulo')[0] }} <span class="dorado">{{ t('visita.titulo')[1] }}</span>
        </h2>
      </header>

      <div class="visita">
        <div v-reveal class="visita__info cristal">
          <h3>{{ t('visita.informacion') }}</h3>

          <ul class="datos">
            <li class="dato">
              <span class="dato__icono">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path v-for="d in iconos.direccion" :key="d" :d="d" />
                </svg>
              </span>
              <div>
                <p class="dato__titulo">{{ t('visita.direccion') }}</p>
                <p class="dato__texto">
                  {{ bar.direccion }}<br />
                  {{ bar.localidad }}
                </p>
                <a :href="mapaUrl" target="_blank" rel="noopener" class="dato__extra">
                  {{ t('visita.abrirMaps') }}
                </a>
              </div>
            </li>

            <li class="dato">
              <span class="dato__icono">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path v-for="d in iconos.telefono" :key="d" :d="d" />
                </svg>
              </span>
              <div>
                <p class="dato__titulo">{{ t('visita.telefono') }}</p>
                <a :href="telefonoEnlace" class="dato__enlace">{{ bar.telefono }}</a>
                <a :href="whatsappUrl()" target="_blank" rel="noopener" class="dato__extra">
                  {{ t('visita.whatsapp') }}
                </a>
              </div>
            </li>

            <li class="dato">
              <span class="dato__icono">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path v-for="d in iconos.horario" :key="d" :d="d" />
                </svg>
              </span>
              <div class="dato__horario">
                <p class="dato__titulo">{{ t('visita.horario') }}</p>
                <dl class="horario">
                  <div v-for="tramo in bar.horario" :key="tramo.etiqueta.es" class="horario__fila">
                    <dt>{{ tr(tramo.etiqueta) }}</dt>
                    <dd v-if="tramo.turnos.length">{{ tramo.turnos.join(' / ') }}</dd>
                    <dd v-else class="horario__cerrado">{{ t('visita.cerrado') }}</dd>
                  </div>
                </dl>
              </div>
            </li>
          </ul>
        </div>

        <div v-reveal="100" class="visita__mapa">
          <iframe
            :src="mapaEmbed"
            :title="t('visita.mapa')"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

      <form id="reservas" v-reveal="150" class="reserva cristal" @submit.prevent="enviar">
        <h3>{{ t('reserva.titulo') }}</h3>

        <label class="campo">
          <span>{{ t('reserva.nombre') }}</span>
          <input v-model="reserva.nombre" type="text" autocomplete="name" required />
        </label>

        <div class="reserva__fila">
          <label class="campo">
            <span>{{ t('reserva.fecha') }}</span>
            <input v-model="reserva.fecha" type="date" :min="hoyISO" required />
          </label>

          <label class="campo">
            <span>{{ t('reserva.hora') }}</span>
            <select v-model="reserva.hora" required :disabled="!horas.length">
              <option value="" disabled>
                {{ t(fechaElegida ? 'reserva.eligeHora' : 'reserva.eligeDia') }}
              </option>
              <option v-for="hora in horas" :key="hora" :value="hora">{{ hora }}</option>
            </select>
          </label>
        </div>

        <p v-if="aviso" class="reserva__aviso" role="alert">{{ aviso }}</p>

        <label class="campo">
          <span>{{ t('reserva.personas') }}</span>
          <select v-model="reserva.personas" required>
            <option v-for="n in personas" :key="n" :value="n">{{ etiquetaPersonas(n) }}</option>
          </select>
        </label>

        <label class="campo">
          <span>{{ t('reserva.comentarios') }}</span>
          <textarea
            v-model="reserva.comentarios"
            rows="4"
            :placeholder="t('reserva.comentariosAyuda')"
          ></textarea>
        </label>

        <button type="submit" class="boton reserva__enviar" :disabled="!!aviso">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path v-for="d in iconos.enviar" :key="d" :d="d" />
          </svg>
          {{ t('reserva.enviar') }}
        </button>
        <p class="reserva__nota">{{ t('reserva.aviso') }}</p>
      </form>
    </div>
  </section>
</template>

<style scoped>
.visita {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.visita__info,
.reserva {
  padding: 2.5rem;
  border-radius: 1.5rem;
}

h3 {
  margin-bottom: 1.75rem;
  font-size: 1.5rem;
}

.datos {
  display: grid;
  gap: 1.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.dato {
  display: flex;
  gap: 1rem;
}

.dato > div {
  flex: 1;
  min-width: 0;
}

.dato__icono {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.75rem;
  background: rgb(212 168 67 / 0.12);
  color: var(--color-oro);
}

.dato__icono svg,
.reserva__enviar svg {
  width: 1.15rem;
  height: 1.15rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.dato__titulo {
  margin: 0 0 0.3rem;
  font-weight: 500;
}

.dato__texto {
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-suave);
}

.dato__enlace {
  display: block;
  font-size: 0.95rem;
}

.dato__extra {
  display: inline-block;
  margin-top: 0.3rem;
  font-size: 0.8rem;
  color: var(--color-tenue);
}

.dato__extra:hover {
  color: var(--color-oro);
}

.horario {
  margin: 0.5rem 0 0;
}

.horario__fila {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.15rem 1rem;
  padding: 0.35rem 0;
  font-size: 0.875rem;
}

.horario__fila dt {
  color: rgb(255 243 224 / 0.7);
}

.horario__fila dd {
  margin: 0;
  color: var(--color-oro);
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}

.horario__fila .horario__cerrado {
  color: var(--color-tenue);
}

.visita__mapa {
  min-height: 22rem;
  border: 1px solid rgb(212 168 67 / 0.15);
  border-radius: 1.5rem;
  overflow: hidden;
}

.visita__mapa iframe {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
  filter: grayscale(0.6) invert(0.9) hue-rotate(180deg) contrast(0.9);
}

/* Formulario */
.reserva {
  display: grid;
  gap: 1.1rem;
  max-width: 48rem;
  margin: 2rem auto 0;
  scroll-margin-top: calc(var(--alto-cabecera) + 1.5rem);
}

.reserva h3 {
  margin-bottom: 0.5rem;
}

.reserva__fila {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.campo {
  display: grid;
  gap: 0.4rem;
}

.campo > span {
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-tenue);
}

.campo input,
.campo select,
.campo textarea {
  width: 100%;
  padding: 0.85rem 1rem;
  border: 1px solid rgb(212 168 67 / 0.2);
  border-radius: 0.75rem;
  background: rgb(255 243 224 / 0.04);
  color: var(--color-texto);
  font: inherit;
  font-size: 0.95rem;
  transition:
    border-color 0.2s,
    background 0.2s;
}

.campo select option {
  background: var(--color-fondo);
}

.campo textarea {
  resize: vertical;
}

.campo input::placeholder,
.campo textarea::placeholder {
  color: rgb(255 243 224 / 0.35);
}

.campo input:focus,
.campo select:focus,
.campo textarea:focus {
  outline: none;
  border-color: var(--color-oro);
  background: rgb(255 243 224 / 0.07);
}

.campo select:disabled {
  opacity: 0.5;
}

.reserva__aviso {
  margin: -0.25rem 0 0;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  background: rgb(196 87 58 / 0.15);
  color: #f0a58f;
  font-size: 0.875rem;
}

.reserva__enviar {
  width: 100%;
  margin-top: 0.5rem;
  padding: 1.05rem;
  border-radius: 0.9rem;
  font-size: 1rem;
  cursor: pointer;
}

.reserva__enviar:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.reserva__nota {
  margin: 0;
  text-align: center;
  font-size: 0.8rem;
  color: var(--color-tenue);
}

@media (max-width: 900px) {
  .visita {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 520px) {
  .visita__info,
  .reserva {
    padding: 1.75rem 1.5rem;
  }

  .reserva__fila {
    grid-template-columns: 1fr;
  }
}
</style>
