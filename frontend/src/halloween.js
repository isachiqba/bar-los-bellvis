// Temporada de Halloween: la decoración solo aparece entre estas fechas (mes-día, ambas incluidas).
// Con ?halloween en la URL se fuerza para probarla fuera de fecha.
const TEMPORADA = { desde: '10-15', hasta: '11-01' }

function enTemporada(fecha = new Date()) {
  if (new URLSearchParams(window.location.search).has('halloween')) return true
  const hoy = `${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`
  return hoy >= TEMPORADA.desde && hoy <= TEMPORADA.hasta
}

export const esHalloween = enTemporada()

// Emoji que acompaña al antetítulo de una sección durante la temporada
export const icono = (emoji) => (esHalloween ? ` ${emoji}` : '')
