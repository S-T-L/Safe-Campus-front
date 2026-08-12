<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  themes: { type: Array, default: () => [] },
})

const query = ref('')
const isFocused = ref(false)

const searchIndex = computed(() => {
  const entries = []

  for (const theme of props.themes) {
    entries.push({
      type: 'theme',
      key: `theme-${theme.id}`,
      label: theme.label,
      href: `#theme-${theme.id}`,
    })

    for (const item of theme.items) {
      entries.push({
        type: 'ressource',
        key: `item-${item.id}`,
        label: item.title,
        subtitle: item.subtitle,
        searchText: `${item.title} ${item.hook} ${item.subtitle}`,
        href: `/contact/${theme.id}/${item.slug}`,
      })

      for (const contact of item.contacts ?? []) {
        entries.push({
          type: 'contact',
          key: `contact-${item.id}-${contact.name}`,
          label: contact.name,
          subtitle: contact.role,
          searchText: `${contact.name} ${contact.role}`,
          href: `/contact/${theme.id}/${item.slug}`,
        })
      }
    }
  }

  return entries
})

const results = computed(() => {
  const term = query.value.trim().toLowerCase()
  if (!term) return { theme: [], ressource: [], contact: [] }

  const matches = searchIndex.value.filter(entry =>
    (entry.searchText ?? entry.label).toLowerCase().includes(term),
  )

  return {
    theme: matches.filter(entry => entry.type === 'theme').slice(0, 4),
    ressource: matches.filter(entry => entry.type === 'ressource').slice(0, 4),
    contact: matches.filter(entry => entry.type === 'contact').slice(0, 4),
  }
})

const hasResults = computed(() =>
  results.value.theme.length > 0 || results.value.ressource.length > 0 || results.value.contact.length > 0,
)

const showPanel = computed(() => isFocused.value && query.value.trim().length > 0)

function selectResult(entry) {
  if (entry.type === 'theme') {
    document.getElementById(entry.href.slice(1))?.scrollIntoView({ behavior: 'smooth' })
  }
  else {
    navigateTo(entry.href)
  }
  query.value = ''
  isFocused.value = false
}

function handleBlur() {
  setTimeout(() => { isFocused.value = false }, 150)
}
</script>

<template>
  <div class="search-bar">
    <div class="search-bar__field">
      <svg class="search-bar__icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.6" />
        <path d="M16 16l-4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
      </svg>
      <input
        v-model="query"
        type="text"
        class="search-bar__input"
        placeholder="Cherche un sujet, une ressource..."
        @focus="isFocused = true"
        @blur="handleBlur"
      >
    </div>

    <Transition name="fade">
      <div v-if="showPanel" class="search-bar__panel">
        <template v-if="hasResults">
          <div v-if="results.theme.length" class="search-bar__group">
            <p class="search-bar__group-label">Thèmes</p>
            <button
              v-for="entry in results.theme"
              :key="entry.key"
              class="search-bar__result"
              @mousedown.prevent="selectResult(entry)"
            >
              <span class="search-bar__result-label">{{ entry.label }}</span>
            </button>
          </div>

          <div v-if="results.ressource.length" class="search-bar__group">
            <p class="search-bar__group-label">Ressources</p>
            <button
              v-for="entry in results.ressource"
              :key="entry.key"
              class="search-bar__result"
              @mousedown.prevent="selectResult(entry)"
            >
              <span class="search-bar__result-label">{{ entry.label }}</span>
              <span class="search-bar__result-subtitle">{{ entry.subtitle }}</span>
            </button>
          </div>

          <div v-if="results.contact.length" class="search-bar__group">
            <p class="search-bar__group-label">Contacts</p>
            <button
              v-for="entry in results.contact"
              :key="entry.key"
              class="search-bar__result"
              @mousedown.prevent="selectResult(entry)"
            >
              <span class="search-bar__result-label">{{ entry.label }}</span>
              <span class="search-bar__result-subtitle">{{ entry.subtitle }}</span>
            </button>
          </div>
        </template>

        <p v-else class="search-bar__empty">
          Aucun résultat pour « {{ query }} »
        </p>
      </div>
    </Transition>
  </div>
</template>
