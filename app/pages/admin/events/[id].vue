<script setup lang="ts">
import { getCategoriesParsed } from '~/services/categories'
import { getEventParsed } from '~/services/events'

const route = useRoute()
const { data: event } = await useAsyncData('hdjakshdkjas', () => getEventParsed(route.params.id!.toString()))
const { data: categories } = await useAsyncData('hdjakshdkj222as', () => getCategoriesParsed())
</script>

<template>
  <div class="flex flex-col gap-4 mx-auto py-10 px-4 sm:px-6 md:px-10">
    <pre>{{ event }}</pre>
    <RbagEventForm
      v-if="event && categories"
      :initial-event-data="event"
      :event-categories="categories.data"
    />
  </div>
</template>
