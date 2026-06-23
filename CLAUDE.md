# CLAUDE.md

**Stack:** Nuxt 3 · Vue 3 · TypeScript · Vite 7 · CSS (BEM + variables)

👉 See [README](README.md) for setup, commands, and devcontainer workflow (Open vs Attach).

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
