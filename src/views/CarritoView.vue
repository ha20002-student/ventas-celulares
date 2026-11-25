<script setup>
import { RouterLink } from 'vue-router'
import { useCarritoStore } from '../stores/carrito'

const carrito = useCarritoStore()
</script>

<template>
  <div class="container py-4">
    <h3 class="mb-3">Carrito</h3>

    <div v-if="carrito.items.length === 0" class="text-center py-5">
      <p class="text-muted">Tu carrito está vacío.</p>
      <RouterLink class="btn btn-russet" to="/">Ver teléfonos</RouterLink>
    </div>

    <div v-else>
      <ul class="list-group mb-3">
        <li
          v-for="t in carrito.items"
          :key="t.id"
          class="list-group-item d-flex justify-content-between align-items-center gap-2"
        >
          <div>
            <div>{{ t.titulo }}</div>
            <small class="text-muted">{{ t.vendedor }} · {{ t.telefono }}</small>
          </div>
          <div class="d-flex align-items-center gap-3">
            <strong class="texto-russet">${{ t.precio.toFixed(2) }}</strong>
            <button
              class="btn btn-sm btn-outline-russet"
              type="button"
              @click="carrito.quitar(t.id)"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </li>
      </ul>

      <div class="d-flex justify-content-between align-items-center">
        <h5 class="mb-0">
          Total: <span class="texto-russet">${{ carrito.total.toFixed(2) }}</span>
        </h5>
        <button class="btn btn-sm btn-outline-russet" type="button" @click="carrito.vaciar()">
          Vaciar carrito
        </button>
      </div>
    </div>
  </div>
</template>
