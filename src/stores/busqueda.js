import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useBusquedaStore = defineStore('busqueda', () => {
  const texto = ref('')
  return { texto }
})
