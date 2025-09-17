<script setup lang="ts">
useHead({
  bodyAttrs: {
    class: 'antialiased bg-background text-foreground'
  }
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<style>
html {
  font-family: Geist, sans-serif;
}
</style>
