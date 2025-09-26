<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const providers = ref<Array<any>>([
  {
    label: 'Zitadel',
    icon: 'i-lucide-lock',
    color: 'neutral',
    variant: 'subtle',
    onClick: () => {
      window.location.href = '/api/auth/zitadel'
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
