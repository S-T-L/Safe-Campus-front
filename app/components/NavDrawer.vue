<script setup>
import { ref } from 'vue'

defineProps({
  themes: { type: Array, default: () => [] },
  modelValue: Boolean,
})

const emit = defineEmits(['update:modelValue'])

const activeTheme = ref(null)
const activeItem = ref(null)

function close() {
  emit('update:modelValue', false)
  setTimeout(() => { activeTheme.value = null; activeItem.value = null }, 320)
}

function goToTheme(theme) {
  activeTheme.value = theme
}

function goToItem(item) {
  activeItem.value = item
}

function goBack() {
  if (activeItem.value) {
    activeItem.value = null
  } else {
    activeTheme.value = null
  }
}

function scrollToTheme(themeId) {
  document.getElementById(`theme-${themeId}`)?.scrollIntoView({ behavior: 'smooth' })
  close()
}

function openPage(path) {
  navigateTo(`/${path}/${activeTheme.value.id}/${activeItem.value.slug}`)
  close()
}

function scrollToIntro() {
  document.querySelector('.home-intro')?.scrollIntoView({ behavior: 'smooth' })
  close()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="modelValue" class="drawer-backdrop" @click="close" />
    </Transition>

    <Transition name="drawer-slide">
      <div v-if="modelValue" class="drawer" role="dialog" aria-modal="true" aria-label="Menu de navigation">

        <!-- En-tête du drawer -->
        <div class="drawer-head">
          <Transition name="head-swap" mode="out-in">
            <button v-if="activeTheme" key="back" class="drawer-back" @click="goBack">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Retour
            </button>
            <span v-else key="title" class="drawer-title">MENU</span>
          </Transition>

          <button class="drawer-close" aria-label="Fermer le menu" @click="close">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <!-- Corps du drawer -->
        <div class="drawer-body">
          <Transition name="level" mode="out-in">

            <!-- Niveau 1 : liste des thèmes -->
            <nav v-if="!activeTheme" key="themes">
              <p class="drawer-section-label">Thématiques</p>
              <ul class="drawer-list">
                <li
                  v-for="theme in themes"
                  :key="theme.id"
                  class="drawer-item"
                  @click="goToTheme(theme)"
                >
                  <span class="item-dot" :style="{ background: theme.color }" />
                  <span class="item-label">{{ theme.label }}</span>
                  <span class="item-count">{{ theme.items.length }}</span>
                  <svg class="item-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </li>
              </ul>

              <div class="drawer-divider" />

              <p class="drawer-section-label">Informations</p>
              <ul class="drawer-list">
                <li class="drawer-item drawer-item--secondary" @click="scrollToIntro">
                  <span class="item-label">À propos de Safe Campus</span>
                  <svg class="item-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </li>
              </ul>
            </nav>

            <!-- Niveau 2 : sous-thèmes -->
            <nav v-else-if="!activeItem" key="items">
              <div class="sublevel-head" :style="{ '--theme-c': activeTheme.color }">
                <span class="sublevel-label">{{ activeTheme.label }}</span>
              </div>

              <ul class="drawer-list">
                <li
                  v-for="item in activeTheme.items"
                  :key="item.id"
                  class="drawer-item drawer-item--sub"
                  @click="goToItem(item)"
                >
                  <div class="sub-item-content">
                    <span class="item-label">{{ item.title }}</span>
                    <span class="item-subtitle">{{ item.subtitle }}</span>
                  </div>
                  <svg class="item-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </li>
              </ul>

              <button class="sublevel-all-btn" @click="scrollToTheme(activeTheme.id)">
                Voir toute la section
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </nav>

            <!-- Niveau 3 : Contact ou Ressources -->
            <nav v-else key="pages">
              <div class="sublevel-head" :style="{ '--theme-c': activeTheme.color }">
                <span class="sublevel-label">{{ activeItem.title }}</span>
              </div>

              <ul class="drawer-list">
                <li class="drawer-item drawer-item--sub" @click="openPage('contact')">
                  <span class="item-label">Contact</span>
                  <svg class="item-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </li>
                <li class="drawer-item drawer-item--sub" @click="openPage('ressources')">
                  <span class="item-label">Ressources</span>
                  <svg class="item-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </li>
              </ul>
            </nav>

          </Transition>
        </div>

        <!-- Pied de page -->
        <div class="drawer-footer">
          <span>Safe Campus · UNC 2025</span>
        </div>

      </div>
    </Transition>
  </Teleport>
</template>
