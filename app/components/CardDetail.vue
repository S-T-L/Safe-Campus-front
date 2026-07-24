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

      <!-- Hero coloré avec titre -->
      <div class="modal-hero">
        <button class="btn-close" @click="emit('close')" aria-label="Fermer">✕</button>
        <h2 class="hero-title">{{ item.title }}</h2>
        <img :src="item.ninja" :alt="item.title" class="hero-ninja" />
      </div>

      <!-- Contenu -->
      <div class="modal-scroll">
        <p class="modal-description">{{ item.description }}</p>

        <button class="btn-resources" @click="emit('more-info')">
          Voir toutes les ressources
          <span class="btn-arrow">→</span>
        </button>
      </div>

    </div>
  </div>
</template>
