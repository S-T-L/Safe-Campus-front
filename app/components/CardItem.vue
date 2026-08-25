<script setup>
defineProps({
  item: { type: Object, required: true },
  color: { type: String, required: true },
  themeId: { type: String, required: true },
})
</script>

<template>
  <div class="card-item" :class="`card-item--${item.slug}`" :style="{ '--theme-color': color }">
    <div class="card-ninja" :class="`card-ninja--${item.slug}`">
      <img :src="item.ninja" :alt="item.title" class="ninja-img" >
    </div>
    <h3 class="card-title">{{ item.title }}</h3>
    <p class="card-desc">{{ item.hook }}</p>
    <div class="card-actions">
      <NuxtLink :to="`/contact/${themeId}/${item.slug}`" class="card-actions__btn">
        Contact
      </NuxtLink>
      <NuxtLink :to="`/ressources/${themeId}/${item.slug}`" class="card-actions__btn">
        Ressources
      </NuxtLink>
    </div>
  </div>
</template>
