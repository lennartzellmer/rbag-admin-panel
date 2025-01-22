<script setup lang="ts">
const { user } = useUserSession()
</script>

<template>
  <main>
    <pre>user {{ user }}</pre>
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
