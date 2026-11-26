<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { useBusquedaStore } from '../stores/busqueda'
import { useCarritoStore } from '../stores/carrito'
import { useTemaStore } from '../stores/tema'

const busqueda = useBusquedaStore()
const carrito = useCarritoStore()
const tema = useTemaStore()
const router = useRouter()

function buscar() {
  router.push('/')
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark barra-russet">
    <div class="container-fluid">
      <RouterLink class="navbar-brand" to="/">
        <i class="bi bi-phone"></i> Tienda CellPhone
      </RouterLink>

      <!-- Botón de modo oscuro: siempre visible en la barra -->
      <button
        class="btn-tema ms-auto ms-lg-2 me-2 me-lg-0 order-lg-last"
        type="button"
        :aria-label="tema.oscuro ? 'Activar modo claro' : 'Activar modo oscuro'"
        @click="tema.alternar()"
      >
        <i class="bi" :class="tema.oscuro ? 'bi-sun-fill' : 'bi-moon-fill'"></i>
        <span class="tema-tip">
          {{ tema.oscuro ? 'Activar modo claro' : 'Activar modo oscuro' }}
        </span>
      </button>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#menuPrincipal"
        aria-controls="menuPrincipal"
        aria-expanded="false"
        aria-label="Abrir menú"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="menuPrincipal">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/">Inicio</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/nuevo">Nuevo anuncio</RouterLink>
          </li>
          <li class="nav-item">
            <button class="nav-link btn btn-link" type="button" @click="carrito.abrir('carrito')">
              <i class="bi bi-cart3"></i> Carrito
              <span v-if="carrito.items.length" class="badge rounded-pill insignia-carrito">
                {{ carrito.items.length }}
              </span>
            </button>
          </li>
          <li class="nav-item">
            <button class="nav-link btn btn-link" type="button" @click="carrito.abrir('compras')">
              <i class="bi bi-receipt"></i> Mis compras
            </button>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/estadisticas">Estadísticas</RouterLink>
          </li>
        </ul>

        <form class="d-flex" @submit.prevent="buscar">
          <input
            id="buscar"
            name="buscar"
            class="form-control me-2"
            type="search"
            placeholder="Buscar"
            v-model="busqueda.texto"
            @input="buscar"
          />
          <button class="btn btn-outline-light" type="submit" aria-label="Buscar">
            <i class="bi bi-search"></i>
          </button>
        </form>
      </div>
    </div>
  </nav>
</template>
