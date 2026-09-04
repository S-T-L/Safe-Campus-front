<script setup lang="ts">
import { ref } from 'vue'
import SideNav from '~/components/SideNav.vue'
import NavDrawer from '~/components/NavDrawer.vue'

// Menu global : present sur toutes les pages qui utilisent ce layout.
const { themes } = await useThemes()

const route = useRoute()

// Burger permanent (mobile / tablette) : accessible en toute circonstance,
// sur toutes les pages. Le rail lateral prend le relais a partir de 1200px.
const menuOpen = ref(false)
</script>

<template>
  <div class="layout">
    <SideNav :themes="themes" />

    <!-- Colonne d'actions flottante (mobile / tablette) : retour accueil
         au-dessus, burger en dessous. Le lien accueil est masque sur la
         page d'accueil (le header y porte deja le logo) ; toute la colonne
         disparait a partir de 1200px (le rail lateral prend le relais). -->
    <div class="nav-actions">
      <NuxtLink
        v-if="route.path !== '/'"
        to="/"
        class="nav-home"
        aria-label="Retour à l'accueil"
      >
        <img src="/assets/logoNinjaHead.png" alt="" >
      </NuxtLink>

      <button
        type="button"
        class="nav-fab"
        :class="{ 'nav-fab--open': menuOpen }"
        aria-label="Ouvrir le menu"
        @click="menuOpen = true"
      >
        <span /><span /><span />
      </button>
    </div>

    <NavDrawer v-model="menuOpen" :themes="themes" />

    <slot />
  </div>
</template>
