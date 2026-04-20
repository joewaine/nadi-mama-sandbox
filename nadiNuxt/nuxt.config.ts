export default defineNuxtConfig({
  modules: ['@nuxt/ui'],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'Nadi Mama — Elevated Eastern Mediterranean',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap',
        },
      ],
    },
  },

  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL || 'http://localhost:4000',
    },
  },

  ssr: false,

  compatibilityDate: '2025-01-01',
})
