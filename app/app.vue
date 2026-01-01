<script setup lang="ts">
const toaster = { expand: false }
</script>

<template>
  <UApp :toaster="toaster">
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
