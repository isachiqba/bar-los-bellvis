// De dónde salen la carta y la galería:
// - en desarrollo, de la API de Django (/api/...)
// - en la web publicada, de los archivos que genera `python manage.py exportar_web` en public/datos/
export const urlDatos = (recurso) =>
  import.meta.env.DEV ? `/api/${recurso}/` : `/datos/${recurso}.json`
