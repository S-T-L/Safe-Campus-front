<script setup lang="ts">
import { computed, ref } from 'vue'
import { sousThemeNinjas, themePresentation } from '../data/presentation'
import logoSf from '~/assets/images/logoSf.svg?url'
import universImg from '~/assets/images/univers.png'
import type { ThemeApi, ThemeView } from '~/types/annuaire'

definePageMeta({ layout: 'default' })

const menuOpen = ref(false)

const apiBase = useApiBase()
const { data: response } = await useFetch<{ data: ThemeApi[] }>(`${apiBase}/api/themes`)

const themes = computed<ThemeView[]>(() => (response.value?.data ?? []).map(theme => ({
  id: theme.ref,
  label: theme.libelle,
  shortLabel: theme.libelle_court,
  color: themePresentation[theme.ref]?.color ?? '#4260e6',
  items: theme.sous_themes.map((sousTheme, index) => ({
    id: index + 1,
    slug: sousTheme.ref,
    title: sousTheme.libelle,
    hook: sousTheme.resume,
    ninja: sousThemeNinjas[sousTheme.ref],
    subtitle: `${themePresentation[theme.ref]?.prefixe ?? ''} N°${index + 1}`,
  })),
})))
</script>

<template>
  <div class="home">

    <!-- Header + recherche + hero -->
    <div class="above-fold">
      <header class="home-header">
        <div class="home-brand">
          <img :src="logoSf" alt="Safe Campus" class="header-logo" >

          <span class="home-brand__divider" aria-hidden="true" />

          <nav class="home-nav" aria-label="Navigation principale">
            <a v-for="theme in themes" :key="theme.id" :href="`#theme-${theme.id}`" class="home-nav__link">
              {{ theme.shortLabel }}
            </a>
            <a href="#about" class="home-nav__link">À propos</a>
          </nav>
        </div>

        <SearchBar class="home-search" :themes="themes" />

        <button class="menu-btn" :class="{ 'menu-btn--open': menuOpen }" aria-label="Menu" @click="menuOpen = true">
          <span /><span /><span />
        </button>
      </header>

      <div class="home-hero">
        <img :src="universImg" alt="Campus UNC" class="hero-img" >
        <div class="hero-overlay" />
      </div>
    </div>

    <!-- Section intro -->
    <section id="about" class="home-intro">
      <img :src="logoSf" alt="Logo Safe Campus" class="intro-logo" >
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
        v-for="theme in themes"
        :id="`theme-${theme.id}`"
        :key="theme.id"
        :theme="theme"
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
