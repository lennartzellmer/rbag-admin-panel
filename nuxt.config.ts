// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    'radix-vue/nuxt',
    'nuxt-auth-utils',
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    'nuxt-mongoose',
    'shadcn-nuxt'
  ],
  ssr: false,
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
  mongoose: {
    options: {
      dbName: 'org_management_service'
    }
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
