<script setup>
defineProps({
  themes: { type: Array, required: true },
})

const icons = {
  addiction: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><line x1="8.5" y1="8.5" x2="15.5" y2="15.5"/></svg>`,
  mental:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
  violence:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
}

function navigate(themeId) {
  document.getElementById(`theme-${themeId}`)?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <nav class="bottom-tab-bar">
    <button
      v-for="theme in themes"
      :key="theme.id"
      class="tab-btn"
      :style="{ '--c': theme.color }"
      @click="navigate(theme.id)"
    >
      <span class="tab-icon" v-html="icons[theme.id]" />
      <span class="tab-label">{{ theme.shortLabel }}</span>
    </button>
  </nav>
</template>
