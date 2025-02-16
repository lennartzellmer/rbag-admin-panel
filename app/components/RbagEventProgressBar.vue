<script setup lang="ts">
import { EventStatus } from '@prisma/client'
import { CircleCheck, CircleDashed, CircleDot } from 'lucide-vue-next'

const props = defineProps<{
  eventStatus: EventStatus
}>()

const eventLifeCycle = [
  {
    status: EventStatus.DRAFT,
    title: 'Entwurf',
    tooltip: 'Diese Veranstaltung ist noch in der Entwicklung und ist noch nicht veröffentlicht.'
  },
  {
    status: EventStatus.SAVE_THE_DATE,
    title: 'Save the Date',
    tooltip: 'Wir wissen schaon das Datum, aber es fehlen noch Informationen die Registrierung zu öffnen.'
  },
  {
    status: EventStatus.REGISTRATION_SCHEDULED,
    title: 'Registrierung geplant',
    tooltip: 'Dieses Event hat eine geplante Registrierung.'
  },
  {
    status: EventStatus.REGISTRATION_OPEN,
    title: 'Registrierung offen',
    tooltip: 'Dieses Event ist offen für die Registrierung.'
  },
  {
    status: EventStatus.REGISTRATION_CLOSED,
    title: 'Registrierung geschlossen',
    tooltip: 'Die Registrierung ist abgeschlossen. Es ist keine Registrierung mehr möglich.'
  },
  {
    status: EventStatus.COMPLETED,
    title: 'Abgeschlossen',
    tooltip: 'Dieses Event ist erfolgreich durchgeführt worden.'
  }
]

const currentStep = computed(() => {
  return eventLifeCycle.find(step => step.status === props.eventStatus) || { status: EventStatus.CANCELED, title: 'Abgesagt', tooltip: 'Dieses Event wurde abgesagt.' }
})

const badgeVariant = computed(() => {
  switch (props.eventStatus) {
    case EventStatus.DRAFT:
      return 'yellow'
    case EventStatus.CANCELED:
      return 'red'
    case EventStatus.COMPLETED:
      return 'green'
    default:
      return 'blue'
  }
})

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
    <Badge :variant="badgeVariant">
      {{ currentStep?.title }}
    </Badge>
    <div
      v-if="eventStatus !== EventStatus.CANCELED"
      class="flex flex-row gap-1"
    >
      <div
        v-for="(step, index) in stepsWithDoneState"
        :key="index"
        class="flex flex-row items-center gap-1"
      >
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
        <Separator
          v-if="index < stepsWithDoneState.length - 1"
          class="w-4"
          orientation="horizontal"
        />
      </div>
    </div>
  </div>
</template>
