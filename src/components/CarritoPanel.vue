<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCarritoStore } from '../stores/carrito'

const carrito = useCarritoStore()
const router = useRouter()

const vendedores = computed(() => {
  if (!carrito.ultima) return []
  const mapa = new Map()
  carrito.ultima.items.forEach((t) => mapa.set(t.vendedor, t.telefono))
  return [...mapa].map(([nombre, telefono]) => ({ nombre, telefono }))
})

function seguirComprando() {
  carrito.cerrar()
  carrito.vista = 'carrito'
  router.push('/')
}
</script>

<template>
  <div class="panel-fondo" :class="{ visible: carrito.abierto }" @click="carrito.cerrar()"></div>

  <aside class="panel-carrito" :class="{ visible: carrito.abierto }" aria-label="Carrito">
    <header class="panel-cabecera">
      <h5 class="mb-0">
        {{ carrito.vista === 'compras' ? 'Mis compras' : 'Carrito' }}
        <span v-if="carrito.items.length && carrito.vista === 'carrito'" class="panel-contador">
          {{ carrito.items.length }}
        </span>
      </h5>
      <button class="panel-cerrar" type="button" aria-label="Cerrar" @click="carrito.cerrar()">
        <i class="bi bi-x-lg"></i>
      </button>
    </header>

    <div v-if="carrito.vista !== 'confirmacion'" class="panel-tabs">
      <button
        type="button"
        :class="{ activa: carrito.vista === 'carrito' }"
        @click="carrito.vista = 'carrito'"
      >
        Carrito
      </button>
      <button
        type="button"
        :class="{ activa: carrito.vista === 'compras' }"
        @click="carrito.vista = 'compras'"
      >
        Mis compras
      </button>
    </div>

    <!-- CARRITO -->
    <template v-if="carrito.vista === 'carrito'">
      <div class="panel-cuerpo">
        <p v-if="carrito.items.length === 0" class="panel-vacio">Tu carrito está vacío.</p>

        <div v-for="t in carrito.items" :key="t.id" class="panel-item">
          <div class="panel-foto"><i class="bi bi-phone"></i></div>
          <div class="flex-grow-1">
            <div>{{ t.titulo }}</div>
            <small class="panel-suave">{{ t.estado }}</small>
            <div class="panel-precio">${{ t.precio.toFixed(2) }}</div>
          </div>
          <button class="panel-borrar" type="button" @click="carrito.quitar(t.id)">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>

      <footer v-if="carrito.items.length" class="panel-pie">
        <div class="panel-fila">
          <span>{{ carrito.items.length }} artículo(s)</span>
          <span>${{ carrito.total.toFixed(2) }}</span>
        </div>
        <div class="panel-fila">
          <span>Envío</span>
          <span>A coordinar con el vendedor</span>
        </div>
        <hr />
        <div class="panel-fila panel-total">
          <span>Subtotal</span>
          <span>${{ carrito.total.toFixed(2) }}</span>
        </div>
        <button class="btn-finalizar" type="button" @click="carrito.finalizar()">
          Finalizar compra <i class="bi bi-arrow-right ms-1"></i>
        </button>
        <p class="panel-suave text-center small mt-2 mb-0">
          Compra simulada · no se realiza ningún cobro
        </p>
      </footer>
    </template>

    <!-- MIS COMPRAS (documentos) -->
    <div v-else-if="carrito.vista === 'compras'" class="panel-cuerpo">
      <p v-if="carrito.compras.length === 0" class="panel-vacio">Aún no tienes compras.</p>

      <div v-for="c in carrito.compras" :key="c.numero" class="panel-doc">
        <div class="panel-fila">
          <strong>Pedido #{{ c.numero }}</strong>
          <strong class="panel-precio">${{ c.total.toFixed(2) }}</strong>
        </div>
        <small class="panel-suave">{{ c.fecha }}</small>
        <ul class="panel-doc-lista">
          <li v-for="t in c.items" :key="t.id">
            {{ t.titulo }}
            <div class="panel-suave small">
              <i class="bi bi-person"></i> {{ t.vendedor }} · {{ t.telefono }}
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- CONFIRMACIÓN -->
    <div v-else class="panel-confirmacion">
      <div class="panel-check"><i class="bi bi-check-lg"></i></div>
      <h4>¡Compra confirmada!</h4>
      <p class="panel-suave">
        Pedido <strong>#{{ carrito.ultima.numero }}</strong> por
        <strong>${{ carrito.ultima.total.toFixed(2) }}</strong
        >. El vendedor te contactará para coordinar la entrega.
      </p>

      <div v-for="v in vendedores" :key="v.nombre" class="panel-vendedor">
        <span>{{ v.nombre }}</span>
        <strong>{{ v.telefono }}</strong>
      </div>

      <button class="btn-seguir" type="button" @click="seguirComprando">Seguir comprando</button>
      <button class="btn-enlace" type="button" @click="carrito.vista = 'compras'">
        Ver mis compras
      </button>
    </div>
  </aside>
</template>
