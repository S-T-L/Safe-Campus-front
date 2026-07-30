<script setup>
import { ref, onMounted, nextTick } from 'vue'

const props = defineProps({
  items: { type: Array, required: true },
  color: { type: String, required: true },
  themeId: { type: String, required: true },
})

const currentIndex = ref(0)
const sliderEl = ref(null)

const touchStartX = ref(0)
const touchStartY = ref(0)
const isDragging = ref(false)

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
  const containerCenter = sliderEl.value.scrollLeft + sliderEl.value.offsetWidth / 2
  const cards = sliderEl.value.querySelectorAll('.card-item')
  let closest = 0
  let minDist = Infinity
  cards.forEach((card, i) => {
    const cardCenter = card.offsetLeft + card.offsetWidth / 2
    const dist = Math.abs(cardCenter - containerCenter)
    if (dist < minDist) { minDist = dist; closest = i }
  })
  currentIndex.value = closest
}

function goTo(index, behavior = 'smooth') {
  currentIndex.value = index
  if (!sliderEl.value) return
  const cards = sliderEl.value.querySelectorAll('.card-item')
  const card = cards[index]
  if (!card) return
  const cardCenter = card.offsetLeft + card.offsetWidth / 2
  const containerCenter = sliderEl.value.offsetWidth / 2
  sliderEl.value.scrollTo({ left: cardCenter - containerCenter, behavior })
}

function goNext() {
  if (currentIndex.value < props.items.length - 1) goTo(currentIndex.value + 1)
}
function goPrev() {
  if (currentIndex.value > 0) goTo(currentIndex.value - 1)
}

onMounted(async () => {
  await nextTick()
  if (props.items.length > 1) {
    const mid = Math.floor(props.items.length / 2)
    currentIndex.value = mid
    goTo(mid, 'instant')
  }
})
</script>

<template>
  <div class="slider-wrapper">
    <div
ref="sliderEl" class="slider-track" @touchstart.passive="onTouchStart" @touchend.passive="onTouchEnd"
      @scroll.passive="onScroll">
      <!-- Espaceur gauche pour permettre le centrage de la première carte -->
      <div class="slider-ghost" aria-hidden="true" />

      <CardItem v-for="item in items" :key="item.id" :item="item" :color="color" :theme-id="themeId" />

      <!-- Espaceur droit -->
      <div class="slider-ghost" aria-hidden="true" />
    </div>

    <div class="slider-dots" role="tablist" :aria-label="`Navigation ${themeId}`">
      <button
v-for="(item, i) in items" :key="item.id" class="dot" :class="{ active: i === currentIndex }"
        :style="i === currentIndex ? { background: color } : {}" role="tab" :aria-selected="i === currentIndex"
        :aria-label="`Carte ${i + 1} sur ${items.length}`" @click="goTo(i)" />
    </div>
  </div>
</template>
