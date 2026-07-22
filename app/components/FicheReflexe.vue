<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
})

const props = defineProps({
  item: { type: Object, required: true },
  color: { type: String, required: true },
})

const emit = defineEmits(['close'])

const mapContainer = ref(null)
const geoStatus = ref('idle')
const nearestContact = ref(null)

let map = null
let userMarker = null
const localMarkers = []

const localContacts = computed(() =>
  props.item.contacts.filter(c => c.lat && c.lng)
)

function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function initMap() {
  if (!mapContainer.value || localContacts.value.length === 0) return

  const first = localContacts.value[0]
  map = L.map(mapContainer.value, { zoomControl: true, scrollWheelZoom: false }).setView(
    [first.lat, first.lng], 14
  )

  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '© Esri, Maxar, Earthstar Geographics',
    maxZoom: 19,
  }).addTo(map)

  localContacts.value.forEach(contact => {
    const marker = L.marker([contact.lat, contact.lng])
      .addTo(map)
      .bindPopup(`<strong>${contact.name}</strong><br>${contact.phone}`)
    localMarkers.push({ marker, contact })
  })

  if (localContacts.value.length > 1) {
    const bounds = L.latLngBounds(localContacts.value.map(c => [c.lat, c.lng]))
    map.fitBounds(bounds, { padding: [32, 32] })
  }
}

function geolocate() {
  if (!navigator.geolocation) { geoStatus.value = 'error'; return }
  geoStatus.value = 'loading'
  navigator.geolocation.getCurrentPosition(
    position => {
      const { latitude, longitude } = position.coords

      const userIcon = L.divIcon({
        className: '',
        html: `<div style="
          width:16px;height:16px;
          background:${props.color};
          border:3px solid #fff;
          border-radius:50%;
          box-shadow:0 2px 8px rgba(0,0,0,0.35);
        "></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      })

      if (userMarker) userMarker.remove()
      userMarker = L.marker([latitude, longitude], { icon: userIcon })
        .addTo(map)
        .bindPopup('Vous êtes ici')
        .openPopup()

      let minDist = Infinity
      let nearest = null
      localContacts.value.forEach(contact => {
        const d = haversine(latitude, longitude, contact.lat, contact.lng)
        if (d < minDist) { minDist = d; nearest = contact }
      })
      nearestContact.value = nearest

      localMarkers.forEach(({ marker, contact }) => {
        if (contact === nearest) {
          const nearIcon = L.divIcon({
            className: '',
            html: `<div style="
              width:22px;height:22px;
              background:${props.color};
              border:3px solid #fff;
              border-radius:50%;
              box-shadow:0 3px 12px rgba(0,0,0,0.4);
            "></div>`,
            iconSize: [22, 22],
            iconAnchor: [11, 11],
          })
          marker.setIcon(nearIcon)
          marker.openPopup()
        }
      })

      map.fitBounds(
        L.latLngBounds([[latitude, longitude], [nearest.lat, nearest.lng]]),
        { padding: [48, 48] }
      )
      geoStatus.value = 'done'
    },
    () => { geoStatus.value = 'error' },
    { timeout: 10000 }
  )
}

function onKeyDown(e) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => {
  document.addEventListener('keydown', onKeyDown)
  document.body.style.overflow = 'hidden'
  setTimeout(initMap, 100)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeyDown)
  document.body.style.overflow = ''
  if (map) { map.remove(); map = null }
})
</script>

<template>
  <div class="fiche-overlay" role="dialog" aria-modal="true" :aria-label="`Fiche — ${item.title}`">
    <div class="fiche-panel" :style="{ '--theme-color': color }">

      <!-- Header -->
      <header class="fiche-header">
        <button class="btn-back" @click="emit('close')" aria-label="Retour">
          <span class="back-icon">←</span>
          <span>Retour</span>
        </button>
        <div class="header-title-wrap">
          <span class="header-tag">{{ item.subtitle }}</span>
          <h2 class="header-title">{{ item.title }}</h2>
        </div>
      </header>

      <!-- Contenu scrollable -->
      <div class="fiche-scroll">

        <!-- Carte -->
        <section v-if="localContacts.length > 0" class="map-card">
          <div class="map-card-header">
            <div class="map-card-title-group">
              <span class="map-card-icon" :style="{ background: color + '1a', color }">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                  <circle cx="12" cy="9" r="2.5"/>
                </svg>
              </span>
              <div>
                <p class="map-card-label">Localisation</p>
                <p class="map-card-sub">{{ localContacts.length }} lieu{{ localContacts.length > 1 ? 'x' : '' }} à proximité</p>
              </div>
            </div>
            <button
              class="btn-geo-pill"
              :class="{ active: geoStatus === 'done', loading: geoStatus === 'loading', error: geoStatus === 'error' }"
              :style="geoStatus === 'done' ? { background: color, borderColor: color } : {}"
              :disabled="geoStatus === 'loading' || geoStatus === 'done'"
              @click="geolocate"
              :aria-label="geoStatus === 'done' ? 'Contact le plus proche affiché' : 'Me localiser'"
            >
              <span class="geo-icon">
                <svg v-if="geoStatus === 'idle' || geoStatus === 'error'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
                </svg>
                <svg v-else-if="geoStatus === 'loading'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="spin">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </span>
              <span class="geo-label">
                <span v-if="geoStatus === 'idle'">Me localiser</span>
                <span v-else-if="geoStatus === 'loading'">Recherche…</span>
                <span v-else-if="geoStatus === 'done'">Localisé</span>
                <span v-else>Réessayer</span>
              </span>
            </button>
          </div>
          <div class="map-wrapper">
            <div ref="mapContainer" class="map-container" />
            <div v-if="nearestContact" class="map-nearest-chip" :style="{ background: color }">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
              {{ nearestContact.name }}
            </div>
          </div>
        </section>

        <!-- Contacts -->
        <section class="section">
          <h3 class="section-label">Contacts & ressources</h3>
          <div class="contacts-list">
            <div
              v-for="contact in item.contacts"
              :key="contact.name"
              class="contact-card"
              :class="{ nearest: nearestContact === contact }"
            >
              <div v-if="nearestContact === contact" class="contact-top">
                <span class="nearest-badge" :style="{ color }">✦ Le plus proche</span>
              </div>
              <p class="contact-name">{{ contact.name }}</p>
              <a
                :href="contact.phone.includes('@') ? `mailto:${contact.phone}` : `tel:${contact.phone.replace(/\s/g, '')}`"
                class="contact-phone"
                :style="{ color }"
              >
                {{ contact.phone.includes('@') ? '✉ ' : '📞 ' }}{{ contact.phone }}
              </a>
              <p class="contact-hours">{{ contact.hours }}</p>
              <p v-if="contact.address" class="contact-address">📍 {{ contact.address }}</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  </div>
</template>
