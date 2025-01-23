<script setup lang="ts">
const { data, error, status } = await useFetch('/api/users')
</script>

<template>
  <main>
    <pre>{{ status }}</pre>
    <pre>{{ error }}</pre>
    <pre>{{ data }}</pre>
    <AuthState v-slot="{ loggedIn, clear }">
      <button
        v-if="loggedIn"
        @click="clear"
      >
        Logout
      </button>
      <a
        v-else
        href="/api/auth/linear"
      >Login</a>
    </AuthState>
  </main>
</template>
