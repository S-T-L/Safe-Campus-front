// Presentation front-only, indexee par le `ref` renvoye par l'API
// (GET /api/themes, GET /api/sous-themes/{ref}). Le contenu editorial
// (libelle, resume, article, contacts...) vient du back, voir
// Safe-Campus-back/docs/textes-front.md.

interface ThemePresentation {
  color: string
  prefixe: string
}

export const themePresentation: Record<string, ThemePresentation> = {
  addictions: { color: '#4260e6', prefixe: 'COMPORTEMENT ADDICTIF' },
  sante_mentale: { color: '#4260e6', prefixe: 'SANTÉ MENTALE' },
  vss: { color: '#4260e6', prefixe: 'VIOLENCE' },
}

export const sousThemeNinjas: Record<string, string> = {
  alcool: '/assets/ninja_alcool.png',
  tabac: '/assets/ninja_cigarette.png',
  drogue: '/assets/ninja_drogue.png',
  anxiete: '/assets/ninja-anxiete.png',
  depression: '/assets/ninja-depression.png',
  burn_out: '/assets/ninja_cigarette.png',
  violences_sexistes: '/assets/ninja_vsexiste.png',
  violences_sexuelles: '/assets/ninja_consentement.png',
  harcelement: '/assets/ninja_violence.png',
}
