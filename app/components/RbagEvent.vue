<script lang="ts" setup>
import type { SerializeObject } from 'nitropack'
import type { Event } from '@prisma/client'
import { parseAbsoluteToLocal, DateFormatter } from '@internationalized/date'

defineProps<{
  event: SerializeObject<Event>
}>()
</script>

<template>
  <tr
    class="cursor-pointer overflow-hidden transition-all duration-300 ease-in-out"
  >
    <td
      class="border-y border-l border-gray-100 bg-white pl-8 py-8 transition-all duration-300 ease-in-out rounded-l-lg flex flex-col gap-2"
    >
      <span class="text-lg font-bold">
        {{ event.name }}
      </span>
      <span class="text-sm text-muted-foreground font-normal">
        {{ event.targetGroupDescription }}
      </span>
    </td>

    <td class="border-y border-l border-gray-100 bg-white px-5 py-6">
      <div class="flex gap-2">
        <Badge variant="gray">
          {{ event.abbreviation }}
        </Badge>
        <Badge variant="gray">
          {{ new DateFormatter('de-DE', { dateStyle: 'short' }).format(parseAbsoluteToLocal(event.startDate).toDate()) }}
          →
          {{ new DateFormatter('de-DE', { dateStyle: 'short' }).format(parseAbsoluteToLocal(event.endDate).toDate()) }}
        </Badge>
      </div>
    </td>

    <td
      class="border-y border-r border-gray-100 bg-white rounded-r-lg px-5 py-6"
    >
      <RbagEventProgressBar :event-status="event.status" />
    </td>
  </tr>
</template>
