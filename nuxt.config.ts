// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    'reka-ui/nuxt',
    'nuxt-auth-utils',
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    'nuxt-seo-utils',
    '@nuxt/fonts'
  ],
  ssr: false,
  devtools: { enabled: true },
  runtimeConfig: {
    mongodbUri: process.env.NUXT_MONGODB_URI
  },
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
  prisma: {
    runMigration: false
  },
  shadcn: {
    componentDir: './app/components/ui'
  },
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
    cssPath: ['./app/assets/css/tailwind.css', { injectPosition: 'first' }]
  }
})
