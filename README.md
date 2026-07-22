# Safe Campus — Front

Interface utilisateur du projet SAE501. Construit avec **Nuxt 3** et **Vue 3**.

> Ce repo fonctionne en binôme avec [Safe-Campus-back](../Safe-Campus-back). Les deux doivent être dans le même dossier parent — le `docker-compose.yml` du back référence ce repo via `../Safe-Campus-front`.

---

## Démarrage

Même méthode dans les deux cas : **Dev Containers: Reopen in Container**.

### 1. Full stack (avec le back)

1. Ouvrir `Safe-Campus-back` dans VS Code → `Ctrl+Shift+P` → **Dev Containers: Reopen in Container**
2. Démarre back + DB + front + adminer
3. Ouvrir une **nouvelle fenêtre** VS Code sur `Safe-Campus-front`
4. `Ctrl+Shift+P` → **Dev Containers: Reopen in Container**
5. VS Code se connecte au container `SC_Front` déjà en cours d'exécution

Utilise cette approche pour **tester l'intégration API** et **travailler avec le back**.

### 2. Frontend seul (sans le back)

1. Ouvrir `Safe-Campus-front` dans VS Code → `Ctrl+Shift+P` → **Dev Containers: Reopen in Container**
2. Démarre uniquement `SC_Front` (pas de back, pas de DB)
3. Les endpoints API sont morts, mais tu peux bosser sur **UI, CSS, composants** sans dépendances

Utilise cette approche pour **itérer sur le design et le styling** en solo.

> "Attach to Running Container" ne fonctionne pas pour ce container — utiliser exclusivement **Reopen in Container**.

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
