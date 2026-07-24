<script setup>
const props = defineProps({
  theme: { type: Object, required: true },
  index: { type: Number, required: true },
})

const emit = defineEmits(['open-card'])

const num = String(props.index).padStart(2, '0')
</script>

<template>
  <section class="theme-section">
    <div class="section-header">
      <span class="section-num" :style="{ color: theme.color }">{{ num }}</span>
      <h2 class="section-title">{{ theme.shortLabel }}</h2>
    </div>

    <CardSlider :items="theme.items" :color="theme.color" :themeId="theme.id"
      @open-card="emit('open-card', { ...$event, themeColor: theme.color })" />
  </section>
</template>
