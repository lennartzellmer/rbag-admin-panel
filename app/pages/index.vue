<script setup lang="ts">
import { useActor, useSelector } from '@xstate/vue'
import { createBrowserInspector } from '@statelyai/inspect'
import { createFetchPaginatedMachine } from '~/machines/fetchPaginated/fetchPaginated.machine.js'
import { getUsers } from '~/services/api.js'

const { inspect } = createBrowserInspector()

const machine = createFetchPaginatedMachine({ fetchDataFunction: getUsers })
const { actorRef, snapshot } = useActor(machine, { inspect })
console.log(snapshot.value.context.data)
const paginationMachineRef = useSelector(actorRef, state => state.context.paginationMachineRef)
</script>

<template>
  <main class="flex flex-col gap-4 container mx-auto">
    <template
      v-for="user in snapshot.context.data"
      :key="user._id"
    >
      <Card>
        <CardHeader>
          <CardTitle>{{ user.firstname }} {{ user.lastname }}</CardTitle>
          <CardDescription>{{ user.email }}</CardDescription>
          <CardDescription>{{ user.organisation?.name }}</CardDescription>
        </CardHeader>
      </Card>
    </template>
    <PaginationActor
      v-if="paginationMachineRef"
      :pagination-actor-ref="paginationMachineRef"
    />
  </main>
</template>
