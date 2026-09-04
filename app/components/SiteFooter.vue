<script setup lang="ts">
import logoSf from '~/assets/images/logoSf.svg?url'

// Requete /api/themes partagee (cle 'themes') avec le layout et la page d'accueil.
const { themes } = await useThemes()
</script>

<template>
  <footer class="home-footer">
    <div class="home-footer__content">
      <div class="home-footer__brand">
        <img :src="logoSf" alt="Safe Campus" class="home-footer__logo" >
        <span class="home-footer__sep" aria-hidden="true" />
      </div>

      <nav class="home-footer__links">
        <a href="/" class="home-footer__link">Accueil</a>
        <a v-for="theme in themes" :key="theme.id" :href="`/#theme-${theme.id}`" class="home-footer__link">
          {{ theme.shortLabel }}
        </a>
        <a href="/#about" class="home-footer__link">À propos</a>
      </nav>

      <span class="home-footer__sep" aria-hidden="true" />

      <p class="home-footer__copyright">© 2025 Université de Nouvelle-Calédonie</p>
    </div>
  </footer>
</template>
