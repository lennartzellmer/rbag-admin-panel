<script setup lang="ts">
import type { BadgeVariants } from '~/components/ui/badge'
import { Badge } from '~/components/ui/badge'
import type { EventSchema } from '~~/validation/eventSchema'

const props = defineProps<{
  event: EventSchema
}>()

const badgeDetails = computed<{
  status: string
  badgeVariant?: BadgeVariants['variant']
}>(() => {
  switch (props.event.status) {
    case 'DRAFT':
      return {
        status: 'Draft',
        badgeVariant: 'yellow'
      }
    case 'SAVE_THE_DATE':
      return {
        status: 'Save the Date',
        badgeVariant: 'blue'
      }
    case 'REGISTRATION_SCHEDULED':
      return {
        status: 'Registrierung geplant',
        badgeVariant: 'blue'
      }
    case 'REGISTRATION_OPEN':
      return {
        status: 'Registrierung läuft',
        badgeVariant: 'blue'
      }
    case 'REGISTRATION_CLOSED':
      return {
        status: 'Registrierung geschlossen',
        badgeVariant: 'red'
      }
    case 'COMPLETED':
      return {
        status: 'Abgeschlossen',
        badgeVariant: 'green'
      }
    case 'CANCELED':
      return {
        status: 'Abgesagt',
        badgeVariant: 'red'
      }
    default:
      return {
        status: 'Unknown',
        badgeVariant: 'gray'
      }
  }
})
</script>

<template>
  <Badge :variant="badgeDetails.badgeVariant">
    {{ badgeDetails.status }}
  </badge>
</template>
