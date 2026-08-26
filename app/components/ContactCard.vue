<script setup>
import { ref } from 'vue'

const props = defineProps({
  contact: { type: Object, required: true },
  color: { type: String, required: true },
  isNearest: { type: Boolean, default: false },
  expanded: { type: Boolean, default: false },
})

const emit = defineEmits(['toggle'])

const copiedField = ref(null)

function initials(name) {
  const words = name.split(/[\s—-]+/).filter(w => /^[A-Za-zÀ-ÿ]/.test(w))
  return words.slice(0, 2).map(w => w[0].toUpperCase()).join('')
}

function toggleExpanded() {
  emit('toggle', props.contact.ref)
}

function telephoneHref(telephone) {
  const numero = telephone.numero.replace(/\s/g, '')
  return telephone.type === 'sms' ? `sms:${numero}` : `tel:${numero}`
}

function websiteHref(url) {
  const trimmed = url.trim()
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

function websiteLabel(url) {
  return websiteHref(url).replace(/^https?:\/\//i, '').replace(/\/$/, '')
}

async function copy(text, field) {
  await navigator.clipboard.writeText(text)
  copiedField.value = field
  setTimeout(() => {
    if (copiedField.value === field) copiedField.value = null
  }, 1500)
}
</script>

<template>
  <div
    class="contact-card" :class="{ 'contact-card--nearest': isNearest, 'contact-card--expanded': expanded }"
    :style="{ '--theme-color': color }">
    <span v-if="isNearest" class="contact-card__nearest-badge">Le plus proche</span>

    <div
      class="contact-card__row" role="button" tabindex="0" :aria-expanded="expanded"
      @click="toggleExpanded" @keydown.enter="toggleExpanded" @keydown.space.prevent="toggleExpanded">
      <div class="contact-card__avatar-init" aria-hidden="true">{{ initials(contact.name) }}</div>

      <div class="contact-card__text">
        <p class="contact-card__name">{{ contact.name }}</p>
      </div>

      <div class="contact-card__icon-actions">
        <a
          v-if="contact.telephones?.[0]" class="contact-card__icon-btn contact-card__icon-btn--phone"
          :href="telephoneHref(contact.telephones[0])" :aria-label="`Appeler ${contact.name}`" @click.stop>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path
              stroke-linecap="round" stroke-linejoin="round"
              d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
          </svg>
        </a>
        <a
          v-if="contact.email" class="contact-card__icon-btn contact-card__icon-btn--email"
          :href="`mailto:${contact.email}`" :aria-label="`Envoyer un email à ${contact.name}`" @click.stop>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path
              stroke-linecap="round" stroke-linejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
          </svg>
        </a>
      </div>

      <svg
class="contact-card__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
        aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
      </svg>
    </div>

    <Transition name="cc-fade">
      <div v-if="expanded" class="contact-card__detail">
        <p v-if="contact.role" class="contact-card__detail-role">{{ contact.role }}</p>

        <p v-if="contact.hours" class="contact-card__detail-info">
          <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          {{ contact.hours }}
        </p>

        <p v-if="contact.address" class="contact-card__detail-info">
          <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path
              stroke-linecap="round" stroke-linejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
          {{ contact.address }}
        </p>

        <a
          v-if="contact.website" class="contact-card__detail-info contact-card__detail-info--link"
          :href="websiteHref(contact.website)" target="_blank" rel="noopener noreferrer">
          <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path
              stroke-linecap="round" stroke-linejoin="round"
              d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
          </svg>
          <span class="contact-card__detail-info-text">{{ websiteLabel(contact.website) }}</span>
        </a>

        <div
v-if="contact.telephones.length" class="contact-card__phones"
          :class="{ 'contact-card__phones--grid': contact.telephones.length > 2 }">
          <div
v-for="telephone in contact.telephones" :key="telephone.numero"
            class="contact-card__detail-row">
            <span class="contact-card__detail-value-wrap">
              <svg v-if="telephone.type === 'mobile'" class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path
                  stroke-linecap="round" stroke-linejoin="round"
                  d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
              </svg>
              <svg v-else-if="telephone.type === 'sms'" class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path
                  stroke-linecap="round" stroke-linejoin="round"
                  d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
              </svg>
              <svg v-else class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path
                  stroke-linecap="round" stroke-linejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
              </svg>
              <span class="contact-card__detail-value">
                {{ telephone.numero }}
                <span v-if="telephone.libelle" class="contact-card__toll-free">{{ telephone.libelle }}</span>
                <span v-if="telephone.numero_vert" class="contact-card__toll-free" title="Numéro vert — appel gratuit">Numéro vert</span>
              </span>
            </span>
            <button
type="button" class="contact-card__copy-btn"
              :class="{ 'contact-card__copy-btn--copied': copiedField === telephone.numero }"
              @click.stop="copy(telephone.numero, telephone.numero)">
              {{ copiedField === telephone.numero ? 'Copié' : 'Copier' }}
            </button>
          </div>
        </div>

        <div v-if="contact.email" class="contact-card__detail-row">
          <span class="contact-card__detail-value-wrap">
            <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path
                stroke-linecap="round" stroke-linejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
            <span class="contact-card__detail-value">{{ contact.email }}</span>
          </span>
          <button
type="button" class="contact-card__copy-btn" :class="{ 'contact-card__copy-btn--copied': copiedField === 'email' }"
            @click.stop="copy(contact.email, 'email')">
            {{ copiedField === 'email' ? 'Copié' : 'Copier' }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>
