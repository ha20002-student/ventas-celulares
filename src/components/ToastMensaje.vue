<script setup>
import { useAvisoStore } from '../stores/aviso'

const aviso = useAvisoStore()
</script>

<template>
  <Transition name="toast">
    <div v-if="aviso.texto" class="toast-russet" role="status">
      <i class="bi bi-check-circle-fill me-2"></i>{{ aviso.texto }}
    </div>
  </Transition>
</template>
