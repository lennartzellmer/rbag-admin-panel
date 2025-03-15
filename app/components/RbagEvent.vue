<script lang="ts" setup>
import { DateFormatter } from '@internationalized/date'
import { BookOpenCheck, CalendarFold, MapPinned } from 'lucide-vue-next'
import type { RbagEvent } from '~~/validation/eventSchema'

defineProps<{
  event: RbagEvent
}>()

const router = useRouter()
</script>

<template>
  <tr
    class="cursor-pointer overflow-hidden transition-all duration-300 ease-in-out group"
    @click="router.push(`/admin/events/${event.id}`)"
  >
    <td
      class="border-y border-l border-gray-100 group-hover:bg-gray-50 group-hover:border-gray-200 bg-white items-start px-8 py-8 rounded-l-lg flex flex-col gap-2"
    >
      <span class="text-lg font-bold flex gap-2 items-center">
        <span>{{ event.name }}</span>
        <UiBadge variant="gray">
          {{ event.abbreviation }}
        </UiBadge>
      </span>
      <span class="text-sm text-muted-foreground font-normal">
        {{ event.targetGroupDescription }}
      </span>
      <RbagEventStatusBadge :event="event" />
    </td>

    <td class="border-y border-l border-gray-100 group-hover:bg-gray-50 group-hover:border-gray-200 bg-white px-5 py-6">
      <div class=" flex flex-col gap-2 items-start">
        <UiBadge variant="gray">
          <CalendarFold class="size-4 mr-2" />
          {{ new DateFormatter('de-DE', { dateStyle: 'short' }).format(event.startDate) }}
          →
          {{ new DateFormatter('de-DE', { dateStyle: 'short' }).format(event.endDate) }}
        </UiBadge>
        <UiBadge variant="gray">
          <BookOpenCheck class="size-4 mr-2" />
          <span v-if="event.registration">
            {{ new DateFormatter('de-DE', { dateStyle: 'short' }).format(event.registration.startDate) }} → {{ new DateFormatter('de-DE', { dateStyle: 'short' }).format(event.registration.endDate) }}
          </span>
          <span v-else>
            Registrierung Ausstehend
          </span>
        </UiBadge>
        <UiBadge variant="gray">
          <MapPinned class="size-4 mr-2" />
          <span v-if="event.location">
            {{ event.location.name }}
          </span>
          <span v-else>
            Ort ausstehend
          </span>
        </UiBadge>
      </div>
    </td>

    <td
      class="border-y border-r border-gray-100 group-hover:bg-gray-50 group-hover:border-gray-200 bg-white rounded-r-lg px-5 py-6"
    >
      <RbagEventProgressBar :event="event" />
    </td>
  </tr>
</template>
