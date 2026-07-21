<script setup>
defineProps({
  item: {
    type: Object,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  themeId: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['open'])
</script>

<template>
  <article
    class="card-item"
    :class="themeId === 'violence' ? 'layout-top' : 'layout-left'"
    :style="{ '--theme-color': color, '--theme-color-bg': color + '18' }"
    @click="emit('open', item)"
  >
    <!-- Ninja -->
    <div class="card-ninja">
      <img :src="item.ninja" :alt="`Ninja mascotte — ${item.title}`" class="ninja-img" />
    </div>

    <!-- Contenu -->
    <div class="card-body">
      <p class="card-subtitle">{{ item.subtitle }}</p>
      <button class="card-cta" :aria-label="`En savoir plus sur ${item.title}`">
        En savoir plus &gt;
      </button>
    </div>
  </article>
</template>
