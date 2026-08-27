<script setup lang="ts">
import { computed } from 'vue'
import logoSf from '~/assets/images/logoSf.svg?url'
import type { ThemeApi } from '~/types/annuaire'

const apiBase = useApiBase()
const { data: response } = await useFetch<{ data: ThemeApi[] }>(`${apiBase}/api/themes`)

const themes = computed(() => response.value?.data ?? [])
</script>

<template>
  <footer class="home-footer">
    <div class="home-footer__bar" aria-hidden="true" />

    <div class="home-footer__content">
      <div class="home-footer__row">
        <img :src="logoSf" alt="Safe Campus" class="home-footer__logo" >

        <span class="home-footer__sep" aria-hidden="true" />

        <a href="/" class="home-footer__link">Accueil</a>
        <a v-for="theme in themes" :key="theme.ref" :href="`/#theme-${theme.ref}`" class="home-footer__link">
          {{ theme.libelle_court }}
        </a>
        <a href="/#about" class="home-footer__link">À propos</a>
      </div>

      <p class="home-footer__copyright">© 2025 Université de Nouvelle-Calédonie</p>
    </div>
  </footer>
</template>
