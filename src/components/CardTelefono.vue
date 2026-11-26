<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { urlImagen } from '../couchdb'

const props = defineProps({
  telefono: {
    type: Object,
    required: true,
  },
})

const fallo = ref(false)

const idFoto = computed(() => (props.telefono.imagenes || []).find((i) => i.id)?.id)
</script>

<template>
  <div class="card h-100 shadow-sm">
    <img
      v-if="idFoto && !fallo"
      :src="urlImagen(idFoto)"
      :alt="telefono.titulo"
      class="card-img-top foto-tarjeta"
      @error="fallo = true"
    />
    <div v-else class="foto-tarjeta foto-vacia"><i class="bi bi-phone"></i></div>

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
