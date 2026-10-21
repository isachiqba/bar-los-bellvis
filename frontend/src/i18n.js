// Idiomas de la web: textos fijos, idioma activo y ayudas para el contenido traducido
import { computed, ref, watchEffect } from 'vue'

export const idiomas = ['es', 'en']

const textos = {
  es: {
    nav: {
      servicios: 'Servicios',
      carta: 'Carta',
      galeria: 'Galería',
      visitanos: 'Visítanos',
      abrirMenu: 'Abrir menú',
      reservar: 'Reservar mesa',
      idioma: 'Idioma',
    },
    pie: {
      sub: 'Bar · Benissuera, Valencia',
      contacto: 'Contacto',
      navegacion: 'Navegación',
      hechoPor: 'Hecho por',
    },
    portada: {
      alt: 'Tapas y cervezas en el Bar Bellvis',
      bienvenida: ['Bienvenidos a', 'Los Bellvis'],
      subtitulo: 'La casa de todos en el corazón del pueblo.',
      lema: 'Hay cosas que solo pasan en la barra de un bar de pueblo: los reencuentros, las risas de fondo, la ración compartida y la conversación que arregla el país.',
      enGoogle: 'En Google',
      abrimos: 'Abrimos por la mañana',
      dias: '6 días',
      semana: 'A la semana',
      hoy: 'Hoy',
      karaoke: 'Noches de karaoke',
      karaokeTexto: 'Pregúntanos las fechas',
      verCarta: 'Ver la carta',
      comoLlegar: 'Cómo llegar',
      abierto: 'Abierto ahora',
      cerrado: 'Cerrado ahora',
      descansamos: 'Hoy descansamos',
      bajar: 'Bajar a los servicios',
      descubrir: 'Descubrir',
    },
    servicios: {
      saberMas: 'Saber más',
      antetitulo: 'Servicios',
      titulo: ['Celebra', 'con nosotros'],
      intro:
        'Organizamos tu evento en nuestro salón de la Plaça Major. Llámanos y lo preparamos a tu medida.',
    },
    carta: {
      antetitulo: 'Nuestra carta',
      titulo: ['Para picar,', 'almorzar', 'y brindar'],
      intro: 'Precios con IVA incluido. Pregúntanos por los platos fuera de carta.',
      cargando: 'Cargando la carta…',
      error: 'No hemos podido cargar la carta. Inténtalo de nuevo en un rato.',
      vacia: 'Pronto publicaremos nuestra carta.',
      entero: 'Entero',
      medio: 'Medio',
    },
    galeria: {
      antetitulo: 'Galería',
      titulo: ['Un rincón', 'de la plaza'],
      intro: 'Así se vive el Bellvis: el salón, la barra y lo que sale de la cocina.',
      sinFotos: 'Muy pronto subiremos fotos del bar.',
      verEnMaps: 'Mientras, míranos en Google Maps →',
      fotoDelBar: 'Foto del bar',
      cerrar: 'Cerrar',
    },
    visita: {
      antetitulo: 'Reservas y contacto',
      titulo: ['¿Nos visitas?', 'Te esperamos'],
      informacion: 'Información',
      direccion: 'Dirección',
      telefono: 'Teléfono',
      whatsapp: 'También por WhatsApp →',
      horario: 'Horario',
      cerrado: 'Cerrado',
      abrirMaps: 'Abrir en Google Maps →',
      mapa: 'Mapa: cómo llegar al bar',
    },
    reserva: {
      titulo: 'Reservar mesa',
      nombre: 'Nombre',
      fecha: 'Día',
      hora: 'Hora',
      eligeHora: 'Elige la hora',
      eligeDia: 'Elige antes el día',
      personas: 'Personas',
      persona: 'persona',
      personasPlural: 'personas',
      masDe: 'Más de 10',
      comentarios: 'Comentarios (opcional)',
      comentariosAyuda: 'Alergias, trona, celebración…',
      cerradoEseDia: 'Ese día descansamos. Elige otro, por favor.',
      sinHoras: 'Para hoy ya no quedan horas libres. Elige otro día.',
      enviar: 'Confirmar por WhatsApp',
      aviso:
        'Se abrirá WhatsApp con tu reserva preparada. Envíanos el mensaje y te confirmamos por ahí.',
    },
  },
  en: {
    nav: {
      servicios: 'Events',
      carta: 'Menu',
      galeria: 'Gallery',
      visitanos: 'Visit us',
      abrirMenu: 'Open menu',
      reservar: 'Book a table',
      idioma: 'Language',
    },
    pie: {
      sub: 'Bar · Benissuera, Valencia',
      contacto: 'Contact',
      navegacion: 'Navigation',
      hechoPor: 'Made by',
    },
    portada: {
      alt: 'Tapas and beers at Bar Bellvis',
      bienvenida: ['Welcome to', 'Los Bellvis'],
      subtitulo: 'Everyone’s home in the heart of the village.',
      lema: 'Some things only happen at the bar of a village pub: running into old friends, laughter in the background, a plate to share and the conversation that puts the world to rights.',
      enGoogle: 'On Google',
      abrimos: 'We open in the morning',
      dias: '6 days',
      semana: 'A week',
      hoy: 'Today',
      karaoke: 'Karaoke nights',
      karaokeTexto: 'Ask us for the dates',
      verCarta: 'See the menu',
      comoLlegar: 'Get directions',
      abierto: 'Open now',
      cerrado: 'Closed now',
      descansamos: 'Our day off',
      bajar: 'Scroll to events',
      descubrir: 'Discover',
    },
    servicios: {
      saberMas: 'Learn more',
      antetitulo: 'Events',
      titulo: ['Celebrate', 'with us'],
      intro:
        'We host your event in our dining room on the Plaça Major. Give us a call and we’ll tailor it to you.',
    },
    carta: {
      antetitulo: 'Our menu',
      titulo: ['Bites,', 'almuerzo', 'and a toast'],
      intro: 'All prices include VAT. Ask us about today’s specials.',
      cargando: 'Loading the menu…',
      error: 'We couldn’t load the menu. Please try again in a moment.',
      vacia: 'Our menu is coming soon.',
      entero: 'Whole',
      medio: 'Half',
    },
    galeria: {
      antetitulo: 'Gallery',
      titulo: ['A corner', 'of the square'],
      intro: 'Life at the Bellvis: the dining room, the bar and what comes out of the kitchen.',
      sinFotos: 'Photos of the bar coming soon.',
      verEnMaps: 'Meanwhile, find us on Google Maps →',
      fotoDelBar: 'Photo of the bar',
      cerrar: 'Close',
    },
    visita: {
      antetitulo: 'Bookings & contact',
      titulo: ['Coming to see us?', 'We’re waiting'],
      informacion: 'Information',
      direccion: 'Address',
      telefono: 'Phone',
      whatsapp: 'Also on WhatsApp →',
      horario: 'Opening hours',
      cerrado: 'Closed',
      abrirMaps: 'Open in Google Maps →',
      mapa: 'Map: how to get to the bar',
    },
    reserva: {
      titulo: 'Book a table',
      nombre: 'Name',
      fecha: 'Date',
      hora: 'Time',
      eligeHora: 'Choose a time',
      eligeDia: 'Choose a date first',
      personas: 'Guests',
      persona: 'guest',
      personasPlural: 'guests',
      masDe: 'More than 10',
      comentarios: 'Comments (optional)',
      comentariosAyuda: 'Allergies, high chair, celebration…',
      cerradoEseDia: 'We’re closed that day. Please choose another one.',
      sinHoras: 'There are no times left today. Please choose another day.',
      enviar: 'Confirm on WhatsApp',
      aviso:
        'WhatsApp will open with your booking ready. Send us the message and we’ll confirm it there.',
    },
  },
}

function idiomaInicial() {
  try {
    const guardado = localStorage.getItem('idioma')
    if (idiomas.includes(guardado)) return guardado
  } catch {
    // Sin acceso a localStorage (modo privado, etc.): se decide por el navegador
  }
  return navigator.language?.toLowerCase().startsWith('en') ? 'en' : 'es'
}

export const idioma = ref(idiomaInicial())

// Formato de fechas y precios según el idioma
export const localeIntl = computed(() => (idioma.value === 'en' ? 'en-GB' : 'es-ES'))

watchEffect(() => {
  document.documentElement.lang = idioma.value
  try {
    localStorage.setItem('idioma', idioma.value)
  } catch {
    // Si no se puede guardar, el idioma solo dura esta visita
  }
})

// Texto fijo por clave con puntos, p. ej. t('carta.entero'). Si falta en inglés, sale en español
export function t(clave) {
  const buscar = (idiomaBuscado) =>
    clave.split('.').reduce((nodo, parte) => nodo?.[parte], textos[idiomaBuscado])
  return buscar(idioma.value) ?? buscar('es') ?? clave
}

// Texto bilingüe de bar.js: { es: '…', en: '…' }
export const tr = (texto) => texto[idioma.value] || texto.es

// Campo de la API con versión en inglés (nombre / nombre_en, …)
export const campo = (objeto, nombre) =>
  (idioma.value === 'en' && objeto[`${nombre}_en`]) || objeto[nombre]
