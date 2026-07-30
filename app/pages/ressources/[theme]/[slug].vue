<script setup lang="ts">
import { onMounted, onUnmounted, ref, nextTick } from 'vue'
import 'leaflet/dist/leaflet.css'
import { themes } from '~/data/themes.js'

definePageMeta({ layout: 'default' })

const route = useRoute()
const router = useRouter()

const theme = themes.find(t => t.id === route.params.theme)
const item = theme?.items.find(i => i.slug === route.params.slug)

if (!theme || !item) {
  throw createError({ statusCode: 404, statusMessage: 'Ressource introuvable' })
}

useHead({ title: item.title })

let L: any = null

const featured = item.contacts[0]
const others = item.contacts.slice(1)
const locatedContacts = item.contacts.filter(c => c.lat && c.lng)
const hasLocated = locatedContacts.length > 0

const mapContainer = ref<HTMLElement | null>(null)
let map: any = null

function badgeLabel(hours: string) {
  const h = hours.toLowerCase()
  if (h.includes('urgence') || h.includes('24h')) return 'Urgences 24h/24'
  if (h.includes('rendez-vous')) return 'Sur RDV'
  return hours.split('·')[0].trim()
}

function telHref(phone: string) {
  return phone.includes('@') ? `mailto:${phone}` : `tel:${phone.replace(/\s/g, '')}`
}

async function initMap() {
  if (map || !mapContainer.value || !hasLocated) return

  if (!L) {
    L = (await import('leaflet')).default
  }

  map = L.map(mapContainer.value, { zoomControl: true, scrollWheelZoom: false })

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
    maxZoom: 19,
  }).addTo(map)

  locatedContacts.forEach(contact => {
    const dotColor = contact === featured ? '#E8314A' : theme.color
    const icon = L.divIcon({
      className: '',
      html: `<div style="width:16px;height:16px;background:${dotColor};border:3px solid #fff;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.35);"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    })
    L.marker([contact.lat, contact.lng], { icon })
      .addTo(map)
      .bindPopup(`<strong>${contact.name}</strong><br>${contact.phone}`)
  })

  if (locatedContacts.length > 1) {
    map.fitBounds(L.latLngBounds(locatedContacts.map(c => [c.lat, c.lng])), { padding: [32, 32] })
  } else {
    map.setView([locatedContacts[0].lat, locatedContacts[0].lng], 14)
  }

  setTimeout(() => map.invalidateSize(), 350)
}

function goBack() {
  if (window.history.state?.back) {
    router.back()
  } else {
    navigateTo('/')
  }
}

onMounted(() => {
  if (hasLocated) {
    nextTick(() => setTimeout(initMap, 350))
  }
})

onUnmounted(() => {
  if (map) { map.remove(); map = null }
})
</script>

<template>
  <div class="cp-page" :style="{ '--theme-color': theme.color }">

    <!-- Barre supérieure -->
    <div class="cp-topbar">
      <button class="btn-back" @click="goBack">
        <span>←</span> Retour
      </button>
    </div>

    <div class="cp-scroll">
      <!-- Intitulé -->
      <div class="cp-intro">
        <span class="cp-tag">{{ item.subtitle }}</span>
        <h1 class="cp-title">{{ item.title }}</h1>
      </div>

      <!-- Zone 1 — Contact principal -->
      <section class="cp-primary">
        <div class="cp-primary-head">
          <span class="featured-badge">{{ badgeLabel(featured.hours) }}</span>
          <h2 class="cp-primary-name">{{ featured.name }}</h2>
          <p class="cp-primary-address">
            <svg class="pin-icon" viewBox="0 0 24 24" fill="none" stroke="#E8314A" stroke-width="2">
              <path d="M12 21s-7-6.1-7-11a7 7 0 0 1 14 0c0 4.9-7 11-7 11z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            {{ featured.address }}
          </p>
        </div>

        <div class="cp-primary-call">
          <div class="cp-primary-number-block">
            <span class="cp-primary-label">Numéro direct</span>
            <span class="cp-primary-number">{{ featured.phone }}</span>
          </div>
          <a class="btn-call" :href="telHref(featured.phone)">
            <svg class="phone-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <path
                d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            Appeler
          </a>
        </div>
      </section>

      <!-- Zone 2 — Localisation (carte toujours visible) -->
      <section v-if="hasLocated" class="cp-location">
        <div class="cp-location-head">
          <span class="cp-location-title">Où nous trouver</span>
          <span class="cp-location-count">{{ locatedContacts.length }} lieu{{ locatedContacts.length > 1 ? 'x' : '' }} à Nouméa</span>
        </div>
        <div ref="mapContainer" class="cp-location-map" />
      </section>

      <!-- Zone 3 — Autres contacts -->
      <section v-if="others.length" class="cp-others">
        <p class="section-label">Autres contacts</p>
        <div class="cp-others-grid">
          <div v-for="contact in others" :key="contact.name" class="cp-other-card">
            <div class="cp-other-top">
              <p class="other-name">{{ contact.name }}</p>
              <p class="other-hours">{{ contact.hours }}</p>
            </div>
            <div class="cp-other-bottom">
              <p class="other-phone">{{ contact.phone }}</p>
              <a class="btn-call-sm" :href="telHref(contact.phone)">Appeler</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
