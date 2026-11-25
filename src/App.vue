<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
import CarritoPanel from './components/CarritoPanel.vue'
import ToastMensaje from './components/ToastMensaje.vue'
import { useAnunciosStore } from './stores/anuncios'

useAnunciosStore()
</script>

<template>
  <NavBar />
  <RouterView />
  <CarritoPanel />
  <ToastMensaje />
</template>
