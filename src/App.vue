<script setup>
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue'
import CarritoPanel from './components/CarritoPanel.vue'
import ToastMensaje from './components/ToastMensaje.vue'
import FabCrear from './components/FabCrear.vue'
import { useAnunciosStore } from './stores/anuncios'

// Arranca la lectura de anuncios apenas se abre la página
useAnunciosStore()

const route = useRoute()
const mostrarFab = computed(() => ['inicio', 'estadisticas'].includes(route.name))
</script>

<template>
  <NavBar />
  <RouterView />
  <div v-if="mostrarFab" class="fab-espacio"></div>
  <FabCrear v-if="mostrarFab" />
  <CarritoPanel />
  <ToastMensaje />
</template>
