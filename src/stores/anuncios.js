import { ref } from 'vue'
import { defineStore } from 'pinia'
import { collection, doc, setDoc, getDocs, onSnapshot, writeBatch } from 'firebase/firestore'
import { db } from '../firebase'
import datosIniciales from '../data/telefonos.json'

export const useAnunciosStore = defineStore('anuncios', () => {
  const lista = ref([])
  const cargando = ref(true)
  const col = collection(db, 'anuncios')

  // La primera vez, si la colección está vacía, sube los 12 teléfonos de prueba
  async function sembrarSiVacio() {
    const snap = await getDocs(col)
    if (!snap.empty) return
    const lote = writeBatch(db)
    datosIniciales.forEach((t) => lote.set(doc(col, String(t.id)), t))
    await lote.commit()
  }

  // Escucha cambios en tiempo real: la lista se actualiza sola
  onSnapshot(col, (snap) => {
    lista.value = snap.docs.map((d) => d.data())
    cargando.value = false
  })
  sembrarSiVacio()

  async function crear(datos) {
    const id = lista.value.reduce((max, t) => Math.max(max, t.id), 0) + 1
    const nuevo = {
      ...datos,
      id,
      fecha: new Date().toISOString().slice(0, 10),
    }
    await setDoc(doc(col, String(id)), nuevo)
    return nuevo
  }

  return { lista, cargando, crear }
})
