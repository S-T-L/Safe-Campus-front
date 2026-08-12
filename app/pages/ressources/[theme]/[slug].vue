<script setup lang="ts">
import { themes } from '~/data/themes.js'

definePageMeta({ layout: 'default' })

const route = useRoute()
const router = useRouter()

const theme = themes.find(t => t.id === route.params.theme)
const item = theme?.items.find(i => i.slug === route.params.slug)

if (!theme || !item || !item.resources) {
  throw createError({ statusCode: 404, statusMessage: 'Ressource introuvable' })
}

useHead({ title: `${item.title} — Ressources` })

function goBack() {
  if (window.history.state?.back) {
    router.back()
  } else {
    navigateTo('/')
  }
}
</script>

<template>
  <div class="cp-page" :style="{ '--theme-color': theme.color }">

    <!-- Barre supérieure -->
    <div class="cp-topbar">
      <button class="btn-back" @click="goBack">
        <span>←</span> Retour
      </button>
    </div>

    <!-- Hero -->
    <section class="cp-hero">
      <div class="cp-hero-ninja-wrap">
        <img :src="item.ninja" :alt="item.title" class="cp-hero-ninja" >
      </div>
      <span class="cp-tag">{{ theme.shortLabel }}</span>
      <h1 class="cp-title">{{ item.title }}</h1>
      <p class="cp-description">{{ item.resources.intro }}</p>
    </section>

    <div class="cp-content">

      <!-- Fiches réflectives -->
      <section class="rp-documents">
        <p class="section-label">Fiches réflectives</p>
        <div class="rp-documents-grid">
          <div v-for="doc in item.resources.documents" :key="doc.title" class="rp-document-card">
            <div class="rp-document-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
              </svg>
            </div>
            <div class="rp-document-body">
              <p class="rp-document-title">{{ doc.title }}</p>
              <p class="rp-document-desc">{{ doc.description }}</p>
            </div>
            <button type="button" class="btn-download" disabled title="Bientôt disponible">
              Télécharger
            </button>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>
