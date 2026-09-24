export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  // Temporary workaround for nuxt/nuxt#35033 (rollupOptions.input crash in
  // ssr:false dev). Remove once nuxt >= 3.21.9 with PR #35037 is released.
  experimental: {
    viteEnvironmentApi: true,
  },
  compatibilityDate: '2025-07-15',
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
