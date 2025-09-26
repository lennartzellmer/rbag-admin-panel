import { useAuthState } from './internal/auth-state'
import { queryKeys } from './internal/constant'

const useAuth = () => {
  const runtimeConfig = useRuntimeConfig()
  const router = useRouter()
  const state = useAuthState()
  const user = computed(() => (state.value.state === 'authenticated' ? state.value.user : null))
  return {
    user,
    login: (postLoginRoute?: string) => {
      return navigateTo(
        {
          path: runtimeConfig.public.auth.loginRoute,
          query: { [queryKeys.POST_LOGIN_ROUTE]: postLoginRoute || router.currentRoute.value.path }
        },
        { external: true }
      )
    },
    logout: () => {
      return navigateTo(runtimeConfig.public.auth.logoutRoute, { external: true })
    }
  }
}

export { useAuth }
