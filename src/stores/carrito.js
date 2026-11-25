import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCarritoStore = defineStore('carrito', () => {
  const items = ref([])

  const total = computed(() => items.value.reduce((suma, t) => suma + t.precio, 0))

  function agregar(telefono) {
    if (!items.value.some((t) => t.id === telefono.id)) {
      items.value.push(telefono)
    }
  }

  function quitar(id) {
    items.value = items.value.filter((t) => t.id !== id)
  }

  function vaciar() {
    items.value = []
  }

  return { items, total, agregar, quitar, vaciar }
})
