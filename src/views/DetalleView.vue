<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useAnunciosStore } from '../stores/anuncios'
import { useCarritoStore } from '../stores/carrito'
import { urlImagen } from '../couchdb'

const route = useRoute()
const anuncios = useAnunciosStore()
const carrito = useCarritoStore()

const telefono = computed(() =>
  anuncios.lista.find((t) => String(t.id) === String(route.params.id)),
)

// Galería
const actual = ref(0)
const rotas = ref([])

const fotos = computed(() =>
  (telefono.value?.imagenes || []).filter((i) => i.id && !rotas.value.includes(i.id)),
)

const indice = computed(() => Math.min(actual.value, Math.max(fotos.value.length - 1, 0)))
const fotoActual = computed(() => fotos.value[indice.value])

watch(
  () => route.params.id,
  () => {
    actual.value = 0
    rotas.value = []
  },
)

function anterior() {
  actual.value = (indice.value - 1 + fotos.value.length) % fotos.value.length
}

function siguiente() {
  actual.value = (indice.value + 1) % fotos.value.length
}

// Tarjetas de "Vista rápida"
const ficha = computed(() => {
  const t = telefono.value
  if (!t) return []
  return [
    { icono: 'bi-tag', etiqueta: 'Estado', valor: t.estado },
    { icono: 'bi-phone', etiqueta: 'Modelo', valor: t.modelo },
    { icono: 'bi-arrows-fullscreen', etiqueta: 'Pantalla', valor: t.pantalla + ' pulgadas' },
    { icono: 'bi-layers', etiqueta: 'Sistema', valor: t.sistema },
    { icono: 'bi-hdd', etiqueta: 'Memoria ROM', valor: t.rom + ' GB' },
    { icono: 'bi-memory', etiqueta: 'Memoria RAM', valor: t.ram + ' GB' },
  ]
})

function comprar() {
  carrito.agregar(telefono.value)
  carrito.abrir('carrito')
}
</script>

<template>
  <div class="container py-4 pb-5 mb-5">
    <div v-if="anuncios.cargando" class="text-muted">Cargando...</div>

    <div v-else-if="!telefono" class="text-center py-5">
      <p class="text-muted">No se encontró el anuncio.</p>
      <RouterLink class="btn btn-russet" to="/">Volver al inicio</RouterLink>
    </div>

    <div v-else>
      <!-- Ruta de navegación -->
      <nav class="migas mb-3">
        <RouterLink to="/">Inicio</RouterLink>
        <i class="bi bi-chevron-right"></i>
        <span>{{ telefono.marca }}</span>
        <i class="bi bi-chevron-right"></i>
        <span class="migas-actual">{{ telefono.modelo }}</span>
      </nav>

      <div class="row g-4">
        <!-- Galería -->
        <div class="col-12 col-lg-6">
          <div class="galeria-principal">
            <span class="galeria-etiqueta">{{ telefono.estado }}</span>

            <img
              v-if="fotoActual"
              :src="urlImagen(fotoActual.id)"
              :alt="telefono.titulo"
              @error="rotas.push(fotoActual.id)"
            />
            <i v-else class="bi bi-phone galeria-vacia"></i>

            <template v-if="fotos.length > 1">
              <button
                class="galeria-flecha izq"
                type="button"
                aria-label="Anterior"
                @click="anterior"
              >
                <i class="bi bi-chevron-left"></i>
              </button>
              <button
                class="galeria-flecha der"
                type="button"
                aria-label="Siguiente"
                @click="siguiente"
              >
                <i class="bi bi-chevron-right"></i>
              </button>
            </template>
          </div>

          <div v-if="fotos.length > 1" class="miniaturas">
            <button
              v-for="(f, i) in fotos"
              :key="f.id"
              type="button"
              class="miniatura"
              :class="{ activa: i === indice }"
              @click="actual = i"
            >
              <img :src="urlImagen(f.id)" :alt="f.nombre" @error="rotas.push(f.id)" />
            </button>
          </div>
        </div>

        <!-- Información principal -->
        <div class="col-12 col-lg-6">
          <div class="texto-suave mb-1">{{ telefono.marca }}</div>
          <h3 class="mb-3">{{ telefono.titulo }}</h3>
          <div class="precio-grande mb-3">${{ telefono.precio.toFixed(2) }}</div>

          <button class="btn btn-russet btn-lg w-100 mb-3" type="button" @click="comprar">
            <i class="bi bi-cart3 me-1"></i> Comprar
          </button>

          <div class="vendedor-tarjeta">
            <div class="vendedor-inicial">{{ telefono.vendedor.charAt(0).toUpperCase() }}</div>
            <div class="flex-grow-1">
              <div>
                <span class="texto-suave">Vendedor:</span> <strong>{{ telefono.vendedor }}</strong>
              </div>
              <div>
                <span class="texto-suave">Teléfono:</span> <strong>{{ telefono.telefono }}</strong>
              </div>
            </div>
            <i class="bi bi-telephone vendedor-icono"></i>
          </div>
        </div>
      </div>

      <!-- Vista rápida -->
      <h5 class="texto-russet mt-4 mb-3">Vista rápida</h5>
      <div class="row g-3">
        <div v-for="d in ficha" :key="d.etiqueta" class="col-6 col-md-4 col-lg-2">
          <div class="spec-tarjeta">
            <i class="bi" :class="d.icono"></i>
            <div class="spec-etiqueta">{{ d.etiqueta }}</div>
            <div class="spec-valor">{{ d.valor }}</div>
          </div>
        </div>
      </div>

      <!-- Descripción del vendedor -->
      <h5 class="texto-russet mt-4 mb-2">Descripción</h5>
      <div class="descripcion-caja">
        {{ telefono.descripcion || 'El vendedor no agregó una descripción.' }}
      </div>
    </div>

    <!-- Botones siempre visibles -->
    <div class="barra-acciones">
      <RouterLink class="btn btn-outline-russet" to="/">Inicio</RouterLink>
      <button v-if="telefono" class="btn btn-russet" type="button" @click="comprar">Comprar</button>
    </div>
  </div>
</template>
