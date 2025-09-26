import { useAuth } from '#auth'

interface AuthPageMetaUnprotected {
  public: true
}

interface AuthPageMetaProtected {
  public?: false
}

type AuthPageMeta = AuthPageMetaUnprotected | AuthPageMetaProtected

declare module 'vue-router' {
  interface RouteMeta {
    auth?: AuthPageMeta
  }
}

declare module '#app' {
  interface PageMeta {
    auth?: AuthPageMeta
  }
}

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuth()

  if (to.meta.auth?.public === true) {
    return
  }

  if (!auth.user.value) {
    return auth.login(to.path)
  }
})
