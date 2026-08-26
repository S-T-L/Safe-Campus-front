<script setup lang="ts">
import type { ThemeView } from '~/types/annuaire'
import IconLinkSlash from '~/assets/icon/link-slash.svg'
import IconHeart from '~/assets/icon/heart.svg'
import IconShieldCheck from '~/assets/icon/shield-check.svg'

defineProps<{
  themes: ThemeView[]
}>()

const icons: Record<string, typeof IconLinkSlash> = {
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
