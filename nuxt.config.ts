export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  compatibilityDate: '2024-07-05',
  app: {
    head: {
      title: 'Termooo Guesser',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
  },
  vite: {
    assetsInclude: ['**/*.txt'],
  },
});
