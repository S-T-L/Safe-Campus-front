// Formes des reponses de l'API annuaire (Safe-Campus-back, routes/api.php).
// Un type par Resource Laravel — voir app/Http/Resources dans le back.

export interface MediaApi {
  libelle: string
  description: string | null
  url: string | null
  type: 'image' | 'video' | 'audio' | 'document'
}

export interface TelephoneApi {
  numero: string
  numero_vert: boolean
  type: 'mobile' | 'fixe' | 'sms' | 'urgence'
  libelle: string | null
}

export interface ContactApi {
  ref: string
  nom: string
  prenom: string | null
  mail: string | null
  localisation: string | null
  site_web: string | null
  horaires: string | null
  remarques: string | null
  gratuit: boolean | null
  anonyme: boolean | null
  latitude: number | null
  longitude: number | null
  telephones: TelephoneApi[]
}

export interface SousThemeSummaryApi {
  ref: string
  libelle: string
  resume: string | null
  ordre: number
}

export interface ThemeApi {
  ref: string
  libelle: string
  libelle_court: string | null
  resume: string | null
  ordre: number
  medias: MediaApi[]
  sous_themes: SousThemeSummaryApi[]
}

export interface SousThemeDetailApi {
  ref: string
  libelle: string
  article: string | null
  intro_ressources: string | null
  theme: {
    ref: string
    libelle_court: string | null
  }
  contacts: ContactApi[]
  documents: MediaApi[]
}

// Formes d'affichage front, construites a partir des types API ci-dessus.

export interface ThemeItemView {
  id: number
  slug: string
  title: string
  hook: string | null
  ninja: string | undefined
  subtitle: string
}

export interface ThemeView {
  id: string
  label: string
  shortLabel: string | null
  color: string
  items: ThemeItemView[]
}

export interface DisplayContact {
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

// Contact dont la position est connue : partage entre la page contact
// (filtrage) et <ContactMap> (marqueurs, geolocalisation).
export interface LocatedContact extends Omit<DisplayContact, 'lat' | 'lng'> {
  lat: number
  lng: number
}
