<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, nextTick } from 'vue'
import type * as Leaflet from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { sousThemeNinjas, themePresentation } from '~/data/presentation'
import type { ContactApi, SousThemeDetailApi } from '~/types/annuaire'
import IconViewfinderCircle from '~/assets/icon/viewfinder-circle.svg'
import IconArrowPath from '~/assets/icon/arrow-path.svg'

interface DisplayContact {
  ref: string
  name: string
  role: string | null
  email: string | null
  hours: string | null
  address: string | null
  website: string | null
  telephones: ContactApi['telephones']
  lat: number | null
  lng: number | null
}

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

interface LocatedContact extends Omit<DisplayContact, 'lat' | 'lng'> {
  lat: number
  lng: number
}

function isLocated(contact: DisplayContact): contact is LocatedContact {
  return contact.lat !== null && contact.lng !== null
}

definePageMeta({ layout: 'default' })

const route = useRoute()
const router = useRouter()

const apiBase = useApiBase()
const { data: response, error: fetchError } = await useFetch<{ data: SousThemeDetailApi }>(
  `${apiBase}/api/sous-themes/${route.params.slug}`,
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

const themeColor = theme.color

let L: typeof Leaflet | null = null

const locatedContacts = item.contacts.filter(isLocated)
const hasLocated = locatedContacts.length > 0

const mapContainer = ref<HTMLElement | null>(null)
let map: Leaflet.Map | null = null
let userMarker: Leaflet.Marker | null = null

const nearestContactRef = ref<string | null>(null)
const geoError = ref<string | null>(null)
const geoLoading = ref(false)
const userLocated = ref(false)
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

function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

function goBack() {
  if (window.history.state?.back) {
    router.back()
  } else {
    navigateTo('/')
  }
}

async function initMap() {
  if (map || !mapContainer.value || !hasLocated) return

  if (!L) {
    L = (await import('leaflet')).default
  }

  const leaflet = L
  const currentMap = leaflet.map(mapContainer.value, { zoomControl: true, scrollWheelZoom: false })
  map = currentMap

  leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
    maxZoom: 19,
  }).addTo(currentMap)

  locatedContacts.forEach(contact => {
    const icon = leaflet.divIcon({
      className: '',
      html: `<div style="width:16px;height:16px;background:${themeColor};border:3px solid #fff;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.35);"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    })
    leaflet.marker([contact.lat, contact.lng], { icon })
      .addTo(currentMap)
      .bindPopup(`<strong>${contact.name}</strong><br>${contact.telephones[0]?.numero ?? contact.email ?? ''}`)
  })

  fitToContacts()

  setTimeout(() => currentMap.invalidateSize(), 350)
}

function fitToContacts() {
  if (!L || !map) return

  if (locatedContacts.length > 1) {
    map.fitBounds(L.latLngBounds(locatedContacts.map(c => [c.lat, c.lng])), { padding: [32, 32] })
  } else if (locatedContacts[0]) {
    map.setView([locatedContacts[0].lat, locatedContacts[0].lng], 14)
  }
}

function locateMe() {
  geoError.value = null

  if (!navigator.geolocation) {
    geoError.value = "La géolocalisation n'est pas disponible sur cet appareil."
    return
  }

  geoLoading.value = true

  navigator.geolocation.getCurrentPosition(
    (position) => {
      geoLoading.value = false
      if (!map || !L) return

      const { latitude, longitude } = position.coords

      const firstContact = locatedContacts[0]
      if (!firstContact) return

      let nearest = firstContact
      let minDist = distanceKm(latitude, longitude, nearest.lat, nearest.lng)
      for (const contact of locatedContacts.slice(1)) {
        const dist = distanceKm(latitude, longitude, contact.lat, contact.lng)
        if (dist < minDist) { minDist = dist; nearest = contact }
      }
      nearestContactRef.value = nearest.ref
      userLocated.value = true

      if (userMarker) {
        userMarker.setLatLng([latitude, longitude])
      } else {
        const userIcon = L.divIcon({
          className: '',
          html: '<div style="width:16px;height:16px;background:#1E466B;border:3px solid #fff;border-radius:50%;box-shadow:0 0 0 6px rgba(30,70,107,0.25);"></div>',
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        })
        userMarker = L.marker([latitude, longitude], { icon: userIcon }).addTo(map).bindPopup('Votre position')
      }

      map.fitBounds(L.latLngBounds([[latitude, longitude], [nearest.lat, nearest.lng]]), { padding: [48, 48] })
    },
    (err) => {
      geoLoading.value = false
      if (err.code === err.PERMISSION_DENIED) {
        geoError.value = 'Accès à la position refusé. Autorise la géolocalisation pour voir le contact le plus proche.'
      } else if (err.code === err.TIMEOUT) {
        geoError.value = 'La localisation a pris trop de temps, réessaie.'
      } else {
        geoError.value = 'Impossible de récupérer ta position pour le moment.'
      }
    },
    { enableHighAccuracy: true, timeout: 10000 },
  )
}

function resetGeoloc() {
  geoError.value = null
  userLocated.value = false
  nearestContactRef.value = null

  if (userMarker) {
    userMarker.remove()
    userMarker = null
  }

  fitToContacts()
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

      <!-- Localisation -->
      <section v-if="hasLocated" class="cp-location">
        <div class="cp-location-head">
          <span class="cp-location-title">Où trouver de l'aide près de chez vous</span>
          <button
type="button" class="btn-locate" :class="{ 'btn-locate--active': userLocated }" :disabled="geoLoading"
            @click="userLocated ? resetGeoloc() : locateMe()">
            <IconViewfinderCircle v-if="!userLocated" />
            <IconArrowPath v-else />
            {{ geoLoading ? 'Recherche…' : (userLocated ? 'Réinitialiser' : 'Me géolocaliser') }}
          </button>
        </div>
        <div ref="mapContainer" class="cp-location-map" />
        <p v-if="geoError" class="cp-geo-error">{{ geoError }}</p>
      </section>

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
  </div>
</template>
