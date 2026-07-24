<script setup>
import { onMounted, onUnmounted, ref, nextTick } from 'vue'
import 'leaflet/dist/leaflet.css'

let L = null

const props = defineProps({
  item: { type: Object, required: true },
  color: { type: String, required: true },
})

const emit = defineEmits(['close'])

const featured = props.item.contacts[0]
const others = props.item.contacts.slice(1)

const mapOpen = ref(false)
const mapContainer = ref(null)
let map = null

function badgeLabel(hours) {
  const h = hours.toLowerCase()
  if (h.includes('urgence') || h.includes('24h')) return 'Urgences 24h/24'
  if (h.includes('rendez-vous')) return 'Sur RDV'
  return hours.split('·')[0].trim()
}

function telHref(phone) {
  return phone.includes('@') ? `mailto:${phone}` : `tel:${phone.replace(/\s/g, '')}`
}

async function initMap() {
  if (map || !mapContainer.value) return
  const located = props.item.contacts.filter(c => c.lat && c.lng)
  if (located.length === 0) return

  if (!L) {
    L = (await import('leaflet')).default
  }

  map = L.map(mapContainer.value, { zoomControl: true, scrollWheelZoom: false })

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
    maxZoom: 19,
  }).addTo(map)

  located.forEach(contact => {
    const dotColor = contact === featured ? '#E8314A' : '#4260E6'
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

  if (located.length > 1) {
    map.fitBounds(L.latLngBounds(located.map(c => [c.lat, c.lng])), { padding: [32, 32] })
  } else {
    map.setView([located[0].lat, located[0].lng], 14)
  }

  setTimeout(() => map.invalidateSize(), 320)
}

function toggleMap() {
  mapOpen.value = !mapOpen.value
  if (mapOpen.value) {
    nextTick(() => setTimeout(initMap, 50))
  }
}

function onKeyDown(e) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => {
  document.addEventListener('keydown', onKeyDown)
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeyDown)
  document.body.style.overflow = ''
  if (map) { map.remove(); map = null }
})
</script>

<template>
  <div class="cp-overlay" role="dialog" aria-modal="true" :aria-label="`Contacts — ${item.title}`">
    <div class="cp-page">

      <!-- Zone 1 — Header dégradé -->
      <header class="cp-header">
        <button class="btn-back" @click="emit('close')">
          <span>←</span> Retour
        </button>
        <p class="cp-subtitle">{{ item.subtitle }}</p>
        <h1 class="cp-title">{{ item.title.toUpperCase() }}</h1>
      </header>

      <div class="cp-scroll">
        <!-- Zone 2 — Carte contact principal -->
        <div class="featured-card">
          <div class="featured-bar" />
          <div class="featured-content">
            <span class="featured-badge">{{ badgeLabel(featured.hours) }}</span>
            <h2 class="featured-title">{{ featured.name }}</h2>
            <p class="featured-address">
              <svg class="pin-icon" viewBox="0 0 24 24" fill="none" stroke="#E8314A" stroke-width="2">
                <path d="M12 21s-7-6.1-7-11a7 7 0 0 1 14 0c0 4.9-7 11-7 11z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              {{ featured.address }}
            </p>
            <p class="featured-label">Numéro direct</p>
            <p class="featured-number">{{ featured.phone }}</p>
            <a class="btn-call" :href="telHref(featured.phone)">
              <svg class="phone-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <path
                  d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              Appeler maintenant
            </a>
          </div>
        </div>

        <!-- Zone 3 — Autres contacts -->
        <section v-if="others.length" class="others-section">
          <p class="section-label">Autres contacts</p>
          <div class="others-list">
            <div v-for="contact in others" :key="contact.name" class="other-item">
              <div class="other-info">
                <p class="other-name">{{ contact.name }}</p>
                <p class="other-phone">{{ contact.phone }}</p>
                <p class="other-hours">{{ contact.hours }}</p>
              </div>
              <a class="btn-call-sm" :href="telHref(contact.phone)">Appeler</a>
            </div>
          </div>
        </section>

        <!-- Zone 4 — Accordéon carte -->
        <section class="map-accordion">
          <button class="map-header" @click="toggleMap" :aria-expanded="mapOpen">
            <div class="map-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="#4260E6" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round">
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                <line x1="8" y1="2" x2="8" y2="18" />
                <line x1="16" y1="6" x2="16" y2="22" />
              </svg>
            </div>
            <div class="map-text">
              <p class="map-title">Voir sur la carte</p>
              <p class="map-subtitle">{{ item.contacts.length }} lieux à Nouméa</p>
            </div>
            <span class="chevron" :class="{ open: mapOpen }">⌄</span>
          </button>
          <div class="map-collapse" :class="{ open: mapOpen }">
            <div ref="mapContainer" class="map-container" />
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
