// v-reveal: el elemento aparece con una animación cuando entra en pantalla
const observador =
  typeof IntersectionObserver === 'undefined'
    ? null
    : new IntersectionObserver(
        (entradas) => {
          for (const entrada of entradas) {
            if (!entrada.isIntersecting) continue
            entrada.target.classList.add('visible')
            observador.unobserve(entrada.target)
          }
        },
        { threshold: 0.15 },
      )

export const reveal = {
  mounted(el, { value: retraso = 0 }) {
    el.classList.add('reveal')
    if (retraso) el.style.transitionDelay = `${retraso}ms`
    if (observador) observador.observe(el)
    else el.classList.add('visible')
  },
  unmounted(el) {
    observador?.unobserve(el)
  },
}
