<script setup>
defineProps({
  item: { type: Object, required: true },
  color: { type: String, required: true },
  themeId: { type: String, required: true },
})
</script>

<template>
  <NuxtLink :to="`/ressources/${themeId}/${item.id}`" class="card-item" :style="{ '--theme-color': color }">
    <div class="card-ninja">
      <img :src="item.ninja" :alt="item.title" class="ninja-img" />
    </div>
    <h3 class="card-title">{{ item.title }}</h3>
    <p class="card-desc">{{ item.description }}</p>
    <span class="card-more-btn">
      En savoir plus
      <span class="btn-arrow">→</span>
    </span>
  </NuxtLink>
</template>
