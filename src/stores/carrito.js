import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCarritoStore = defineStore('carrito', () => {
  const items = ref([])
  const compras = ref([])
  const abierto = ref(false)
  const vista = ref('carrito') // 'carrito' | 'compras' | 'confirmacion'
  const ultima = ref(null)

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

  function abrir(v = 'carrito') {
    vista.value = v
    abierto.value = true
  }

  function cerrar() {
    abierto.value = false
  }

  function finalizar() {
    if (items.value.length === 0) return
    const compra = {
      numero: 'TC-' + (20030 + compras.value.length),
      fecha: new Date().toLocaleString('es-SV'),
      total: total.value,
      items: [...items.value],
    }
    compras.value.unshift(compra)
    ultima.value = compra
    items.value = []
    vista.value = 'confirmacion'
  }

  return {
    items,
    compras,
    abierto,
    vista,
    ultima,
    total,
    agregar,
    quitar,
    vaciar,
    abrir,
    cerrar,
    finalizar,
  }
})
