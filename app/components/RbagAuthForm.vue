<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const providers = ref<Array<any>>([
  {
    label: 'Linear',
    icon: 'i-simple-icons-linear',
    color: 'neutral',
    variant: 'subtle',
    onClick: () => {
      // redirect to linear oauth
      window.location.href = '/api/auth/linear'
    }
  }
])
</script>

<template>
  <UAuthForm
    class="max-w-md"
    title="Login"
    description="Enter your credentials to access your account."
    icon="i-lucide-user"
    :providers="providers"
  />
</template>
