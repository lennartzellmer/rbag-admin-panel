<script setup lang="ts">
import { useUserSession } from '#imports'

const { loggedIn, user } = useUserSession()

const isAdmin = computed(() => !!user.value?.roles.includes('admin'))
</script>

<template>
  <div>
    <template v-if="loggedIn && isAdmin">
      <NuxtPage />
    </template>
    <template v-else>
      <div class="flex justify-center items-center h-screen">
        <RbagAuthForm />
      </div>
    </template>
  </div>
</template>
