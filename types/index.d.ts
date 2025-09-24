declare module 'nuxt/schema' {
  interface RuntimeConfig {
    auth: {
      jwksUri: string
      audience: string
      enabled: boolean
      issuer: string
    }
  }
  interface PublicRuntimeConfig {
    auth: {
      clientId: string
      domain: string
    }
  }
}

export {}
