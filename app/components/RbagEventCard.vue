<script setup lang="ts">
import { parseAbsoluteToLocal, DateFormatter } from '@internationalized/date'
import type { Event } from '@prisma/client'
import type { SerializeObject } from 'nitropack'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { NuxtLink } from '#components'

defineProps<{
  event: SerializeObject<Event>
}>()
</script>

<template>
  <NuxtLink :to="`/admin/events/${event.id}`">
    <Card class=" max-w-3xl hover:bg-muted-foreground/5 transition-colors">
      <CardHeader>
        <CardTitle class="text-xl font-bold text-slate-800">
          {{ event.name }}
        </CardTitle>
      </CardHeader>

      <CardContent class="grid grid-cols-2 gap-2 items-end">
        <div class="flex flex-col gap-2">
          <p class="text-sm text-muted-foreground font-normal">
            {{ event.targetGroupDescription }}
          </p>
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
        </div>
        <RbagEventProgressBar :event-status="event.status" />
      </CardContent>
    </Card>
  </NuxtLink>
</template>
