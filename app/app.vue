<script setup lang="ts">
useHead({
  bodyAttrs: {
    class: 'antialiased bg-background text-foreground'
  }
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
html {
  font-family: Geist, sans-serif;
}
</style>
