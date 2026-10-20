// Datos del bar que se muestran en la web.
// Los textos visibles van en los dos idiomas: { es: '…', en: '…' }
export const bar = {
  nombre: 'Bar Los Bellvis',
  lema: {
    es: 'El bar de siempre, en la Plaça Major de Benissuera',
    en: 'Your local bar on the Plaça Major in Benissuera',
  },
  direccion: 'Plaça Major',
  localidad: '46839 Benissuera (Valencia)',
  telefono: '623 51 51 36',
  email: '',
  // Foto de fondo de la portada (p. ej. '/fotos/fachada.jpg' dentro de public/). Vacío = sin foto
  fotoPortada: '/fotos/portada.jpg',
  valoracion: { nota: '5.0', opiniones: 4 },
  // icono: fiesta | microfono | corazon | maletin | cubiertos
  // foto: imágenes ilustrativas de Pexels (licencia libre), en public/servicios/
  servicios: [
    {
      icono: 'fiesta',
      foto: '/servicios/celebraciones.jpg',
      titulo: { es: 'Celebraciones Privadas', en: 'Private Parties' },
      texto: {
        es: 'Cumpleaños, aniversarios o reuniones familiares en nuestro salón, solo para vosotros.',
        en: 'Birthdays, anniversaries or family gatherings in our dining room, just for you.',
      },
    },
    {
      icono: 'microfono',
      foto: '/servicios/karaoke.jpg',
      titulo: { es: 'Noches de Karaoke', en: 'Karaoke Nights' },
      texto: {
        es: 'Micrófono en mano y buen ambiente para cantar con los amigos. Pregúntanos por las próximas fechas.',
        en: 'Grab the mic and sing along with your friends. Ask us about the next dates.',
      },
    },
    {
      icono: 'corazon',
      foto: '/servicios/bodas.jpg',
      titulo: { es: 'Bodas & Comuniones', en: 'Weddings & Communions' },
      texto: {
        es: 'Celebra los días más especiales con un menú pensado para toda la familia.',
        en: 'Celebrate your most special days with a menu designed for the whole family.',
      },
    },
    {
      icono: 'maletin',
      foto: '/servicios/empresa.jpg',
      titulo: { es: 'Eventos de Empresa', en: 'Corporate Events' },
      texto: {
        es: 'Comidas y cenas de equipo, cenas de Navidad o reuniones de trabajo.',
        en: 'Team lunches and dinners, Christmas parties or work meetings.',
      },
    },
    {
      icono: 'cubiertos',
      foto: '/servicios/menus.jpg',
      titulo: { es: 'Menús Cerrados', en: 'Set Menus' },
      texto: {
        es: 'Menús para grupos a precio cerrado. Te ayudamos a elegirlo según tu celebración.',
        en: 'Fixed-price group menus. We’ll help you choose the right one for your event.',
      },
    },
  ],
  // dias: 0 = domingo … 6 = sábado. Sin turnos = cerrado
  horario: [
    {
      etiqueta: { es: 'Lunes, miércoles y jueves', en: 'Monday, Wednesday & Thursday' },
      dias: [1, 3, 4],
      turnos: ['8:30 – 14:00', '17:30 – 21:00'],
    },
    { etiqueta: { es: 'Martes', en: 'Tuesday' }, dias: [2], turnos: [] },
    {
      etiqueta: { es: 'Viernes a domingo', en: 'Friday to Sunday' },
      dias: [5, 6, 0],
      turnos: ['8:30 – 14:00', '17:30 – 23:00'],
    },
  ],
}

export const telefonoEnlace = `tel:+34${bar.telefono.replace(/\s/g, '')}`

// Enlace a WhatsApp con un mensaje ya escrito (el número de teléfono también tiene WhatsApp)
export const whatsappUrl = (mensaje = '') =>
  `https://wa.me/34${bar.telefono.replace(/\s/g, '')}${mensaje ? `?text=${encodeURIComponent(mensaje)}` : ''}`

export const mapaUrl = `https://www.google.com/maps?q=${encodeURIComponent(`${bar.nombre}, ${bar.direccion}, ${bar.localidad}`)}`

const aMinutos = (hora) => {
  const [h, m] = hora.split(':').map(Number)
  return h * 60 + m
}

const aHora = (minutos) => `${Math.floor(minutos / 60)}:${String(minutos % 60).padStart(2, '0')}`

// Horario del día de `fecha` y si en ese momento está abierto
export function estadoHoy(fecha = new Date()) {
  const tramo = bar.horario.find((t) => t.dias.includes(fecha.getDay()))
  const ahora = fecha.getHours() * 60 + fecha.getMinutes()
  const abierto = tramo.turnos.some((turno) => {
    const [desde, hasta] = turno.split(' – ').map(aMinutos)
    return ahora >= desde && ahora < hasta
  })
  return { turnos: tramo.turnos, abierto }
}

// Horas que se pueden reservar el día de `fecha`: cada 30 min hasta 1 h antes de cerrar cada turno
export function horasReserva(fecha) {
  const tramo = bar.horario.find((t) => t.dias.includes(fecha.getDay()))
  return tramo.turnos.flatMap((turno) => {
    const [desde, hasta] = turno.split(' – ').map(aMinutos)
    const horas = []
    for (let m = desde; m <= hasta - 60; m += 30) horas.push(aHora(m))
    return horas
  })
}
