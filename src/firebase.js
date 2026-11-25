import { initializeApp } from 'firebase/app'
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore'

const app = initializeApp({
  apiKey: 'AIzaSyBSF7aFTA2F05O62W5nbcxcxOesqDgBjSw',
  authDomain: 'ventas-celulares.firebaseapp.com',
  projectId: 'ventas-celulares',
  storageBucket: 'ventas-celulares.firebasestorage.app',
  messagingSenderId: '761136440258',
  appId: '1:761136440258:web:9f2fff197b6a11a0a56c5b',
})

export const db = initializeFirestore(app, {
  // Si la conexión normal se atasca, usa una alternativa
  experimentalAutoDetectLongPolling: true,
  // Guarda los datos en el navegador: desde la segunda visita carga al instante
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
})
