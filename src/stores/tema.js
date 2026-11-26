import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

const CLAVE = 'tema-oscuro'

function leer() {
  try {
    return localStorage.getItem(CLAVE) === '1'
  } catch {
    return false
  }
}

export const useTemaStore = defineStore('tema', () => {
  const oscuro = ref(leer())

  function aplicar() {
    document.documentElement.setAttribute('data-bs-theme', oscuro.value ? 'dark' : 'light')
  }

  aplicar()

  watch(oscuro, () => {
    aplicar()
    try {
      localStorage.setItem(CLAVE, oscuro.value ? '1' : '0')
    } catch {
      // si el navegador no permite guardar, el tema funciona igual
    }
  })

  function alternar() {
    oscuro.value = !oscuro.value
  }

  return { oscuro, alternar }
})
