<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useAnunciosStore } from '../stores/anuncios'
import CardTelefono from '../components/CardTelefono.vue'
import { useBusquedaStore } from '../stores/busqueda'

const anuncios = useAnunciosStore()

const busqueda = useBusquedaStore()
const sel = reactive({
  marca: [],
  sistema: [],
  pantalla: [],
  nuevo: false,
  precioMin: '',
  precioMax: '',
})

const orden = ref('precio-asc')

const opcionesOrden = [
  { valor: 'fecha-desc', texto: 'Más recientes' },
  { valor: 'fecha-asc', texto: 'Más antiguos' },
  { valor: 'precio-asc', texto: 'Precio: menor a mayor' },
  { valor: 'precio-desc', texto: 'Precio: mayor a menor' },
]

// Paginación
const pagina = ref(1)
const porPagina = ref(8)
const opcionesPorPagina = [4, 8, 12, 25]

const marcas = computed(() => [...new Set(anuncios.lista.map((t) => t.marca))])
const sistemas = computed(() => [...new Set(anuncios.lista.map((t) => t.sistema))])
const pantallas = computed(() =>
  [...new Set(anuncios.lista.map((t) => t.pantalla))].sort((a, b) => b - a),
)

function contar(campo, valor) {
  return anuncios.lista.filter((t) => t[campo] === valor).length
}

const filtrados = computed(() => {
  const lista = anuncios.lista.filter(
    (t) =>
      (sel.marca.length === 0 || sel.marca.includes(t.marca)) &&
      (sel.sistema.length === 0 || sel.sistema.includes(t.sistema)) &&
      (sel.pantalla.length === 0 || sel.pantalla.includes(t.pantalla)) &&
      (!sel.nuevo || t.estado === 'Nuevo') &&
      (sel.precioMin === '' || t.precio >= Number(sel.precioMin)) &&
      (sel.precioMax === '' || t.precio <= Number(sel.precioMax)) &&
      (busqueda.texto === '' ||
        (t.titulo + ' ' + t.marca + ' ' + t.modelo)
          .toLowerCase()
          .includes(busqueda.texto.toLowerCase())),
  )

  if (orden.value === 'precio-asc') return lista.sort((a, b) => a.precio - b.precio)
  if (orden.value === 'precio-desc') return lista.sort((a, b) => b.precio - a.precio)
  if (orden.value === 'fecha-asc') return lista.sort((a, b) => a.fecha.localeCompare(b.fecha))
  return lista.sort((a, b) => b.fecha.localeCompare(a.fecha))
})

const totalPaginas = computed(() =>
  Math.max(1, Math.ceil(filtrados.value.length / porPagina.value)),
)

const paginados = computed(() => {
  const inicio = (pagina.value - 1) * porPagina.value
  return filtrados.value.slice(inicio, inicio + porPagina.value)
})

watch([filtrados, porPagina], () => {
  pagina.value = 1
})

function irA(n) {
  if (n >= 1 && n <= totalPaginas.value) pagina.value = n
}

function limpiar() {
  sel.marca = []
  sel.sistema = []
  sel.pantalla = []
  sel.nuevo = false
  sel.precioMin = ''
  sel.precioMax = ''
  busqueda.texto = ''
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

        <h6 class="texto-russet mt-3">Precio</h6>
        <div class="d-flex align-items-center gap-2">
          <input
            class="form-control form-control-sm"
            type="number"
            min="0"
            placeholder="Desde $"
            v-model="sel.precioMin"
          />
          <input
            class="form-control form-control-sm"
            type="number"
            min="0"
            placeholder="Hasta $"
            v-model="sel.precioMax"
          />
        </div>

        <button class="btn btn-sm btn-russet mt-3" type="button" @click="limpiar">
          Limpiar filtros
        </button>
      </aside>

      <!-- Listado -->
      <section class="col-12 col-md-9 col-lg-10">
        <div class="d-flex justify-content-end align-items-center mb-3 gap-2">
          <span>Ordenar por:</span>
          <div class="dropdown">
            <button
              class="btn btn-sm btn-outline-russet dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {{ opcionesOrden.find((o) => o.valor === orden).texto }}
            </button>
            <ul class="dropdown-menu dropdown-menu-end menu-russet">
              <li v-for="o in opcionesOrden" :key="o.valor">
                <button
                  class="dropdown-item"
                  :class="{ active: orden === o.valor }"
                  type="button"
                  @click="orden = o.valor"
                >
                  {{ o.texto }}
                </button>
              </li>
            </ul>
          </div>
        </div>

        <p v-if="filtrados.length === 0" class="text-muted">No hay teléfonos con esos filtros.</p>
        <div class="row g-3">
          <div v-for="tel in paginados" :key="tel.id" class="col-12 col-sm-6 col-lg-3">
            <CardTelefono :telefono="tel" />
          </div>
        </div>

        <!-- Paginación -->
        <div
          v-if="filtrados.length > 0"
          class="d-flex flex-wrap justify-content-between align-items-center mt-4 gap-2"
        >
          <nav aria-label="Paginación">
            <ul class="pagination pagination-russet mb-0">
              <li class="page-item" :class="{ disabled: pagina === 1 }">
                <button class="page-link" type="button" @click="irA(pagina - 1)">&lt;</button>
              </li>
              <li
                v-for="n in totalPaginas"
                :key="n"
                class="page-item"
                :class="{ active: n === pagina }"
              >
                <button class="page-link" type="button" @click="irA(n)">{{ n }}</button>
              </li>
              <li class="page-item" :class="{ disabled: pagina === totalPaginas }">
                <button class="page-link" type="button" @click="irA(pagina + 1)">&gt;</button>
              </li>
            </ul>
          </nav>

          <div class="d-flex align-items-center gap-2">
            <label for="porPagina" class="mb-0">Artículos por página:</label>
            <select id="porPagina" class="form-select form-select-sm w-auto" v-model="porPagina">
              <option v-for="n in opcionesPorPagina" :key="n" :value="n">{{ n }}</option>
            </select>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
