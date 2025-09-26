import {
  addPlugin,
  addRouteMiddleware,
  addServerHandler,
  createResolver,
  defineNuxtModule
} from 'nuxt/kit'
import { z } from 'zod'
import type { AuthState } from './runtime/internal/auth-state'

const { resolve } = createResolver(import.meta.url)

const publicAuthModuleOptionsSchema = z.object({
  loginRoute: z.string().default('/login').transform(sanitizeRoute),
  verifyLoginRoute: z.string().default('/verify-login').transform(sanitizeRoute),
  logoutRoute: z.string().default('/logout').transform(sanitizeRoute),
  authRoute: z.string().default('/auth').transform(sanitizeRoute),
  defaultPostLoginRoute: z.string().default('/'),
  postLogoutRoute: z.string().default('/'),
  refreshThresholdInSeconds: z.coerce.number().default(30)
})

const privateAuthModuleOptionsSchema = z.object({
  sessionPassword: z.string().min(32).default('secret-session-pasword-min-length-32'),
  sessionTTL: z.coerce.number().default(4 * 24 * 60 * 60),
  clientId: z.string().default(''),
  clientSecret: z.string().default(''),
  issuer: z.string().default('')
})

export type AuthModuleOptions = z.input<typeof publicAuthModuleOptionsSchema> &
  z.input<typeof privateAuthModuleOptionsSchema>

export default defineNuxtModule<AuthModuleOptions>({
  meta: {
    name: 'auth'
  },
  setup(options, nuxt) {
    const publicOptions = publicAuthModuleOptionsSchema.parse({ ...options })
    const privateOptions = privateAuthModuleOptionsSchema.parse({ ...options })

    /**
     * Add alias for auth with higher priority
     */
    nuxt.options.alias = {
      '#auth': resolve('./runtime/auth-composables'),
      '#auth-session': resolve('./runtime/auth-session.ts'),
      ...nuxt.options.alias
    }

    nuxt.options.runtimeConfig.public.auth = publicOptions
    nuxt.options.runtimeConfig.auth = privateOptions

    /**
     * Auth flow
     */
    addServerHandler({
      route: publicOptions.loginRoute,
      method: 'get',
      handler: resolve('./runtime/server-handler/login-handler')
    })
    addServerHandler({
      route: publicOptions.verifyLoginRoute,
      method: 'get',
      handler: resolve('./runtime/server-handler/verify-login-handler')
    })
    addServerHandler({
      route: publicOptions.logoutRoute,
      method: 'get',
      handler: resolve('./runtime/server-handler/logout-handler')
    })
    addServerHandler({
      route: publicOptions.authRoute,
      method: 'get',
      handler: resolve('./runtime/server-handler/auth-handler')
    })

    /**
     * Server middleware
     */
    addServerHandler({
      handler: resolve('./runtime/server-middleware/auth-server-middleware')
    })

    /**
     * Route middleware
     */
    addRouteMiddleware({
      name: 'auth',
      path: resolve('./runtime/route-middleware/auth-route-middleware'),
      global: true
    })

    /**
     * Plugins
     */
    addPlugin({
      src: resolve('./runtime/nuxt-plugins/auth-plugin.client'),
      mode: 'client'
    })
    addPlugin({
      src: resolve('./runtime/nuxt-plugins/auth-plugin.server'),
      mode: 'server'
    })
  }
})

/**
 * Utils
 */
function sanitizeRoute(route: string) {
  // Trim any leading and trailing spaces, then normalize slashes
  let sanitized = route.trim().replace(/\/+/g, '/') // Replace multiple slashes with one

  // Return root path if empty string
  if (!route) return '/'

  // Ensure exactly one leading slash
  if (!sanitized.startsWith('/')) {
    sanitized = `/${sanitized}`
  }

  // Remove trailing slash, if present (but keep root `/`)
  if (sanitized !== '/' && sanitized.endsWith('/')) {
    sanitized = sanitized.slice(0, -1)
  }

  return sanitized
}

/**
 * Interface augmentation
 */

declare module '@nuxt/schema' {
  interface NuxtConfig {
    auth?: AuthModuleOptions
  }
}

declare module 'h3' {
  interface H3EventContext {
    auth?: AuthState
  }
}
