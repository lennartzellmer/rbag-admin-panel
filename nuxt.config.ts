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
    session: {
      password: process.env.NUXT_SESSION_PASSWORD ?? '',
      cookie: {
        secure: false,
        httpOnly: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7
      }
    },
    oauth: {
      zitadel: {
        scope: ['openid', 'profile', 'email']
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
