# Safe Campus — Front

Interface utilisateur du projet SAE501. Construit avec **Nuxt 3** et **Vue 3**.

> Ce repo fonctionne en binôme avec [Safe-Campus-back](../Safe-Campus-back). Les deux doivent être dans le même dossier parent — le `docker-compose.yml` du back référence ce repo via `../Safe-Campus-front`.

---

## Démarrage

Deux approches selon ton contexte.

### 1. Full stack (avec le back) — **Open in Container**

1. Ouvrir `Safe-Campus-back` dans VS Code → **Dev Containers: Reopen in Container**
2. Ça lance back + DB + front + adminer
3. Ouvrir une nouvelle fenêtre VS Code sur `Safe-Campus-front`
4. VS Code propose → **Dev Containers: Open in Container**
5. Lance un nouveau container `sc_front` connecté au stack du back

Utilise cette approche pour **tester l'intégration API** et **travailler avec le back**.

### 2. Frontend seul (CSS, composants) — **Attach to Container**

1. Ouvrir `Safe-Campus-front` dans VS Code → **Dev Containers: Reopen in Container**
2. Lance uniquement le container `SC_Front` en isolation (pas de back, pas de DB)
3. Les endpoints API sont morts, mais tu peux bosser sur **UI, CSS, structure de composants** sans dépendances

Utilise cette approche pour **itérer sur le design et le styling** en solo.

**Note :** Si le back tourne déjà, VS Code se réattache au container existant au lieu d'en créer un nouveau.

---

## Ports

| Port | Service |
|---|---|
| `3000` | Nuxt dev server → http://localhost:3000 |
| `24678` | Vite HMR |

---

## Variables d'environnement

Copier `.env.example` en `.env` (fait automatiquement par le `setup.sh` au premier démarrage) :

| Variable | Défaut | Description |
|---|---|---|
| `NUXT_PUBLIC_API_BASE` | `http://localhost:8000` | URL de l'API Laravel |

> En devcontainer, `NUXT_PUBLIC_API_BASE` est injecté via le `docker-compose.yml` du back.

---

## Structure

```
Safe-Campus-front/
├── pages/          Pages Nuxt (une page = une route)
├── components/     Composants Vue réutilisables
├── composables/    Composables useXxx()
├── layouts/        Layouts Nuxt
├── assets/css/     Styles globaux
├── public/         Fichiers statiques
├── nuxt.config.ts  Configuration Nuxt
└── .devcontainer/  Config VS Code devcontainer
```

---

## Conventions

- **Pas de `<style>` dans les `.vue`** — tout le CSS va dans `assets/css/main.css`
- **BEM** pour le nommage CSS : `.bloc__element--modificateur`
- **CSS variables** pour toutes les valeurs partagées (couleurs, espacements, etc.)
- **Ordre dans les composants** : imports → props & emits → state (`ref`/`reactive`) → computed → fonctions
- **Appels API** : via `useRuntimeConfig().public.apiBase` pour l'URL de base
