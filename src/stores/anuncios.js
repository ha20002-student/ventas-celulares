import { ref } from 'vue'
import { defineStore } from 'pinia'
import { collection, addDoc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import datosIniciales from '../data/telefonos.json'

const NOMBRE_COLECCION = 'anuncios'

export const useAnunciosStore = defineStore('anuncios', () => {
  const lista = ref([])
  const cargando = ref(true)

  // Escucha Firestore en tiempo real: carga una vez y se actualiza solo
  onSnapshot(
    collection(db, NOMBRE_COLECCION),
    (snap) => {
      lista.value = snap.docs.map((d) => ({ ...d.data(), id: d.id }))
      cargando.value = false
    },
    (error) => {
      console.error('Error al leer Firestore:', error)
      // Si falla, se muestran los datos de prueba para no dejar la pantalla vacía
      lista.value = datosIniciales
      cargando.value = false
    },
  )

  function crear(datos) {
    const nuevo = {
      ...datos,
      fecha: new Date().toISOString().slice(0, 10),
    }
    // Firestore no acepta valores undefined
    const limpio = JSON.parse(JSON.stringify(nuevo))
    return addDoc(collection(db, NOMBRE_COLECCION), limpio)
  }

  return { lista, cargando, crear }
})
