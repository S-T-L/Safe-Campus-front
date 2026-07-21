<script setup>
defineProps({
  theme: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['open-card'])
</script>

<template>
  <section class="theme-section">
    <!-- Titre de section -->
    <div class="section-header">
      <div class="section-pill" :style="{ background: theme.color + '18', color: theme.color }">
        <span class="section-dot" :style="{ background: theme.color }" />
        {{ theme.label }}
      </div>
    </div>

    <!-- Slider de cards -->
    <CardSlider :items="theme.items" :color="theme.color" :themeId="theme.id"
      @open-card="emit('open-card', { ...$event, themeColor: theme.color })" />
  </section>
</template>
