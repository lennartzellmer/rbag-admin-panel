<script setup lang="ts">

</script>

<template>
  <AuthState v-slot="{ loggedIn }">
    <template v-if="loggedIn">
      <NuxtPage />
    </template>
    <template v-else>
      <div class="flex justify-center items-center h-screen">
        <RbagAuthForm />
      </div>
    </template>
  </AuthState>
</template>
