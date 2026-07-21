<script setup lang="ts">
import { ref } from 'vue'
import { themes } from '../data/themes.js'

definePageMeta({ layout: 'default' })

const activeCard = ref(null)
const activeFiche = ref(null)

function openCard(cardData) {
  activeCard.value = cardData
}

function closeCard() {
  activeCard.value = null
}

function openFiche() {
  activeFiche.value = activeCard.value
  activeCard.value = null
}

function closeFiche() {
  activeFiche.value = null
}
</script>

<template>
  <div class="home">

    <!-- Header / Nav -->
    <header class="home-header">
      <div class="header-logo">
        <span class="logo-text">Safe Campus</span>
      </div>
      <button class="menu-btn" aria-label="Menu">
        <span /><span /><span />
      </button>
    </header>

    <!-- Hero -->
    <div class="home-hero">
      <h1 class="hero-title">Prends soin<br />de <em>toi.</em></h1>
      <p class="hero-sub">
        Infos, ressources et contacts pour les étudiants.
      </p>
    </div>

    <!-- Sections thématiques -->
    <main class="home-sections">
      <ThemeSection v-for="theme in themes" :key="theme.id" :theme="theme" @open-card="openCard" />
    </main>

    <!-- Footer -->
    <footer class="home-footer">
      <p>© 2025 Université de Nouvelle-Calédonie</p>
    </footer>

    <!-- Modale card ouverte -->
    <Teleport to="body">
      <CardDetail v-if="activeCard" :item="activeCard" :color="activeCard.themeColor" @close="closeCard"
        @more-info="openFiche" />
      <FicheReflexe v-if="activeFiche" :item="activeFiche" :color="activeFiche.themeColor" @close="closeFiche" />
    </Teleport>

  </div>
</template>
