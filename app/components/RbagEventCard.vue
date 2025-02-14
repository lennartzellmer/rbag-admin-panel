<script setup lang="ts">
import { parseAbsoluteToLocal } from '@internationalized/date'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { NuxtLink } from '#components'
import type { IEventDocument } from '~~/server/models/Event'

defineProps<{
  event: IEventDocument
}>()
</script>

<template>
  <Card class="max-w-md mx-auto shadow-lg">
    <CardHeader>
      <CardTitle class="text-xl font-bold text-slate-800">
        {{ event.name }}
      </CardTitle>
      <CardDescription class="text-sm text-muted-foreground">
        <!-- Abbreviation with tooltip -->
        <span class="p-1 bg-muted rounded-md font-mono text-xs">{{ event.abbreviation }}</span>
      </CardDescription>
    </CardHeader>

    <CardContent class="space-y-2">
      <p>
        <strong>Status:</strong>
        <Tooltip>
          <TooltipTrigger as-child>
            <span class="cursor-help underline">{{ event.status }}</span>
          </TooltipTrigger>
          <TooltipContent side="top">
            Registration is currently open
          </TooltipContent>
        </Tooltip>
      </p>
      <p>
        <strong>Start Date:</strong> {{ parseAbsoluteToLocal(event.startDate) }}
      </p>
      <p>
        <strong>End Date:</strong> {{ parseAbsoluteToLocal(event.endDate) }}
      </p>
      <p>
        <strong>Target Group:</strong> {{ event.targetGroupDescription }}
      </p>

      <div
        v-if="event.location"
        class="mt-4"
      >
        <h4 class="font-semibold">
          Location
        </h4>
        <p><strong>Name:</strong> {{ event.location.name }}</p>
        <p>
          <strong>Address:</strong>
          {{ event.location.line1 }}, {{ event.location.line2 }}
        </p>
        <p><strong>Postal Code:</strong> {{ event.location.postalCode }}</p>
        <p><strong>Country:</strong> {{ event.location.countryCode }}</p>
      </div>
    </CardContent>

    <CardFooter>
      <Button
        :as="NuxtLink"
        :to="`/${event._id}`"
      >
        Details
      </Button>
    </CardFooter>
  </Card>
</template>
