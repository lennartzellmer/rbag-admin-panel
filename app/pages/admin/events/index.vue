<script setup lang="ts">
import { useActor, useSelector } from '@xstate/vue'
import { createFetchPaginatedMachine } from '~/machines/fetchPaginated/fetchPaginated.machine.js'
import { getEvents } from '~/services/api.js'

const machine = createFetchPaginatedMachine({ fetchDataFunction: getEvents })
const { actorRef, snapshot } = useActor(machine)
const paginationMachineRef = useSelector(actorRef, state => state.context.paginationMachineRef)
</script>

<template>
  <main class="flex flex-col gap-4 container mx-auto">
    <template
      v-for="event in snapshot.context.data"
      :key="event._id"
    >
      <pre>{{ event }}</pre>
      <RbagEventCard :event="event" />
    </template>
    <PaginationActor
      v-if="paginationMachineRef"
      :pagination-actor-ref="paginationMachineRef"
    />
  </main>
</template>
