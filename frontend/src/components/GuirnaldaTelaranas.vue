<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

// Guirnalda de Halloween para el borde superior de la portada: hilos combados que se repiten
// a lo ancho, telarañas en las dos esquinas e hilos colgando con arañitas colgando.

const ANCHO = 320 // ancho del tramo que se repite
const curva = (y0, combado) => (x) => {
  // Parábola entre (0, y0) y (ANCHO, y0) con su punto más bajo en el centro
  const t = x / ANCHO
  return y0 + 4 * combado * t * (1 - t)
}
// Varias capas de hilos combados, de la más tensa a la más caída
const capas = [curva(4, 22), curva(7, 34), curva(10, 45), curva(13, 55), curva(16, 64)]
const hiloBajo = capas.at(-1)
const curvasTela = capas
  .map((f) => `M0 ${f(0)}Q${ANCHO / 2} ${(2 * f(ANCHO / 2) - f(0)).toFixed(1)} ${ANCHO} ${f(0)}`)
  .join('')

// Hilos que unen cada capa con la siguiente, en zigzag, como en una tela
const cruces = capas
  .slice(0, -1)
  .flatMap((f, k) => {
    const sig = capas[k + 1]
    const desfase = k % 2 ? 11 : 0
    const xs = []
    for (let x = 14 + desfase; x < ANCHO - 8; x += 22) xs.push(x)
    return xs.map((x) => `M${x} ${f(x).toFixed(1)}L${x + 5} ${sig(x + 5).toFixed(1)}`)
  })
  .join('')

// Nudo de telaraña donde se unen dos tramos: abanico con sus vueltas
const angulosNudo = [8, 22, 36, 50, 64, 78]
const nudoMitad = (lado) => {
  const sx = lado === 'izq' ? 1 : -1
  const ox = lado === 'izq' ? 0 : ANCHO
  const p = (r, a) => [
    ox + sx * r * Math.cos((a * Math.PI) / 180),
    4 + r * Math.sin((a * Math.PI) / 180),
  ]
  const radios = angulosNudo.map(
    (a) =>
      `M${ox} 4L${p(34, a)
        .map((n) => n.toFixed(1))
        .join(' ')}`,
  )
  const vueltas = [10, 18, 26, 34].map((r) =>
    angulosNudo
      .map((a, i) => {
        const [x, y] = p(r, a).map((n) => n.toFixed(1))
        if (i === 0) return `M${x} ${y}`
        const [cx, cy] = p(r * 0.88, (a + angulosNudo[i - 1]) / 2).map((n) => n.toFixed(1))
        return `Q${cx} ${cy} ${x} ${y}`
      })
      .join(''),
  )
  return radios.join('') + vueltas.join('')
}
const nudo = nudoMitad('izq') + nudoMitad('der')

// Hilos que cuelgan: posición, largo y tamaño de la araña
const colgantes = [
  { x: 55, largo: 76, tam: 1 },
  { x: 108, largo: 34, tam: 0.7 },
  { x: 168, largo: 42, tam: 1.2 },
  { x: 222, largo: 46, tam: 0.8 },
  { x: 276, largo: 82, tam: 1 },
].map((c) => ({ ...c, y: hiloBajo(c.x) }))

// En pantallas con menú de móvil la frase de Halloween sube: los hilos se acortan para no taparla
const consulta = window.matchMedia('(max-width: 1023px)')
const estrecho = ref(consulta.matches)
const alCambiar = (e) => (estrecho.value = e.matches)
onMounted(() => consulta.addEventListener('change', alCambiar))
onBeforeUnmount(() => consulta.removeEventListener('change', alCambiar))
const colgantesVisibles = computed(() =>
  colgantes.map((c) => (estrecho.value ? { ...c, largo: Math.round(c.largo * 0.45) } : c)),
)

// Arañita dibujada con el extremo del hilo en (0, 0): patas (4 por lado), cabeza y abdomen
const patas = [
  'M-1.6 4.2q-3.5-3.2-6.2-2.2',
  'M-1.9 5.4q-4-1.4-6.8.6',
  'M-1.9 6.6q-4 .8-6.2 4.4',
  'M-1.6 7.6q-3 2.6-4.2 6.6',
]
const patasAranita = patas.join('') // el otro lado es el mismo trazo reflejado
const transformAranita = (c) => `translate(${c.x} ${(c.y + c.largo).toFixed(1)}) scale(${c.tam})`

// Telaraña de esquina (se dibuja para la izquierda y se refleja para la derecha)
const angulos = [5, 14, 23, 32, 41, 50, 59, 68, 77, 86]
const vueltas = [10, 20, 31, 43, 56, 70, 85, 100, 116]
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
  { x: 40, y: 58, largo: 54, tam: 1.1, largoLateral: true },
  { x: 78, y: 44, largo: 40, tam: 0.8 },
  // Hilos largos que caen por el lateral
  { x: 18, y: 104, largo: 190, tam: 1.15, largoLateral: true },
  { x: 60, y: 92, largo: 130, tam: 0.95, largoLateral: true },
  { x: 100, y: 55, largo: 235, tam: 0.85, largoLateral: true },
]

// Arañitas posadas sobre la tela (sin hilo): posición, tamaño y giro.
// El dibujo de la araña tiene el centro del cuerpo hacia (0, 6)
const posada = (x, y, tam, giro) => ({
  transform: `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${giro}) scale(${tam}) translate(0 -6)`,
})
const posadasTela = [
  posada(92, capas[1](92), 0.9, 15),
  posada(246, capas[2](246), 1, -20),
  posada(150, capas[3](150), 0.75, 5),
  posada(...punto(22, 45).map((n, i) => (i ? n + 4 : n)), 0.7, 135),
]
const posadasEsquina = [
  posada(...punto(56, 32), 1, 125),
  posada(...punto(85, 62), 0.8, 150),
  posada(...punto(31, 75), 0.65, 100),
]
</script>

<template>
  <div class="guirnalda" aria-hidden="true">
    <svg class="guirnalda__tira" width="100%" height="190">
      <defs>
        <pattern id="tramo-telarana" :width="ANCHO" height="190" patternUnits="userSpaceOnUse">
          <path :d="curvasTela" />
          <path class="fino" :d="cruces + nudo" />
          <g v-for="c in colgantesVisibles" :key="c.x" class="colgante">
            <path class="fino" :d="`M${c.x} ${c.y.toFixed(1)}V${(c.y + c.largo).toFixed(1)}`" />
            <g class="aranita" :transform="transformAranita(c)">
              <path class="aranita__patas" :d="patasAranita" />
              <path class="aranita__patas" :d="patasAranita" transform="scale(-1 1)" />
              <circle class="aranita__cuerpo" cy="3" r="2" />
              <ellipse class="aranita__cuerpo" cy="7.6" rx="3" ry="3.6" />
            </g>
          </g>
          <g v-for="(a, i) in posadasTela" :key="'p' + i" class="aranita" :transform="a.transform">
            <path class="aranita__patas" :d="patasAranita" />
            <path class="aranita__patas" :d="patasAranita" transform="scale(-1 1)" />
            <circle class="aranita__cuerpo" cy="3" r="2" />
            <ellipse class="aranita__cuerpo" cy="7.6" rx="3" ry="3.6" />
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
      viewBox="0 0 130 360"
    >
      <path :d="radiosEsquina" />
      <path class="fino" :d="vueltasEsquina" />
      <g v-for="c in colgantesEsquina" :key="c.x" :class="{ 'hilo-lateral': c.largoLateral }">
        <path class="fino" :d="`M${c.x} ${c.y}V${c.y + c.largo}`" />
        <g class="aranita" :transform="transformAranita(c)">
          <path class="aranita__patas" :d="patasAranita" />
          <path class="aranita__patas" :d="patasAranita" transform="scale(-1 1)" />
          <circle class="aranita__cuerpo" cy="3" r="2" />
          <ellipse class="aranita__cuerpo" cy="7.6" rx="3" ry="3.6" />
        </g>
      </g>
      <g
        v-for="(a, i) in posadasEsquina"
        :key="'e' + i"
        class="aranita hilo-lateral"
        :transform="a.transform"
      >
        <path class="aranita__patas" :d="patasAranita" />
        <path class="aranita__patas" :d="patasAranita" transform="scale(-1 1)" />
        <circle class="aranita__cuerpo" cy="3" r="2" />
        <ellipse class="aranita__cuerpo" cy="7.6" rx="3" ry="3.6" />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.guirnalda {
  position: absolute;
  inset: 0 0 auto;
  height: 360px;
  pointer-events: none;
  /* Centro del nombre del bar en la cabecera (mismo margen que .contenedor) */
  --nombre-x: calc(max(1.5rem, 50% - var(--ancho-max) / 2 + 1.5rem) + 5.5rem);
  /* Se desvanece hacia abajo y se aclara detrás del nombre para que se lea bien */
  -webkit-mask-image:
    linear-gradient(to bottom, #000 85%, transparent),
    radial-gradient(9rem 3.2rem at var(--nombre-x) 2.2rem, rgb(0 0 0 / 0.12) 55%, #000 100%);
  -webkit-mask-composite: source-in;
  mask-image:
    linear-gradient(to bottom, #000 85%, transparent),
    radial-gradient(9rem 3.2rem at var(--nombre-x) 2.2rem, rgb(0 0 0 / 0.12) 55%, #000 100%);
  mask-composite: intersect;
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

.aranita__patas {
  stroke: rgb(224 184 90 / 0.85);
  stroke-width: 0.8;
  stroke-linecap: round;
}

.aranita__cuerpo {
  fill: #1c140c;
  stroke: #e0b85a;
  stroke-width: 0.8;
}

.aranita {
  filter: drop-shadow(0 0 2px rgb(240 190 90 / 0.6));
}

.guirnalda__tira {
  top: 0;
  left: 0;
}

.guirnalda__esquina {
  top: 0;
  width: 130px;
  height: 360px;
}

/* En pantallas estrechas la esquina queda pegada al texto: ahí solo se ve la telaraña */
@media (max-width: 1439px) {
  .hilo-lateral {
    display: none;
  }
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
    height: 249px;
  }
}
</style>
