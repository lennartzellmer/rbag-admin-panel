<script setup lang="ts">
import { CircleCheck, CircleDashed, CircleDot } from 'lucide-vue-next'
import { getEventStatusFromEvent, type EventStatus } from '~/lib/utils'
import type { RbagEvent } from '~~/validation/eventSchema'

const props = defineProps<{
  event: RbagEvent
}>()

const eventStatus = computed(() => getEventStatusFromEvent(props.event))

const eventLifeCycle: Array<{
  status: EventStatus
  title: string
}> = [
  {
    status: 'DRAFT',
    title: 'Entwurf'
  },
  {
    status: 'SAVE_THE_DATE',
    title: 'Save the Date'
  },
  {
    status: 'REGISTRATION_SCHEDULED',
    title: 'Registrierung geplant'
  },
  {
    status: 'REGISTRATION_OPEN',
    title: 'Registrierung offen'
  },
  {
    status: 'UPCOMING',
    title: 'Registrierung geschlossen'
  },
  {
    status: 'ONGOING',
    title: 'Läuft'
  },
  {
    status: 'COMPLETED',
    title: 'Abgeschlossen'
  }
]

const stepsWithDoneState = computed(() => {
  return eventLifeCycle.map((step, index) => {
    const currentStep = eventLifeCycle.findIndex(step => step.status === eventStatus.value)
    return {
      ...step,
      doneState: index < currentStep ? 'done' : index === currentStep ? 'inProgress' : 'pending'
    }
  })
})
</script>

<template>
  <div class="flex flex-col gap-3 items-end">
    <div
      v-if="eventStatus !== 'CANCELED'"
      class="flex flex-row gap-1"
    >
      <div
        v-for="(step, index) in stepsWithDoneState"
        :key="index"
        class="flex flex-row items-center gap-1"
      >
        <UiTooltipProvider :delay-duration="100">
          <UiTooltip>
            <UiTooltipTrigger>
              <div class="flex flex-col items-center gap-1">
                <CircleCheck
                  v-if="step.doneState === 'done'"
                  :class="'text-green-500'"
                />
                <CircleDot
                  v-if="step.doneState === 'inProgress' && eventStatus === 'DRAFT'"
                  class="text-yellow-500"
                />
                <CircleCheck
                  v-else-if="step.doneState === 'inProgress' && eventStatus === 'COMPLETED'"
                  class="text-green-500"
                />
                <CircleDot
                  v-else-if="step.doneState === 'inProgress'"
                  class=" text-blue-500"
                />
                <CircleDashed
                  v-if="step.doneState === 'pending'"
                  class="text-gray-300"
                />
              </div>
            </UiTooltipTrigger>
            <UiTooltipContent>
              {{ step.title }}
            </UiTooltipContent>
          </UiTooltip>
        </UiTooltipProvider>
        <UiSeparator
          v-if="index < stepsWithDoneState.length - 1"
          class="w-4"
          orientation="horizontal"
        />
      </div>
    </div>
  </div>
</template>
