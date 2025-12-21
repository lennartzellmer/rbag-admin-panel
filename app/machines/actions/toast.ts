import type { Toast } from '@nuxt/ui/runtime/composables/useToast.js'

export const showToast = (_: unknown, params: { title: string, description: string, color: Toast['color'], icon: string }) => {
  const toast = useToast()
  toast.add({
    title: params.title,
    description: params.description,
    icon: params.icon,
    color: params.color
  })
}
