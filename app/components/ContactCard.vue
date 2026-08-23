<script setup>
import { ref } from 'vue'

defineProps({
  contact: { type: Object, required: true },
  color: { type: String, required: true },
  isNearest: { type: Boolean, default: false },
})

const expanded = ref(false)
const copiedField = ref(null)

function initials(name) {
  const words = name.split(/[\s—-]+/).filter(w => /^[A-Za-zÀ-ÿ]/.test(w))
  return words.slice(0, 2).map(w => w[0].toUpperCase()).join('')
}

function toggleExpanded() {
  expanded.value = !expanded.value
}

function telephoneHref(telephone) {
  const numero = telephone.numero.replace(/\s/g, '')
  return telephone.type === 'sms' ? `sms:${numero}` : `tel:${numero}`
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
        <p class="contact-card__meta">{{ contact.role }}</p>
      </div>

      <div class="contact-card__icon-actions">
        <a
          v-if="contact.telephones?.[0]" class="contact-card__icon-btn contact-card__icon-btn--phone"
          :href="telephoneHref(contact.telephones[0])" :aria-label="`Appeler ${contact.name}`" @click.stop>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path
              d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </a>
        <a
          v-if="contact.email" class="contact-card__icon-btn contact-card__icon-btn--email"
          :href="`mailto:${contact.email}`" :aria-label="`Envoyer un email à ${contact.name}`" @click.stop>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 6-10 7L2 6" />
          </svg>
        </a>
      </div>

      <svg
class="contact-card__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>

    <Transition name="cc-fade">
      <div v-if="expanded" class="contact-card__detail">
        <p class="contact-card__detail-hours">
          <svg
class="clock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 3" />
          </svg>
          {{ contact.hours }}
        </p>

        <div
v-for="telephone in contact.telephones" :key="telephone.numero"
          class="contact-card__detail-row">
          <span class="contact-card__detail-value">
            {{ telephone.numero }}
            <span v-if="telephone.libelle" class="contact-card__toll-free">{{ telephone.libelle }}</span>
            <span v-if="telephone.numero_vert" class="contact-card__toll-free" title="Numéro vert — appel gratuit">Numéro vert</span>
          </span>
          <button
type="button" class="contact-card__copy-btn"
            :class="{ 'contact-card__copy-btn--copied': copiedField === telephone.numero }"
            @click.stop="copy(telephone.numero, telephone.numero)">
            {{ copiedField === telephone.numero ? 'Copié' : 'Copier' }}
          </button>
        </div>

        <div v-if="contact.email" class="contact-card__detail-row">
          <span class="contact-card__detail-value">{{ contact.email }}</span>
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
