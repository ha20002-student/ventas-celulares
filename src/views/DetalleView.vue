<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import telefonos from '../data/telefonos.json'
import { useCarritoStore } from '../stores/carrito'

const route = useRoute()
const router = useRouter()
const carrito = useCarritoStore()

const telefono = computed(() => telefonos.find((t) => t.id === Number(route.params.id)))

const agregado = ref(false)

function comprar() {
  carrito.agregar(telefono.value)
  agregado.value = true
  setTimeout(() => router.push('/carrito'), 800)
}
</script>

<template>
  <div class="container py-4 pb-5 mb-5">
    <div v-if="!telefono" class="text-center py-5">
      <p class="text-muted">No se encontró el anuncio.</p>
      <RouterLink class="btn btn-russet" to="/">Volver al inicio</RouterLink>
    </div>

    <div v-else>
      <h4 class="mb-2">{{ telefono.titulo }}</h4>
      <h3 class="texto-russet mb-3">${{ telefono.precio.toFixed(2) }}</h3>

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

      <div v-if="agregado" class="alert alert-success py-2">
        Agregado al carrito. Redirigiendo...
      </div>
    </div>

    <!-- Botones siempre visibles -->
    <div class="barra-acciones">
      <RouterLink class="btn btn-outline-russet" to="/">Inicio</RouterLink>
      <button v-if="telefono" class="btn btn-russet" type="button" @click="comprar">Comprar</button>
    </div>
  </div>
</template>
