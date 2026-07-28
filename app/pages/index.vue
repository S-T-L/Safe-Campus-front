<script setup lang="ts">
import { ref } from 'vue'
import { themes } from '../data/themes.js'
import logoSf from '~/assets/images/logoSf.svg'
import universImg from '~/assets/images/univers.png'

definePageMeta({ layout: 'default' })

const menuOpen = ref(false)
</script>

<template>
  <div class="home">

    <!-- Hero + Header superposés -->
    <div class="above-fold">
      <header class="home-header">
        <nav class="header-nav">
          <template v-for="(theme, i) in themes" :key="theme.id">
            <span v-if="i > 0" class="nav-sep">•</span>
            <a class="nav-item" :href="`#theme-${theme.id}`">{{ theme.navLabel }}</a>
          </template>
        </nav>
        <button class="menu-btn" :class="{ 'menu-btn--open': menuOpen }" aria-label="Menu" @click="menuOpen = true">
          <span /><span /><span />
        </button>
      </header>

      <div class="home-hero">
        <img :src="universImg" alt="Campus UNC" class="hero-img" />
        <div class="hero-overlay" />
      </div>
    </div>

    <!-- Section intro -->
    <section class="home-intro">
      <img :src="logoSf" alt="Logo Safe Campus" class="intro-logo" />
      <p class="intro-subtitle">C'est quoi&nbsp;?</p>
      <p class="intro-body">
        Safe Campus, c'est une application pensée pour les étudiants de l'Université de Nouvelle-Calédonie.
        Elle centralise les informations, les ressources et les contacts utiles sur les conduites addictives,
        la santé mentale et les violences sur le campus.
      </p>
    </section>

    <!-- Sections thématiques -->
    <main class="home-sections">
      <ThemeSection
        v-for="(theme, i) in themes"
        :id="`theme-${theme.id}`"
        :key="theme.id"
        :theme="theme"
        :index="i + 1"
      />
    </main>

    <!-- Footer -->
    <footer class="home-footer">
      <p>© 2025 Université de Nouvelle-Calédonie</p>
    </footer>

    <!-- Menu drawer -->
    <NavDrawer v-model="menuOpen" :themes="themes" />

  </div>
</template>
