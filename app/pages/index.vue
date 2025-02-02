<script setup lang="ts">
import { useActor, useSelector } from '@xstate/vue'
import { createFetchPaginatedMachine } from '~/machines/fetchPaginated/fetchPaginated.machine.js'
import { getUsers } from '~/services/api.js'

const machine = createFetchPaginatedMachine({ fetchDataFunction: getUsers })
const { actorRef, snapshot } = useActor(machine)
const paginationMachineRef = useSelector(actorRef, state => state.context.paginationMachineRef)
</script>

<template>
  <main class="flex flex-col gap-4 container mx-auto">
    <template
      v-for="user in snapshot.context.data"
      :key="user._id"
    >
      <UserActor :user="user" />
    </template>
    <PaginationActor
      v-if="paginationMachineRef"
      :pagination-actor-ref="paginationMachineRef"
    />
  </main>
</template>
