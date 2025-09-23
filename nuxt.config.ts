// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    'nuxt-auth-utils',
    '@nuxt/eslint',
    '@nuxt/test-utils/module',
    '@nuxt/ui'
  ],
  ssr: false,
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    auth: {
      jwksUri: process.env.AUTH_JWKS_URI || '',
      issuer: process.env.AUTH_ISSUER || ''
    }
  },
  devServer: {
    port: 3001
  },
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
