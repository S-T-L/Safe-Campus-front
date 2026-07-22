<script setup>
import { onMounted, onUnmounted } from 'vue'

const props = defineProps({
  item: { type: Object, required: true },
  color: { type: String, required: true },
})

const emit = defineEmits(['close', 'more-info'])

function onKeyDown(e) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => {
  document.addEventListener('keydown', onKeyDown)
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeyDown)
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="modal-overlay" role="dialog" aria-modal="true" :aria-label="item.title" @click.self="emit('close')">
    <div class="modal-panel" :style="{ '--theme-color': color }">

      <div class="modal-hero">
        <button class="btn-close" @click="emit('close')" aria-label="Fermer">✕</button>
      </div>

      <img :src="item.ninja" :alt="item.title" class="hero-ninja" />

      <!-- Contenu -->
      <div class="modal-scroll">
        <div class="modal-header">
          <span class="modal-tag">{{ item.subtitle }}</span>
          <h2 class="modal-title">{{ item.title }}</h2>
        </div>

        <p class="modal-description">{{ item.description }}</p>

        <button class="btn-resources" @click="emit('more-info')">
          Voir les ressources
          <span class="btn-arrow">→</span>
        </button>
      </div>

    </div>
  </div>
</template>
