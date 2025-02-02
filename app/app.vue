<script setup lang="ts">
import Toaster from '@/components/ui/toast/Toaster.vue'
</script>

<template>
  <Toaster />
  <AuthState v-slot="{ loggedIn, clear }">
    <template v-if="loggedIn">
      <button @click="clear">
        Logout
      </button>
      <NuxtPage />
    </template>
    <a
      v-else
      href="/api/auth/linear"
    >Login</a>
  </AuthState>
</template>
