import svgLoader from 'vite-svg-loader'

export default defineNuxtConfig({
  compatibilityDate: '2026-07-31',

  modules: ['@nuxt/eslint'],

  devtools: { enabled: true },

  devServer: {
    host: '0.0.0.0',
    port: 3000,
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;500;600;700;800&display=swap' },
      ],
    },
  },

  runtimeConfig: {
    // Serveur uniquement (SSR) : hostname Docker interne, injecte par
    // docker-compose.yml du back. Jamais expose au client.
    apiBaseInternal: process.env.NUXT_API_BASE_INTERNAL ?? process.env.NUXT_PUBLIC_API_BASE ?? 'http://localhost:8000',
    public: {
      // Navigateur : doit etre joignable depuis l'hote, jamais un hostname
      // Docker interne (le reseau bridge n'existe pas hors des conteneurs).
      apiBase: process.env.NUXT_PUBLIC_API_BASE ?? 'http://localhost:8000',
    },
  },

  vite: {
    plugins: [svgLoader()],
    server: {
      ws: {
        port: 3000,
      },
    },
  },
})
