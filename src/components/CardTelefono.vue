<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  telefono: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="card h-100 shadow-sm">
    <div class="card-body d-flex flex-column">
      <h5 class="card-title texto-russet">${{ telefono.precio.toFixed(2) }}</h5>
      <p class="card-text">{{ telefono.titulo }}</p>
      <p class="text-muted small mb-3">{{ telefono.estado }} · {{ telefono.marca }}</p>
      <RouterLink class="btn btn-russet mt-auto" :to="'/anuncio/' + telefono.id">
        Ver detalle
      </RouterLink>
    </div>
  </div>
</template>
