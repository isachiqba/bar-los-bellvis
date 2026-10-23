<script setup>
// Guirnalda de Halloween para el borde superior de la portada: hilos combados que se repiten
// a lo ancho, telarañas en las dos esquinas e hilos colgando con pequeños colgantes dorados.

const ANCHO = 320 // ancho del tramo que se repite
const curva = (y0, combado) => (x) => {
  // Parábola entre (0, y0) y (ANCHO, y0) con su punto más bajo en el centro
  const t = x / ANCHO
  return y0 + 4 * combado * t * (1 - t)
}
const hilo1 = curva(6, 34)
const hilo2 = curva(14, 52)

// Hilos que unen las dos curvas, como en una tela
const cruces = [40, 85, 130, 190, 235, 280]
  .map((x) => `M${x} ${hilo1(x).toFixed(1)}L${x + 6} ${hilo2(x + 6).toFixed(1)}`)
  .join('')

// Abanico pequeño en el punto donde se unen dos tramos
const nudo = [10, 25, 40, 55]
  .flatMap((a) => {
    const r = 26
    const rad = (a * Math.PI) / 180
    const x = r * Math.cos(rad)
    const y = 6 + r * Math.sin(rad)
    return [
      `M0 6L${x.toFixed(1)} ${y.toFixed(1)}`,
      `M${ANCHO} 6L${(ANCHO - x).toFixed(1)} ${y.toFixed(1)}`,
    ]
  })
  .join('')

// Hilos que cuelgan: posición, largo y adorno
const colgantes = [
  { x: 55, largo: 62, adorno: 'rombo' },
  { x: 108, largo: 34, adorno: 'gota' },
  { x: 168, largo: 92, adorno: 'rombo' },
  { x: 222, largo: 46, adorno: 'gota' },
  { x: 276, largo: 74, adorno: 'rombo' },
].map((c) => ({ ...c, y: hilo2(c.x) }))

// Telaraña de esquina (se dibuja para la izquierda y se refleja para la derecha)
const angulos = [6, 22, 38, 54, 70, 84]
const vueltas = [16, 32, 50, 70, 92, 116]
const punto = (r, a) => [r * Math.cos((a * Math.PI) / 180), r * Math.sin((a * Math.PI) / 180)]
const radiosEsquina = angulos
  .map(
    (a) =>
      `M0 0L${punto(vueltas.at(-1), a)
        .map((n) => n.toFixed(1))
        .join(' ')}`,
  )
  .join('')
const vueltasEsquina = vueltas
  .map((r) =>
    angulos
      .map((a, i) => {
        const [x, y] = punto(r, a).map((n) => n.toFixed(1))
        if (i === 0) return `M${x} ${y}`
        const [cx, cy] = punto(r * 0.86, (a + angulos[i - 1]) / 2).map((n) => n.toFixed(1))
        return `Q${cx} ${cy} ${x} ${y}`
      })
      .join(''),
  )
  .join('')
const colgantesEsquina = [
  { x: 40, y: 58, largo: 70, adorno: 'rombo' },
  { x: 78, y: 44, largo: 40, adorno: 'gota' },
]
</script>

<template>
  <div class="guirnalda" aria-hidden="true">
    <svg class="guirnalda__tira" width="100%" height="190">
      <defs>
        <pattern id="tramo-telarana" :width="ANCHO" height="190" patternUnits="userSpaceOnUse">
          <path :d="`M0 6Q${ANCHO / 2} ${6 + 68} ${ANCHO} 6`" />
          <path :d="`M0 14Q${ANCHO / 2} ${14 + 104} ${ANCHO} 14`" />
          <path class="fino" :d="cruces + nudo" />
          <g v-for="c in colgantes" :key="c.x" class="colgante">
            <path class="fino" :d="`M${c.x} ${c.y.toFixed(1)}V${(c.y + c.largo).toFixed(1)}`" />
            <path
              v-if="c.adorno === 'rombo'"
              class="adorno"
              :d="`M${c.x} ${c.y + c.largo}l3 5-3 5-3-5z`"
            />
            <circle v-else class="adorno" :cx="c.x" :cy="c.y + c.largo + 2.5" r="2.2" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="190" fill="url(#tramo-telarana)" stroke="none" />
    </svg>

    <svg
      v-for="lado in ['izquierda', 'derecha']"
      :key="lado"
      class="guirnalda__esquina"
      :class="`guirnalda__esquina--${lado}`"
      viewBox="0 0 130 200"
    >
      <path :d="radiosEsquina" />
      <path class="fino" :d="vueltasEsquina" />
      <g v-for="c in colgantesEsquina" :key="c.x">
        <path class="fino" :d="`M${c.x} ${c.y}V${c.y + c.largo}`" />
        <path
          v-if="c.adorno === 'rombo'"
          class="adorno"
          :d="`M${c.x} ${c.y + c.largo}l3 5-3 5-3-5z`"
        />
        <circle v-else class="adorno" :cx="c.x" :cy="c.y + c.largo + 2.5" r="2.2" />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.guirnalda {
  position: absolute;
  inset: 0 0 auto;
  height: 200px;
  pointer-events: none;
  /* Se desvanece hacia abajo para no competir con el texto */
  -webkit-mask-image: linear-gradient(to bottom, #000 70%, transparent);
  mask-image: linear-gradient(to bottom, #000 70%, transparent);
}

svg {
  position: absolute;
  overflow: visible;
  fill: none;
  stroke: rgb(212 168 67 / 0.45);
  stroke-width: 1;
}

.fino {
  stroke: rgb(212 168 67 / 0.35);
  stroke-width: 0.7;
}

.adorno {
  fill: #e0b85a;
  stroke: none;
  filter: drop-shadow(0 0 3px rgb(240 190 90 / 0.8));
}

.guirnalda__tira {
  top: 0;
  left: 0;
}

.guirnalda__esquina {
  top: 0;
  width: 130px;
  height: 200px;
}

.guirnalda__esquina--izquierda {
  left: 0;
}

.guirnalda__esquina--derecha {
  right: 0;
  transform: scaleX(-1);
}

@media (max-width: 520px) {
  .guirnalda {
    height: 150px;
  }

  .guirnalda__tira {
    transform: scale(0.75);
    transform-origin: 0 0;
    width: 134%;
  }

  .guirnalda__esquina {
    width: 90px;
    height: 140px;
  }
}
</style>
