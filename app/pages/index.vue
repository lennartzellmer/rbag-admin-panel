<script setup lang="ts">
import { useMachine } from '@xstate/vue'
import { createGenericPaginatedDataMachine } from '../machines/genericPaginatedData/genericPaginatedData.machine.js'
import type { PaginatedRequestParams } from '~/types/base.types.js'

const getUsers = (paginationParams: PaginatedRequestParams) => {
  return fetch('/api/users', {
    params: {
      ...paginationParams
    }
  })
}

const { state, service, send } = useMachine(createGenericPaginatedDataMachine({
  fetchDataFunction: getChargeSessionGroups,
  initialLimit: 5,
  initialOffset: 0,
  append: false
}), {
  devTools: import.meta.env.DEV
})
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
