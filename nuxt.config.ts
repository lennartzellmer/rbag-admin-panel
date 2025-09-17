// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    'nuxt-auth-utils',
    '@nuxt/eslint',
    '@nuxt/test-utils/module',
    '@nuxt/ui-pro'
  ],
  ssr: false,
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-09-17',
  nitro: {
    ignore: ['**/*.spec.ts', '**/__test__/**']
  },
  eslint: {
    config: {
      stylistic: {
        quotes: 'single',
        commaDangle: 'never'
      }
    }
  }
})
