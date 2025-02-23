<script setup lang="ts">
import Toaster from '@/components/ui/toast/Toaster.vue'

useHead({
  bodyAttrs: {
    class: 'antialiased bg-background text-foreground'
  }
})
</script>

<template>
  <Toaster />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
html {
  font-family: Geist, sans-serif;
}
</style>
