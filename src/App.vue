<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
import CarritoPanel from './components/CarritoPanel.vue'
import ToastMensaje from './components/ToastMensaje.vue'
</script>

<template>
  <NavBar />
  <RouterView />
  <CarritoPanel />
  <ToastMensaje />
</template>
