<script setup lang="ts">
import { EventStatus } from '@prisma/client'
import { CircleCheck, CircleDashed, CircleDot } from 'lucide-vue-next'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

const props = defineProps<{
  eventStatus: EventStatus
}>()

const eventLifeCycle = [
  {
    status: EventStatus.DRAFT,
    title: 'Entwurf'
  },
  {
    status: EventStatus.SAVE_THE_DATE,
    title: 'Save the Date'
  },
  {
    status: EventStatus.REGISTRATION_SCHEDULED,
    title: 'Registrierung geplant'
  },
  {
    status: EventStatus.REGISTRATION_OPEN,
    title: 'Registrierung offen'
  },
  {
    status: EventStatus.REGISTRATION_CLOSED,
    title: 'Registrierung geschlossen'
  },
  {
    status: EventStatus.COMPLETED,
    title: 'Abgeschlossen'
  }
]

const stepsWithDoneState = computed(() => {
  return eventLifeCycle.map((step, index) => {
    const currentStep = eventLifeCycle.findIndex(step => step.status === props.eventStatus)
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
      v-if="eventStatus !== EventStatus.CANCELED"
      class="flex flex-row gap-1"
    >
      <div
        v-for="(step, index) in stepsWithDoneState"
        :key="index"
        class="flex flex-row items-center gap-1"
      >
        <TooltipProvider :delay-duration="100">
          <Tooltip>
            <TooltipTrigger>
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
            </TooltipTrigger>
            <TooltipContent>
              {{ step.title }}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Separator
          v-if="index < stepsWithDoneState.length - 1"
          class="w-4"
          orientation="horizontal"
        />
      </div>
    </div>
    <Badge
      v-if="eventStatus === EventStatus.CANCELED"
      variant="red"
    >
      Abgesagt
    </Badge>
  </div>
</template>
