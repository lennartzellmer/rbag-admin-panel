<script setup lang="ts">
import { getCategories } from '~/services/categories'
import { getEvent } from '~/services/events'

const route = useRoute()
const { data: event } = await useAsyncData(route.params.id!.toString(), () => getEvent(route.params.id!.toString()))
const { data: categories } = await useAsyncData('categories', () => getCategories())
</script>

<template>
  <div class="flex flex-col gap-4 mx-auto py-10 px-4 sm:px-6 md:px-10">
    <RbagEventForm
      v-if="event && categories"
      :initial-event-data="event"
      :event-categories="categories.data"
    />
  </div>
</template>
