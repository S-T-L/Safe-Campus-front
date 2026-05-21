#!/bin/bash
set -e

# Ensure nuxt user owns the workspace
sudo chown -R "$(id -u):$(id -g)" . 2>/dev/null || true

# Créer .env si absent
if [ ! -f .env ]; then
    cp .env.example .env
    echo ".env créé depuis .env.example"
fi

npm install

echo ""
echo "✅ Setup terminé — environnement prêt."
