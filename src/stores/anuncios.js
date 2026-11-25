import { ref } from 'vue'
import { defineStore } from 'pinia'
import datosIniciales from '../data/telefonos.json'

export const useAnunciosStore = defineStore('anuncios', () => {
  const lista = ref([...datosIniciales])

  function crear(datos) {
    const id = lista.value.reduce((max, t) => Math.max(max, t.id), 0) + 1
    const nuevo = {
      ...datos,
      id,
      fecha: new Date().toISOString().slice(0, 10),
    }
    lista.value.push(nuevo)
    return nuevo
  }

  return { lista, crear }
})
