<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <RouterLink class="fab-crear" to="/nuevo" aria-label="Nuevo anuncio">
    <i class="bi bi-plus-lg"></i>
    <span class="fab-tip">Nuevo anuncio</span>
  </RouterLink>
</template>
