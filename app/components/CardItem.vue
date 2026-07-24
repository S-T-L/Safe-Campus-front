<script setup>
defineProps({
  item: { type: Object, required: true },
  color: { type: String, required: true },
  themeId: { type: String, required: true },
})

const emit = defineEmits(['open'])
</script>

<template>
  <article
    class="card-item"
    :style="{ '--theme-color': color }"
    @click="emit('open', item)"
  >
    <div class="card-ninja">
      <img :src="item.ninja" :alt="item.title" class="ninja-img" />
    </div>
    <h3 class="card-title">{{ item.title }}</h3>
    <p class="card-desc">{{ item.description }}</p>
  </article>
</template>
