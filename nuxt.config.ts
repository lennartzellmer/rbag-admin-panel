// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['nuxt-auth-utils', '@nuxt/eslint', '@nuxt/test-utils/module', '@nuxt/ui', '@nuxt/image'],
  ssr: false,
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    session: {
      password: process.env.NUXT_SESSION_PASSWORD ?? '',
      cookie: {
        secure: process.env.NUXT_SESSION_COOKIE_SECURE === 'false' ? false : true,
        httpOnly: process.env.NUXT_SESSION_COOKIE_HTTP_ONLY === 'false' ? false : true,
        sameSite: process.env.NUXT_SESSION_COOKIE_SAME_SITE === 'false' ? 'lax' : 'strict'
      }
    },
    oauth: {
      zitadel: {
        scope: ['openid', 'profile', 'email']
      }
    },
    mongodb: {
      eventStoreUri: process.env.NUXT_MONGODB_URL ?? '',
      user: process.env.NUXT_MONGODB_USER ?? '',
      password: process.env.NUXT_MONGODB_PASSWORD ?? ''
    },
    storage: {
      s3: {
        endpoint: process.env.NUXT_STORAGE_S3_ENDPOINT ?? '',
        port: Number.parseInt(process.env.NUXT_STORAGE_S3_PORT ?? '9000'),
        ssl: process.env.NUXT_STORAGE_S3_SSL === 'false' ? false : true,
        region: process.env.NUXT_STORAGE_S3_REGION ?? 'eu-central-1',
        bucket: process.env.NUXT_STORAGE_S3_BUCKET ?? '',
        tempBucket: process.env.NUXT_STORAGE_S3_TEMP_BUCKET ?? '',
        accessKeyId: process.env.NUXT_STORAGE_S3_ACCESS_KEY ?? '',
        secretAccessKey: process.env.NUXT_STORAGE_S3_SECRET_KEY ?? '',
        uploadUrlExpirationSeconds: Number.parseInt(process.env.NUXT_STORAGE_S3_UPLOAD_EXPIRES_IN ?? '900', 10)
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