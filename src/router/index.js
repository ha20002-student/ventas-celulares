import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'inicio', component: () => import('../views/inicioView.vue') },
    { path: '/anuncio/:id', name: 'detalle', component: () => import('../views/DetalleView.vue') },
    { path: '/nuevo', name: 'nuevo', component: () => import('../views/NuevoAnuncioView.vue') },
    { path: '/estadisticas', name: 'estadisticas', component: () => import('../views/EstadisticasView.vue') },
    { path: '/carrito', name: 'carrito', component: () => import('../views/CarritoView.vue') },
  ],
})

export default router;
