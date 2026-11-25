import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAvisoStore = defineStore('aviso', () => {
  const texto = ref('')
  let temporizador = null

  function mostrar(mensaje, segundos = 3) {
    texto.value = mensaje
    clearTimeout(temporizador)
    temporizador = setTimeout(() => {
      texto.value = ''
    }, segundos * 1000)
  }

  return { texto, mostrar }
})
