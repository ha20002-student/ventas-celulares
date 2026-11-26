<script setup>
import { computed, ref } from 'vue'
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

const fotos = computed(() => (telefono.value?.imagenes || []).filter((i) => i.id))
const rotas = ref([])

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
      <h4 class="mb-2">{{ telefono.titulo }}</h4>
      <h3 class="texto-russet mb-3">${{ telefono.precio.toFixed(2) }}</h3>

      <div v-if="fotos.length" class="d-flex flex-wrap gap-2 mb-3">
        <template v-for="f in fotos" :key="f.id">
          <img
            v-if="!rotas.includes(f.id)"
            :src="urlImagen(f.id)"
            :alt="f.nombre"
            class="foto-detalle"
            @error="rotas.push(f.id)"
          />
        </template>
      </div>

      <p class="mb-4">
        <strong>Vendedor:</strong> {{ telefono.vendedor }}
        <span class="ms-3"><strong>Teléfono:</strong> {{ telefono.telefono }}</span>
      </p>

      <h6 class="texto-russet">Descripción</h6>
      <ul class="list-unstyled mb-4">
        <li><strong>Estado:</strong> {{ telefono.estado }}</li>
        <li><strong>Marca:</strong> {{ telefono.marca }}</li>
        <li><strong>Modelo:</strong> {{ telefono.modelo }}</li>
        <li><strong>Pantalla:</strong> {{ telefono.pantalla }} pulgadas</li>
        <li><strong>Sistema:</strong> {{ telefono.sistema }}</li>
        <li><strong>Rom:</strong> {{ telefono.rom }}GB</li>
        <li><strong>Ram:</strong> {{ telefono.ram }}GB</li>
      </ul>

      <p>{{ telefono.descripcion }}</p>
    </div>

    <div class="barra-acciones">
      <RouterLink class="btn btn-outline-russet" to="/">Inicio</RouterLink>
      <button v-if="telefono" class="btn btn-russet" type="button" @click="comprar">Comprar</button>
    </div>
  </div>
</template>
