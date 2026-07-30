<script setup>
defineProps({
  contact: { type: Object, required: true },
  color: { type: String, required: true },
  isNearest: { type: Boolean, default: false },
})

function telHref(phone) {
  return `tel:${phone.replace(/\s/g, '')}`
}
</script>

<template>
  <div class="contact-card" :class="{ 'contact-card--nearest': isNearest }" :style="{ '--theme-color': color }">
    <div class="contact-card__top">
      <div class="contact-card__avatar" aria-hidden="true" />
      <div class="contact-card__identity">
        <p class="contact-card__name">
          {{ contact.name }}
          <span v-if="isNearest" class="contact-card__nearest-tag">Le plus proche</span>
        </p>
        <p class="contact-card__role">{{ contact.role }}</p>
      </div>
    </div>

    <p class="contact-card__hours">
      <svg
class="clock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
      </svg>
      {{ contact.hours }}
    </p>

    <div class="contact-card__actions">
      <a v-if="contact.phone" class="contact-pill contact-pill--phone" :href="telHref(contact.phone)">
        <svg
class="phone-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <path
            d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
        {{ contact.phone }}
        <span v-if="contact.tollFree" class="toll-free-badge" title="Numéro vert — appel gratuit">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l2.39 6.94H21l-5.6 4.07L17.6 20 12 15.93 6.4 20l2.2-7-5.6-4.07h6.61z" />
          </svg>
        </span>
      </a>

      <a v-if="contact.email" class="contact-pill contact-pill--email" :href="`mailto:${contact.email}`">
        <svg
class="email-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 6-10 7L2 6" />
        </svg>
        {{ contact.email }}
      </a>
    </div>
  </div>
</template>
