<script setup>
import telefonos from '../data/telefonos.json'
import CardTelefono from '../components/CardTelefono.vue'
</script>

<template>
  <div class="container py-4">
    <div class="row g-3">
      <div v-for="tel in telefonos" :key="tel.id" class="col-12 col-sm-6 col-lg-3">
        <CardTelefono :telefono="tel" />
      </div>
    </div>
  </div>
</template>
