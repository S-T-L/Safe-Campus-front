<script setup lang="ts">
import type { Component } from 'vue'
import type { ThemeView } from '~/types/annuaire'
import IconLinkSlash from '~/assets/icon/link-slash.svg?component'
import IconHeart from '~/assets/icon/heart.svg?component'
import IconShieldCheck from '~/assets/icon/shield-check.svg?component'

defineProps<{
  themes: ThemeView[]
}>()

const icons: Record<string, Component> = {
  addiction: IconLinkSlash,
  mental: IconHeart,
  violence: IconShieldCheck,
}

function navigate(themeId: string) {
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
      <span class="tab-icon">
        <component :is="icons[theme.id]" />
      </span>
      <span class="tab-label">{{ theme.shortLabel }}</span>
    </button>
  </nav>
</template>
