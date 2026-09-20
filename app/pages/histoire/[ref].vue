<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ChoixApi, HistoireApi } from '~/types/annuaire'
import IconArrowLeft from '~/assets/icon/arrow-left.svg?component'
import IconArrowPath from '~/assets/icon/arrow-path.svg?component'

definePageMeta({ layout: 'default' })

const route = useRoute()
const apiBase = useApiBase()

// Cle explicite et stable : meme raison que la page contact (URL de l'API
// differente au SSR et au client, donc cle auto-generee differente).
const { data: response, error: fetchError } = await useFetch<{ data: HistoireApi }>(
  `${apiBase}/api/histoires/${route.params.ref}`,
  { key: `histoire:${route.params.ref}` },
)

if (fetchError.value || !response.value?.data) {
  throw createError({ statusCode: 404, statusMessage: 'Histoire introuvable' })
}

const histoire = response.value.data

useHead({ title: histoire.titre })

// Meme couleur par defaut que les pages contact et ressources.
const color = '#4260e6'

// Page d'ou l'on vient (?retour=/contact/...). Chemin interne uniquement,
// sinon un lien forge redirigerait hors du site.
const retour = computed(() => {
  const chemin = route.query.retour
  return typeof chemin === 'string' && chemin.startsWith('/') && !chemin.startsWith('//') ? chemin : '/'
})

// Le graphe est entier dans la reponse : on navigue localement, sans nouvel appel.
const scenesParId = new Map(histoire.scenes.map(scene => [scene.id, scene]))

const sceneId = ref<number | null>(histoire.scene_initiale_id)
const choixFinal = ref<ChoixApi | null>(null)
const expandedContactRef = ref<string | null>(null)

const scene = computed(() => (sceneId.value === null ? null : scenesParId.get(sceneId.value) ?? null))
const contacts = computed(() => toDisplayContacts(choixFinal.value?.contacts ?? []))

const finLabels = {
  favorable: 'Bonne décision',
  defavorable: 'Cette décision peut te mettre en danger',
}

const finLabel = computed(() => {
  const issue = choixFinal.value?.issue
  return issue ? finLabels[issue] : "Fin de l'histoire"
})

function choisir(choix: ChoixApi) {
  const suivante = choix.next_scene_id === null ? null : scenesParId.get(choix.next_scene_id)

  if (suivante) {
    sceneId.value = suivante.id
    return
  }

  choixFinal.value = choix
  sceneId.value = null
}

function recommencer() {
  sceneId.value = histoire.scene_initiale_id
  choixFinal.value = null
  expandedContactRef.value = null
}

function toggleExpandedContact(contactRef: string) {
  expandedContactRef.value = expandedContactRef.value === contactRef ? null : contactRef
}
</script>

<template>
  <div class="cp-page histoire">
    <section class="cp-hero">
      <span class="cp-tag">Histoire</span>
      <h1 class="cp-title">{{ histoire.titre }}</h1>
    </section>

    <div class="histoire__content">
      <div class="histoire__stage" aria-live="polite">
        <article v-if="scene" :key="scene.id" class="histoire__card">
          <img
            v-if="scene.media?.url"
            :src="scene.media.url"
            :alt="scene.media.libelle"
            class="histoire__image"
          >
          <p class="histoire__dialogue">{{ scene.dialogue_text }}</p>

          <ul v-if="scene.choix.length" class="histoire__choix">
            <li v-for="choix in scene.choix" :key="choix.id">
              <button type="button" class="histoire__choix-btn" @click="choisir(choix)">
                {{ choix.text_choix }}
              </button>
            </li>
          </ul>
          <div v-else class="histoire__actions">
            <p class="histoire__note">Cette scène n'a pas de suite.</p>
            <button type="button" class="btn-story" @click="recommencer">
              <IconArrowPath class="histoire__icon" aria-hidden="true" />
              Recommencer
            </button>
          </div>
        </article>

        <template v-else-if="choixFinal">
          <article
            class="histoire__card histoire__fin"
            :class="choixFinal.issue && `histoire__fin--${choixFinal.issue}`"
          >
            <p class="histoire__fin-label">{{ finLabel }}</p>
            <p class="histoire__dialogue">{{ choixFinal.text_choix }}</p>
            <div class="histoire__actions">
              <button type="button" class="btn-story" @click="recommencer">
                <IconArrowPath class="histoire__icon" aria-hidden="true" />
                Recommencer
              </button>
            </div>
          </article>

          <section v-if="contacts.length" class="histoire__aide">
            <p class="section-label">Des personnes peuvent t'aider</p>
            <div class="cp-contacts-grid">
              <ContactCard
                v-for="contact in contacts"
                :key="contact.ref"
                :contact="contact"
                :color="color"
                :expanded="contact.ref === expandedContactRef"
                @toggle="toggleExpandedContact"
              />
            </div>
          </section>
        </template>

        <article v-else class="histoire__card">
          <p class="histoire__note">Cette histoire n'a pas encore de début.</p>
        </article>
      </div>

      <NuxtLink :to="retour" class="histoire__quitter">
        <IconArrowLeft class="histoire__icon" aria-hidden="true" />
        Quitter l'histoire
      </NuxtLink>
    </div>

    <SiteFooter />
  </div>
</template>
