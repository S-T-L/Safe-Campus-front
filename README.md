# Safe Campus — Front

Interface utilisateur du projet SAE501. Construit avec **Nuxt 3** et **Vue 3**.

> Ce repo fonctionne en binôme avec [Safe-Campus-back](../Safe-Campus-back). Les deux doivent être dans le même dossier parent — le `docker-compose.yml` du back référence ce repo via `../Safe-Campus-front`.

---

## Démarrage

Le stack est orchestré par le `docker-compose.yml` du back. Le code s'édite sur l'hôte, les commandes s'exécutent dans le container.

### 1. Full stack (avec le back)

```bash
cd ../Safe-Campus-back
docker compose up -d
```

Démarre `SC_Back`, `SC_Front`, `SC_Postgres` et `SC_Adminer`. Voir le [README du back](../Safe-Campus-back/README.md) pour le `.env` requis.

> ⚠️ Aucune route API n'existe encore côté back (`routes/api.php` absent) — pas d'intégration réelle possible pour l'instant, seulement les deux stacks qui tournent en parallèle.

### 2. Frontend seul (sans le back)

```bash
cd ../Safe-Campus-back
docker compose up -d sc_front
```

Démarre uniquement `SC_Front`. Les endpoints API sont morts, mais tu peux bosser sur **UI, CSS, composants** sans dépendances.

### Exécuter les commandes dans le container

`SC_Front` lance `npm install` puis `npm run dev` au démarrage. Pour le reste :

```bash
docker compose exec sc_front npm run lint
```

Ouvrir le code : `code .` depuis WSL, à la racine de ce repo.

### Logs

```bash
docker compose logs -f sc_front
```

---

## Ports

| Port | Service |
|---|---|
| `3000` | Nuxt dev server → http://localhost:3000 |
| `24678` | Vite HMR |

---

## Variables d'environnement

Copier `.env.example` en `.env` :

| Variable | Défaut | Description |
|---|---|---|
| `NUXT_PUBLIC_API_BASE` | `http://localhost:8000` | URL de l'API Laravel |

> Dans le stack Docker, `NUXT_PUBLIC_API_BASE` est injecté par le `docker-compose.yml` du back.

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
└── Dockerfile      Image Node 22
```

---

## Conventions

- **Pas de `<style>` dans les `.vue`** — tout le CSS va dans `assets/css/main.css`
- **BEM** pour le nommage CSS : `.bloc__element--modificateur`
- **CSS variables** pour toutes les valeurs partagées (couleurs, espacements, etc.)
- **Ordre dans les composants** : imports → props & emits → state (`ref`/`reactive`) → computed → fonctions
- **Appels API** : via `useRuntimeConfig().public.apiBase` pour l'URL de base
