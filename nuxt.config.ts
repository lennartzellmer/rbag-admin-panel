// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    'radix-vue/nuxt',
    'nuxt-auth-utils',
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss'
  ],
  devtools: { enabled: true },
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2024-11-01',
  eslint: {
    config: {
      stylistic: {
        quotes: 'single',
        commaDangle: 'never'
      }
    }
  },
  tailwindcss: {
    exposeConfig: true,
    viewer: true
  }
})
