# Safe Campus — Front

Interface utilisateur du projet SAE501. Construit avec **Nuxt 3** et **Vue 3**.

> Ce repo fonctionne en binôme avec [Safe-Campus-back](../Safe-Campus-back). Les deux doivent être dans le même dossier parent — le `docker-compose.yml` du back référence ce repo via `../Safe-Campus-front`.

---

## Démarrage

### Via le devcontainer du back (recommandé)

Ouvrir `Safe-Campus-back` dans VS Code → **Dev Containers: Reopen in Container**.

Le container front démarre automatiquement avec le reste du stack. Aucune action manuelle requise.

### Via le devcontainer du front (indépendant)

Ouvrir `Safe-Campus-front` dans VS Code → **Dev Containers: Reopen in Container**.

Lance uniquement le container `SC_Front`. Si le back tourne déjà, VS Code se réattache au container existant sans en créer un nouveau.

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
