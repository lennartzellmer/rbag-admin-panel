<template>
  <AuthState v-slot="{ loggedIn, clear }">
    <template v-if="loggedIn">
      <button @click="clear">
        Logout
      </button>
      <NuxtPage />
    </template>
    <a v-else href="/api/auth/linear">Login</a>
  </AuthState>
</template>
