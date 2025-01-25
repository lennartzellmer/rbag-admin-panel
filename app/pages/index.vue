<script setup lang="ts">
import { useMachine } from '@xstate/vue'
import { createGenericPaginatedDataMachine } from '../oldMachines/genericPaginatedData/genericPaginatedData.machine.js'
import type { PaginatedRequestParams } from '~/types/base.types.js'

const getUsers = (paginationParams: PaginatedRequestParams) => {
  return fetch('/api/users', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(paginationParams)
  })
}
</script>

<template>
  <main>
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
