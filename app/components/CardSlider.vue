<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  items: {
    type: Array,
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

const emit = defineEmits(['open-card'])

const currentIndex = ref(1)
const sliderEl = ref(null)

const CARD_WIDTH = 260
const GAP = 16

const touchStartX = ref(0)
const touchStartY = ref(0)
const isDragging = ref(false)

onMounted(() => {
  if (sliderEl.value && props.items.length > 1) {
    sliderEl.value.scrollLeft = CARD_WIDTH + GAP
  }
})

function onTouchStart(e) {
  touchStartX.value = e.touches[0].clientX
  touchStartY.value = e.touches[0].clientY
  isDragging.value = true
}

function onTouchEnd(e) {
  if (!isDragging.value) return
  isDragging.value = false
  const dx = e.changedTouches[0].clientX - touchStartX.value
  const dy = e.changedTouches[0].clientY - touchStartY.value
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
    if (dx < 0) goNext()
    else goPrev()
  }
}

function onScroll() {
  if (!sliderEl.value) return
  const slot = CARD_WIDTH + GAP
  const center = sliderEl.value.scrollLeft + sliderEl.value.offsetWidth / 2
  currentIndex.value = Math.max(0, Math.min(
    Math.round((center - CARD_WIDTH / 2) / slot),
    props.items.length - 1,
  ))
}

function goTo(index) {
  currentIndex.value = index
  if (!sliderEl.value) return
  const slot = CARD_WIDTH + GAP
  sliderEl.value.scrollTo({ left: index * slot, behavior: 'smooth' })
}

function goNext() {
  if (currentIndex.value < props.items.length - 1) goTo(currentIndex.value + 1)
}
function goPrev() {
  if (currentIndex.value > 0) goTo(currentIndex.value - 1)
}
</script>

<template>
  <div class="slider-wrapper">
    <div ref="sliderEl" class="slider-track" @touchstart.passive="onTouchStart" @touchend.passive="onTouchEnd"
      @scroll.passive="onScroll">
      <CardItem v-for="item in items" :key="item.id" :item="item" :color="color" :themeId="themeId"
        @open="emit('open-card', $event)" />
    </div>

    <div class="slider-dots" role="tablist" :aria-label="`Navigation ${themeId}`">
      <button v-for="(item, i) in items" :key="item.id" class="dot" :class="{ active: i === currentIndex }"
        :style="i === currentIndex ? { background: color } : {}" role="tab" :aria-selected="i === currentIndex"
        :aria-label="`Card ${i + 1} sur ${items.length}`" @click="goTo(i)" />
    </div>
  </div>
</template>
