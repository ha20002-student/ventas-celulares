<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
import CarritoPanel from './components/CarritoPanel.vue'
</script>

<template>
  <NavBar />
  <RouterView />
  <CarritoPanel />
</template>
