<script setup lang="ts">
import { useActor, useSelector } from '@xstate/vue'
import { createFetchPaginatedMachine } from '~/machines/fetchPaginated/fetchPaginated.machine.js'
import { getEvents } from '~/services/events'

definePageMeta({
  layout: false
})

const machine = createFetchPaginatedMachine({ fetchDataFunction: getEvents })
const { actorRef, snapshot } = useActor(machine)
const paginationMachineRef = useSelector(actorRef, state => state.context.paginationMachineRef)
</script>

<template>
  <NuxtLayout name="admin">
    <template #header-action>
      <UiButton
        to="/admin/events/create"
        class="w-full sm:w-auto"
      >
        Create Event
      </UiButton>
    </template>

    <main class="flex flex-col gap-4 mx-auto py-10 px-4 sm:px-6 md:px-10">
      <RbagEventTable :events="snapshot.context.data" />
      <PaginationActor
        v-if="paginationMachineRef"
        :pagination-actor-ref="paginationMachineRef"
      />
    </main>
  </NuxtLayout>
</template>
