<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark barra-russet">
    <div class="container-fluid">
      <RouterLink class="navbar-brand" to="/">
        <i class="bi bi-phone"></i> Tienda CellPhone
      </RouterLink>

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
            <RouterLink class="nav-link" to="/carrito">Carrito</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/estadisticas">Estadísticas</RouterLink>
          </li>
        </ul>

        <div class="d-flex">
          <input class="form-control me-2" type="search" placeholder="Buscar" />
          <button class="btn btn-outline-light" type="button">
            <i class="bi bi-search"></i>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>
