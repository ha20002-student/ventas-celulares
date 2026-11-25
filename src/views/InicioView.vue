<script setup>
import { reactive, computed } from 'vue'
import telefonos from '../data/telefonos.json'
import CardTelefono from '../components/CardTelefono.vue'

const sel = reactive({
  marca: [],
  sistema: [],
  pantalla: [],
  nuevo: false,
})

const marcas = [...new Set(telefonos.map((t) => t.marca))]
const sistemas = [...new Set(telefonos.map((t) => t.sistema))]
const pantallas = [...new Set(telefonos.map((t) => t.pantalla))].sort((a, b) => b - a)

function contar(campo, valor) {
  return telefonos.filter((t) => t[campo] === valor).length
}

const filtrados = computed(() =>
  telefonos.filter(
    (t) =>
      (sel.marca.length === 0 || sel.marca.includes(t.marca)) &&
      (sel.sistema.length === 0 || sel.sistema.includes(t.sistema)) &&
      (sel.pantalla.length === 0 || sel.pantalla.includes(t.pantalla)) &&
      (!sel.nuevo || t.estado === 'Nuevo'),
  ),
)

function limpiar() {
  sel.marca = []
  sel.sistema = []
  sel.pantalla = []
  sel.nuevo = false
}
</script>

<template>
  <div class="container-fluid py-4">
    <div class="row">
      <!-- Panel de filtros -->
      <aside class="col-12 col-md-3 col-lg-2 mb-3">
        <h6 class="texto-russet">Marca</h6>
        <div v-for="m in marcas" :key="m" class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            :id="'marca-' + m"
            :value="m"
            v-model="sel.marca"
          />
          <label class="form-check-label" :for="'marca-' + m">
            {{ m }} ({{ contar('marca', m) }})
          </label>
        </div>

        <h6 class="texto-russet mt-3">Sistema</h6>
        <div v-for="s in sistemas" :key="s" class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            :id="'sistema-' + s"
            :value="s"
            v-model="sel.sistema"
          />
          <label class="form-check-label" :for="'sistema-' + s">
            {{ s }} ({{ contar('sistema', s) }})
          </label>
        </div>

        <h6 class="texto-russet mt-3">Pantalla</h6>
        <div v-for="p in pantallas" :key="p" class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            :id="'pantalla-' + p"
            :value="p"
            v-model="sel.pantalla"
          />
          <label class="form-check-label" :for="'pantalla-' + p">
            {{ p.toFixed(1) }} ({{ contar('pantalla', p) }})
          </label>
        </div>

        <div class="form-check mt-3">
          <input class="form-check-input" type="checkbox" id="nuevo" v-model="sel.nuevo" />
          <label class="form-check-label" for="nuevo">Nuevo</label>
        </div>

        <button class="btn btn-sm btn-russet mt-3" type="button" @click="limpiar">
          Limpiar filtros
        </button>
      </aside>

      <!-- Listado -->
      <section class="col-12 col-md-9 col-lg-10">
        <p v-if="filtrados.length === 0" class="text-muted">No hay teléfonos con esos filtros.</p>
        <div class="row g-3">
          <div v-for="tel in filtrados" :key="tel.id" class="col-12 col-sm-6 col-lg-3">
            <CardTelefono :telefono="tel" />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
