<script setup lang="ts">
import { getCategories } from '~/services/categories'
import { getEvent } from '~/services/events'

const route = useRoute()
const { data: event, refresh } = await useAsyncData(route.params.id!.toString(), () => getEvent(route.params.id!.toString()))
const { data: eventCategories } = await useAsyncData('categories', () => getCategories())
</script>

<template>
  <div class="grid gap-6 max-w-screen-sm mx-auto py-10 px-4 sm:px-6 md:px-10">
    <UiCard
      v-if="event && event.registration && eventCategories"
      class="flex flex-col p-0"
    >
      <h2 class="text-xl font-semibold px-5 pt-5">
        Allgemein
      </h2>
      <RbagFormEventDetails
        :initial-data="event"
        :event-categories="eventCategories.data"
      />
    </UiCard>
    <RbagModalAddEventRegistration
      v-if="!event?.registration && event && event.id"
      :event-id="event.id"
      @added="refresh()"
    />
    <UiCard
      v-if="event && event.registration"
      class="flex flex-col p-0"
    >
      <h2 class="text-xl font-semibold px-5 pt-5">
        Registrierung
      </h2>
      <RbagFormEventRegistration
        :initial-data="event.registration"
      />
    </UiCard>
  </div>
</template>
