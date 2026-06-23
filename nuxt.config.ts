export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  srcDir: './app',

  devtools: { enabled: true },

  devServer: {
    host: '0.0.0.0',
    port: 3000,
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE ?? 'http://localhost:8000',
    },
  },

  vite: {
    server: {
      hmr: {
        port: 3000,
      },
    },
  },
})
