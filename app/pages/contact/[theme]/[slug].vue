<script setup lang="ts">
import { computed, ref } from 'vue'
import { sousThemeNinjas, themePresentation } from '~/data/presentation'
import type { ContactApi, DisplayContact, LocatedContact, SousThemeDetailApi } from '~/types/annuaire'

function isWebsiteOnly(contact: ContactApi) {
  const hasOtherInfo = contact.telephones.length > 0
    || !!contact.mail?.trim()
    || !!contact.horaires?.trim()
    || !!contact.localisation?.trim()
  return !!contact.site_web?.trim() && !hasOtherInfo
}

function isTerritoryWide(contact: { address: string | null }) {
  return !!contact.address?.toLowerCase().includes('tout le territoire')
}

function isLocated(contact: DisplayContact): contact is LocatedContact {
  return contact.lat !== null && contact.lng !== null
}

definePageMeta({ layout: 'default' })

const route = useRoute()
const router = useRouter()

const apiBase = useApiBase()
// Cle explicite et stable : useApiBase() renvoie une URL differente au SSR
// (sc_back) et au client (localhost), donc la cle auto-generee par useFetch
// differerait entre les deux -> le payload SSR ne serait pas reutilise a
// l'hydratation, provoquant un refetch client et un mismatch d'hydratation.
const { data: response, error: fetchError } = await useFetch<{ data: SousThemeDetailApi }>(
  `${apiBase}/api/sous-themes/${route.params.slug}`,
  { key: `sous-theme:${route.params.slug}` },
)

if (fetchError.value || !response.value?.data) {
  throw createError({ statusCode: 404, statusMessage: 'Ressource introuvable' })
}

const sousTheme = response.value.data

const theme = {
  color: themePresentation[sousTheme.theme.ref]?.color ?? '#4260e6',
  shortLabel: sousTheme.theme.libelle_court,
}

const item = {
  title: sousTheme.libelle,
  description: sousTheme.article,
  ninja: sousThemeNinjas[sousTheme.ref],
  contacts: sousTheme.contacts.filter(contact => !isWebsiteOnly(contact)).map(contact => ({
    ref: contact.ref,
    name: contact.prenom ? `${contact.prenom} ${contact.nom}` : contact.nom,
    role: contact.remarques,
    email: contact.mail,
    hours: contact.horaires,
    address: contact.localisation,
    website: contact.site_web,
    telephones: contact.telephones,
    lat: contact.latitude,
    lng: contact.longitude,
  })).sort((a, b) => Number(isTerritoryWide(a)) - Number(isTerritoryWide(b))),
}

useHead({ title: item.title })

const locatedContacts = item.contacts.filter(isLocated)
const hasLocated = locatedContacts.length > 0

const nearestContactRef = ref<string | null>(null)
const expandedContactRef = ref<string | null>(null)

function toggleExpandedContact(ref: string) {
  expandedContactRef.value = expandedContactRef.value === ref ? null : ref
}

const sortedContacts = computed(() => {
  if (!nearestContactRef.value) return item.contacts
  const nearest = item.contacts.find(c => c.ref === nearestContactRef.value)
  if (!nearest) return item.contacts
  return [nearest, ...item.contacts.filter(c => c.ref !== nearestContactRef.value)]
})

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
      <p class="cp-description">{{ item.description }}</p>
      <div class="cp-hero-actions">
        <button type="button" class="btn-story" disabled title="Bientôt disponible">
          Suivre l'histoire
        </button>
      </div>
    </section>

    <div class="cp-content">

      <!-- Localisation : carte navigateur uniquement, hors du rendu serveur -->
      <ClientOnly v-if="hasLocated">
        <ContactMap
          v-model:nearest="nearestContactRef"
          :contacts="locatedContacts"
          :color="theme.color"
        />
        <template #fallback>
          <section class="cp-location">
            <div class="cp-location-map" />
          </section>
        </template>
      </ClientOnly>

      <!-- Contacts -->
      <section class="cp-contacts">
        <p class="section-label">Contact</p>
        <div class="cp-contacts-grid">
          <ContactCard
v-for="contact in sortedContacts" :key="contact.ref" :contact="contact" :color="theme.color"
            :is-nearest="contact.ref === nearestContactRef" :expanded="contact.ref === expandedContactRef"
            @toggle="toggleExpandedContact" />
        </div>
      </section>

    </div>

    <SiteFooter />
  </div>
</template>
