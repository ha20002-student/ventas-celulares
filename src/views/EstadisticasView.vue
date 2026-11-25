<script setup>
import { computed } from 'vue'
import { Bar, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'
import { useAnunciosStore } from '../stores/anuncios'

ChartJS.register(Tooltip, Legend, BarElement, ArcElement, CategoryScale, LinearScale)

const anuncios = useAnunciosStore()

const paleta = ['#7b332f', '#c98b4a', '#4a6fa5', '#5e8c7a', '#9a4741', '#8a7f78', '#d4a5a0']
const colorDe = (i) => paleta[i % paleta.length]

// Cuenta anuncios por un campo (marca, sistema, estado), de mayor a menor
function contarPor(campo) {
  const cuenta = {}
  anuncios.lista.forEach((t) => {
    cuenta[t[campo]] = (cuenta[t[campo]] || 0) + 1
  })
  const pares = Object.entries(cuenta).sort((a, b) => b[1] - a[1])
  return { etiquetas: pares.map((p) => p[0]), valores: pares.map((p) => p[1]) }
}

const total = computed(() => anuncios.lista.length)
const precioPromedio = computed(() =>
  total.value ? anuncios.lista.reduce((suma, t) => suma + t.precio, 0) / total.value : 0,
)
const nuevos = computed(() => anuncios.lista.filter((t) => t.estado === 'Nuevo').length)
const usados = computed(() => total.value - nuevos.value)

const porMarca = computed(() => {
  const { etiquetas, valores } = contarPor('marca')
  return {
    labels: etiquetas,
    datasets: [{ data: valores, backgroundColor: etiquetas.map((_, i) => colorDe(i)) }],
  }
})

const porSistema = computed(() => {
  const { etiquetas, valores } = contarPor('sistema')
  return {
    labels: etiquetas,
    datasets: [{ data: valores, backgroundColor: etiquetas.map((_, i) => colorDe(i)) }],
  }
})

const porEstado = computed(() => ({
  labels: ['Nuevo', 'Usado'],
  datasets: [{ data: [nuevos.value, usados.value], backgroundColor: ['#7b332f', '#c98b4a'] }],
}))

const promedioMarca = computed(() => {
  const grupos = {}
  anuncios.lista.forEach((t) => {
    if (!grupos[t.marca]) grupos[t.marca] = []
    grupos[t.marca].push(t.precio)
  })
  const pares = Object.entries(grupos)
    .map(([marca, precios]) => [marca, precios.reduce((a, b) => a + b, 0) / precios.length])
    .sort((a, b) => b[1] - a[1])
  return {
    labels: pares.map((p) => p[0]),
    datasets: [
      {
        data: pares.map((p) => Math.round(p[1] * 100) / 100),
        backgroundColor: pares.map((_, i) => colorDe(i)),
      },
    ],
  }
})

const opcionesBarra = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
}

const opcionesDinero = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { callbacks: { label: (c) => '$' + c.parsed.y.toFixed(2) } },
  },
  scales: { y: { beginAtZero: true, ticks: { callback: (v) => '$' + v } } },
}

const opcionesDona = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom' } },
}
</script>

<template>
  <div class="container py-4">
    <h4 class="texto-russet mb-3">Estadísticas</h4>

    <p v-if="anuncios.cargando" class="text-muted">Cargando datos...</p>

    <template v-else>
      <!-- Resumen -->
      <div class="row g-3 mb-4">
        <div class="col-6 col-md-3">
          <div class="border rounded-3 p-3 text-center h-100">
            <div class="fs-3 fw-bold texto-russet">{{ total }}</div>
            <div class="small text-muted">Anuncios</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="border rounded-3 p-3 text-center h-100">
            <div class="fs-3 fw-bold texto-russet">${{ precioPromedio.toFixed(2) }}</div>
            <div class="small text-muted">Precio promedio</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="border rounded-3 p-3 text-center h-100">
            <div class="fs-3 fw-bold texto-russet">{{ nuevos }}</div>
            <div class="small text-muted">Nuevos</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="border rounded-3 p-3 text-center h-100">
            <div class="fs-3 fw-bold texto-russet">{{ usados }}</div>
            <div class="small text-muted">Usados</div>
          </div>
        </div>
      </div>

      <!-- Gráficos -->
      <div class="row g-4">
        <div class="col-12 col-lg-6">
          <div class="border rounded-3 p-3">
            <h6 class="texto-russet">Anuncios por marca</h6>
            <div style="height: 280px"><Bar :data="porMarca" :options="opcionesBarra" /></div>
          </div>
        </div>

        <div class="col-12 col-lg-6">
          <div class="border rounded-3 p-3">
            <h6 class="texto-russet">Precio promedio por marca</h6>
            <div style="height: 280px">
              <Bar :data="promedioMarca" :options="opcionesDinero" />
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="border rounded-3 p-3">
            <h6 class="texto-russet">Anuncios por sistema</h6>
            <div style="height: 280px">
              <Doughnut :data="porSistema" :options="opcionesDona" />
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="border rounded-3 p-3">
            <h6 class="texto-russet">Nuevos y usados</h6>
            <div style="height: 280px">
              <Doughnut :data="porEstado" :options="opcionesDona" />
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
