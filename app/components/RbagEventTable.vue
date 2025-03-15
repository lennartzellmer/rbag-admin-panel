<script setup lang="ts">
import type { RbagEvent } from '~~/validation/eventSchema'

defineProps<{
  events: RbagEvent[]
}>()
</script>

<template>
  <div class="relative flex grow flex-col">
    <table
      aria-label="Veranstaltungen"
      class="border-separate border-spacing-y-2 self-stretch "
    >
      <thead class="sr-only hidden">
        <tr class="whitespace-nowrap">
          <th
            scope="col"
            class="px-6 py-2 text-left text-sm font-semibold text-teal-700"
          >
            Name
          </th>
          <th
            scope="col"
            class="px-6 py-2 text-left text-sm font-semibold text-teal-700"
          >
            Tags
          </th>
          <th
            scope="col"
            class="px-6 py-2 text-left text-sm font-semibold text-teal-700"
          >
            State
          </th>
        </tr>
      </thead>
      <tbody>
        <RbagEvent
          v-for="(event, index) in events"
          :key="index"
          :event="event"
        />
      </tbody>
    </table>
  </div>
</template>
