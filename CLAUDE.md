# CLAUDE.md

**Stack:** Nuxt 4 · Vue 3 · TypeScript · Vite 8 · CSS (BEM + variables)

👉 See [README](README.md) for setup and commands.

> Le code s'édite sur l'hôte, les commandes s'exécutent dans le container via `docker compose exec sc_front <cmd>`.

---

## Code Conventions

**No `<style>` blocks** — all CSS in `assets/css/main.css`.

**BEM naming:** `.bloc__element--modificateur`

**CSS variables** for shared values (colors, spacing, etc.).

**Component order:** imports → props & emits → state (`ref`/`reactive`) → computed → functions.

**API calls:** `$fetch()` or axios. Data from backend comes via Inertia props only.

**Inertia navigation:**
```vue
import { Link, router } from '@inertiajs/vue3'
<Link href="/histoires">  <!-- declarative -->
router.visit('/histoires')  <!-- programmatic -->
```

**Icônes :** [Heroicons](https://heroicons.com/) (style *outline*, 24×24, `stroke-width="1.5"`). Fichiers `.svg` sources dans `app/assets/icon/<nom>.svg` (nom = slug Heroicons), récupérés via le CDN jsDelivr (`https://cdn.jsdelivr.net/npm/heroicons@<version>/24/outline/<nom>.svg`) plutôt que copiés à la main. Importés en composant Vue via `vite-svg-loader` (`import IconPhone from '~/assets/icon/phone.svg'` puis `<IconPhone class="..." />`) — jamais de tracé SVG dupliqué en dur dans un template. `fill="none" stroke="currentColor"` pour hériter la couleur du parent.

## Git

- Workflow git flow : `feature/*` pour le dev, merge sur `dev` en `--no-ff`. `hotfix/*` créé depuis `main`.
- Une fois une `feature/*` mergée dans `dev` et poussée sur `origin/dev`, supprimer la branche locale (`git branch -d`). Ne pas laisser de branches `feature/*` locales après clôture.
- Avant de merger une branche `feature/*`, `bugfix/*`, `hotfix/*` ou autre sur `dev` ou `main` : proposer à l'utilisateur un dernier commit dédié, en fin de branche, à la vérification `typecheck` + `lint` (et aux correctifs de qualité de code que ça implique). Ne jamais merger sans avoir proposé ce commit.
- Jamais de `Co-Authored-By` dans les messages de commit.
- Format de message de commit obligatoire :

```
type(scope): phrase résumé.
- ajout 1
- ajout 2
```

Exemple :

```
infra(docker): mise a jour de dépendances sur le conteneur.
- ajout de git
- installation des dépendances php laravel
```
