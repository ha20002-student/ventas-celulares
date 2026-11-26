<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAnunciosStore } from '../stores/anuncios'
import { useAvisoStore } from '../stores/aviso'
import { subirImagen } from '../couchdb'

const router = useRouter()
const anuncios = useAnunciosStore()
const aviso = useAvisoStore()

const form = reactive({
  titulo: '',
  precio: '',
  estado: 'Nuevo',
  marca: '',
  marcaOtra: '',
  modelo: '',
  pantalla: '',
  sistema: 'Android',
  rom: '',
  ram: '',
  vendedor: '',
  telefono: '',
  descripcion: '',
})

const MAX_IMAGENES = 4
const imagenes = ref([]) // { archivo, nombre, tamano, tipo }
const avisoImagenes = ref('')
const intento = ref(false)
const guardando = ref(false)
const marcasBase = ['Samsung', 'Huawei', 'Nokia', 'iPhone', 'Xiaomi']
const sistemas = ['Android', 'Windows', 'iOS']

const marcas = computed(() => {
  const todas = [...marcasBase, ...anuncios.lista.map((t) => t.marca)]
  return [...new Set(todas)].filter((m) => m && m !== '__otra__')
})

const marcaFinal = computed(() => {
  if (form.marca !== '__otra__') return form.marca
  const texto = form.marcaOtra.trim()
  if (!texto) return ''
  const existente = marcas.value.find((m) => m.toLowerCase() === texto.toLowerCase())
  return existente || texto.charAt(0).toUpperCase() + texto.slice(1)
})

const incompleto = computed(
  () =>
    !form.titulo.trim() ||
    !form.precio ||
    !marcaFinal.value ||
    !form.modelo.trim() ||
    !form.pantalla ||
    !form.rom ||
    !form.ram ||
    !form.vendedor.trim() ||
    !form.telefono.trim(),
)

// Agrega las fotos elegidas a las que ya estaban (hasta 4 en total)
function elegirImagenes(e) {
  avisoImagenes.value = ''

  for (const a of [...e.target.files]) {
    if (imagenes.value.length >= MAX_IMAGENES) {
      avisoImagenes.value = 'Solo se permiten ' + MAX_IMAGENES + ' imágenes por anuncio.'
      break
    }
    const repetida = imagenes.value.some((i) => i.nombre === a.name && i.archivo.size === a.size)
    if (repetida) continue

    imagenes.value.push({
      archivo: a,
      nombre: a.name,
      tamano: Math.round(a.size / 1024) + ' kb',
      tipo: a.type.split('/')[1] || 'img',
    })
  }

  // Limpia el selector para poder elegir otra foto (incluso la misma)
  e.target.value = ''
}

function quitarImagen(i) {
  imagenes.value.splice(i, 1)
  avisoImagenes.value = ''
}

async function subirTodas() {
  const subidas = []
  for (const img of imagenes.value) {
    try {
      const id = await subirImagen(img.archivo)
      subidas.push({ id, nombre: img.nombre, tamano: img.tamano, tipo: img.tipo })
    } catch (e) {
      console.error('No se pudo subir la imagen a CouchDB:', e)
    }
  }
  return subidas
}

async function crear() {
  intento.value = true
  if (incompleto.value || guardando.value) return

  guardando.value = true
  try {
    const subidas = await subirTodas()

    const promesa = anuncios.crear({
      titulo: form.titulo.trim(),
      precio: Number(form.precio),
      marca: marcaFinal.value,
      modelo: form.modelo.trim(),
      sistema: form.sistema,
      pantalla: Number(form.pantalla),
      rom: Number(form.rom),
      ram: Number(form.ram),
      estado: form.estado,
      vendedor: form.vendedor.trim(),
      telefono: form.telefono.trim(),
      descripcion: form.descripcion.trim(),
      imagenes: subidas,
    })

    const faltaron = imagenes.value.length - subidas.length
    aviso.mostrar(
      faltaron > 0
        ? 'Anuncio guardado, pero no se pudieron subir algunas imágenes'
        : 'El anuncio se guardó satisfactoriamente',
      3,
    )
    router.push('/')
    await promesa
  } catch (e) {
    console.error('Error al guardar:', e)
    aviso.mostrar('No se pudo guardar el anuncio', 4)
    guardando.value = false
  }
}

function cancelar() {
  router.push('/')
}
</script>

<template>
  <div class="container py-4" style="max-width: 760px">
    <h4 class="mb-3">Nuevo anuncio</h4>

    <form @submit.prevent="crear" novalidate>
      <div class="mb-3">
        <label class="form-label" for="titulo">Título breve del anuncio</label>
        <input
          id="titulo"
          class="form-control"
          :class="{ 'is-invalid': intento && !form.titulo.trim() }"
          v-model="form.titulo"
        />
      </div>

      <div class="row g-3 mb-3">
        <div class="col-6">
          <label class="form-label" for="precio">Precio ($)</label>
          <input
            id="precio"
            type="number"
            min="0"
            step="0.01"
            class="form-control"
            :class="{ 'is-invalid': intento && !form.precio }"
            v-model="form.precio"
          />
        </div>
        <div class="col-6">
          <span class="form-label d-block">Estado</span>
          <div class="form-check form-check-inline mt-2">
            <input
              id="nuevo"
              class="form-check-input"
              type="radio"
              value="Nuevo"
              v-model="form.estado"
            />
            <label class="form-check-label" for="nuevo">Nuevo</label>
          </div>
          <div class="form-check form-check-inline">
            <input
              id="usado"
              class="form-check-input"
              type="radio"
              value="Usado"
              v-model="form.estado"
            />
            <label class="form-check-label" for="usado">Usado</label>
          </div>
        </div>
      </div>

      <div class="row g-3 mb-3">
        <div class="col-6">
          <label class="form-label" for="marca">Marca</label>
          <select
            id="marca"
            class="form-select"
            :class="{ 'is-invalid': intento && !marcaFinal }"
            v-model="form.marca"
          >
            <option value="" disabled>Elegir...</option>
            <option v-for="m in marcas" :key="m" :value="m">{{ m }}</option>
            <option value="__otra__">Otra marca...</option>
          </select>
          <input
            v-if="form.marca === '__otra__'"
            id="marcaOtra"
            class="form-control mt-2"
            :class="{ 'is-invalid': intento && !marcaFinal }"
            placeholder="Escribe la marca (ej. Motorola)"
            v-model="form.marcaOtra"
          />
        </div>
        <div class="col-6">
          <label class="form-label" for="modelo">Modelo</label>
          <input
            id="modelo"
            class="form-control"
            :class="{ 'is-invalid': intento && !form.modelo.trim() }"
            v-model="form.modelo"
          />
        </div>
      </div>

      <div class="row g-3 mb-3">
        <div class="col-6 col-md-3">
          <label class="form-label" for="pantalla">Pantalla (pulg.)</label>
          <input
            id="pantalla"
            type="number"
            min="1"
            step="0.1"
            class="form-control"
            :class="{ 'is-invalid': intento && !form.pantalla }"
            v-model="form.pantalla"
          />
        </div>
        <div class="col-6 col-md-3">
          <label class="form-label" for="sistema">Sistema</label>
          <select id="sistema" class="form-select" v-model="form.sistema">
            <option v-for="s in sistemas" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>
        <div class="col-6 col-md-3">
          <label class="form-label" for="rom">ROM (GB)</label>
          <input
            id="rom"
            type="number"
            min="1"
            class="form-control"
            :class="{ 'is-invalid': intento && !form.rom }"
            v-model="form.rom"
          />
        </div>
        <div class="col-6 col-md-3">
          <label class="form-label" for="ram">RAM (GB)</label>
          <input
            id="ram"
            type="number"
            min="1"
            class="form-control"
            :class="{ 'is-invalid': intento && !form.ram }"
            v-model="form.ram"
          />
        </div>
      </div>

      <div class="row g-3 mb-3">
        <div class="col-md-6">
          <label class="form-label" for="vendedor">Vendedor</label>
          <input
            id="vendedor"
            class="form-control"
            :class="{ 'is-invalid': intento && !form.vendedor.trim() }"
            v-model="form.vendedor"
          />
        </div>
        <div class="col-md-6">
          <label class="form-label" for="telefono">Teléfono</label>
          <input
            id="telefono"
            class="form-control"
            :class="{ 'is-invalid': intento && !form.telefono.trim() }"
            v-model="form.telefono"
          />
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label" for="descripcion">Descripción</label>
        <textarea
          id="descripcion"
          rows="4"
          class="form-control"
          v-model="form.descripcion"
        ></textarea>
      </div>

      <div class="mb-3">
        <label class="form-label" for="imagenes">
          Imágenes (máximo 4)
          <span class="text-muted small ms-1">{{ imagenes.length }}/{{ MAX_IMAGENES }}</span>
        </label>
        <input
          id="imagenes"
          type="file"
          accept="image/*"
          multiple
          class="form-control"
          :disabled="imagenes.length >= MAX_IMAGENES"
          @change="elegirImagenes"
        />
        <p v-if="avisoImagenes" class="text-danger small mt-1 mb-0">{{ avisoImagenes }}</p>

        <table v-if="imagenes.length" class="table table-sm mt-2 align-middle">
          <thead>
            <tr>
              <th>N</th>
              <th>Nombre</th>
              <th>Tamaño</th>
              <th>Tipo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(img, i) in imagenes" :key="img.nombre + i">
              <td>{{ i + 1 }}</td>
              <td>{{ img.nombre }}</td>
              <td>{{ img.tamano }}</td>
              <td>{{ img.tipo }}</td>
              <td class="text-end">
                <button
                  class="btn btn-sm btn-outline-russet"
                  type="button"
                  aria-label="Quitar imagen"
                  @click="quitarImagen(i)"
                >
                  <i class="bi bi-x-lg"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-if="intento && incompleto" class="text-danger small">
        Completa los campos marcados en rojo.
      </p>

      <div class="d-flex gap-2">
        <button class="btn btn-russet" type="submit" :disabled="guardando">
          {{ guardando ? 'Guardando...' : 'Crear' }}
        </button>
        <button class="btn btn-outline-russet" type="button" @click="cancelar">Cancelar</button>
      </div>
    </form>
  </div>
</template>
