<script setup lang="ts">
import { getCategories } from '~/services/categories'
import { getEvent } from '~/services/events'

const route = useRoute()
const { data: event } = await useAsyncData(route.params.id!.toString(), () => getEvent(route.params.id!.toString()))
const { data: categories } = await useAsyncData('categories', () => getCategories())
</script>

<template>
  <div class="grid grid-cols-2 gap-8 mx-auto py-10 px-4 sm:px-6 md:px-10">
    <div class="flex flex-col gap-4">
      <h2 class=" text-xl font-bold">
        Allgemein
      </h2>
      <RbagEventForm
        v-if="event && categories"
        :initial-event-data="event"
        :event-categories="categories.data"
      />
    </div>
    <div>
      <h2 class=" text-xl font-bold">
        Registrierung
      </h2>
    </div>
  </div>
</template>
