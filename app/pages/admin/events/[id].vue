<script setup lang="ts">
import { CalendarPlus } from 'lucide-vue-next'
import { getCategories } from '~/services/categories'
import { getEvent } from '~/services/events'

const route = useRoute()
const { data: event } = await useAsyncData(route.params.id!.toString(), () => getEvent(route.params.id!.toString()))
const { data: categories } = await useAsyncData('categories', () => getCategories())
</script>

<template>
  <div class="grid gap-6 max-w-screen-md mx-auto py-10 px-4 sm:px-6 md:px-10">
    <h2 class=" text-xl font-bold">
      Allgemein
    </h2>
    <div class="flex flex-col gap-4 bg-gray-50 border border-gray-200 p-8 rounded-lg">
      <RbagEventForm
        v-if="event && categories"
        :initial-event-data="event"
        :event-categories="categories.data"
      />
    </div>
    <h2 class=" text-xl font-bold mt-12">
      Registrierung
    </h2>
    <button
      v-if="!event?.registration"
      class="flex items-center flex-col gap-4 hover:bg-gray-50 border-dashed border border-gray-200 p-8 rounded-lg"
    >
      <CalendarPlus class="text-slate-500 size-12" />
      <p class="text-gray-500 text-sm">
        Es wurde noch keine Registrierung für diese Veranstaltung erstellt.
      </p>
      <Button
        as="div"
        variant="secondary"
      >
        Registrierung hinzufügen
      </Button>
    </button>
    <div
      v-else
      class="flex flex-col gap-4 bg-gray-50 border border-gray-200 p-8 rounded-lg"
    >
      <RbagEventRegistrationForm
        v-if="event"
        :initial-registration-data="event.registration"
      />
    </div>
  </div>
</template>
