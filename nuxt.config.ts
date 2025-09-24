// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/test-utils/module',
    '@nuxt/ui'
  ],
  ssr: false,
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    auth: {
      enabled: process.env.AUTH_ENABLED ? process.env.AUTH_ENABLED === 'true' : false,
      jwksUri: process.env.AUTH_JWKS_URI,
      audience: process.env.AUTH_AUDIENCE,
      issuer: process.env.AUTH_ISSUER
    },
    public: {
      auth: {
        clientId: process.env.AUTH_CLIENT_ID,
        domain: process.env.AUTH_DOMAIN
      }
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
