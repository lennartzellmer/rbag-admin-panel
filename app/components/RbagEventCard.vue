<script setup lang="ts">
import { parseAbsoluteToLocal, DateFormatter } from '@internationalized/date'
import type { Event } from '@prisma/client'
import type { SerializeObject } from 'nitropack'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { NuxtLink } from '#components'
import type { BadgeVariants } from '@/components/ui/badge'

const props = defineProps<{
  event: SerializeObject<Event>
}>()

const status = computed((): {
  label: string
  tooltip: string
  variant: BadgeVariants['variant']
} => {
  switch (props.event.status) {
    case 'DRAFT': return {
      label: 'Entwurf',
      tooltip: 'Diese Veranstaltung ist noch in der Entwicklung und ist noch nicht veröffentlicht.',
      variant: 'yellow'
    }
    case 'SAVE_THE_DATE': return {
      label: 'Save the Date',
      tooltip: 'Wir wissen schaon das Datum, aber es fehlen noch Informationen die Registrierung zu öffnen.',
      variant: 'yellow'
    }
    case 'REGISTRATION_OPEN': return {
      label: 'Registrierung offen',
      tooltip: 'Dieses Event ist offen für die Registrierung.',
      variant: 'green'
    }
    case 'REGISTRATION_CLOSED': return {
      label: 'Registrierung geschlossen',
      tooltip: 'Die Registrierung ist abgeschlossen. Es ist keine Registrierung mehr möglich.',
      variant: 'red'
    }
    case 'CANCELED': return {
      label: 'Abgesagt',
      tooltip: 'Dieses Event ist abgesagt.',
      variant: 'red'
    }
    case 'COMPLETED': return {
      label: 'Abgeschlossen',
      tooltip: 'Dieses Event ist erfolgreich durchgeführt worden.',
      variant: 'green'
    }
    case 'REGISTRATION_SCHEDULED': return {
      label: 'Registrierung geplant',
      tooltip: 'Dieses Event hat eine geplante Registrierung.',
      variant: 'blue'
    }
    default: return {
      label: 'Unbekannt',
      tooltip: 'Dieses Event ist unbekannt.',
      variant: 'blue'
    }
  }
})
</script>

<template>
  <NuxtLink :to="`/${event.id}`">
    <Card class="hover:bg-muted-foreground/5 transition-colors">
      <CardHeader>
        <CardTitle class="text-xl font-bold text-slate-800">
          {{ event.name }}
        </CardTitle>
        <CardDescription>
          <p class="text-sm text-muted-foreground font-normal">
            {{ event.targetGroupDescription }}
          </p>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div class="flex gap-2">
          <Tooltip>
            <TooltipTrigger as-child>
              <Badge :variant="status.variant">
                {{ status.label }}
              </Badge>
            </TooltipTrigger>
            <TooltipContent side="top">
              {{ status.tooltip }}
            </TooltipContent>
          </Tooltip>
          <Badge variant="gray">
            {{ event.abbreviation }}
          </Badge>
          <Badge variant="blue">
            {{ new DateFormatter('de-DE', { dateStyle: 'short' }).format(parseAbsoluteToLocal(event.startDate).toDate()) }}
            →
            {{ new DateFormatter('de-DE', { dateStyle: 'short' }).format(parseAbsoluteToLocal(event.endDate).toDate()) }}
          </Badge>
        </div>
      </CardContent>
    </Card>
  </NuxtLink>
</template>
