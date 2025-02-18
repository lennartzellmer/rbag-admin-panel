<script setup lang="ts">
import { getEventParsed } from '~/services/events'

const route = useRoute()
const { data } = await useAsyncData('hdjakshdkjas', () => getEventParsed(route.params.id!.toString()))
</script>

<template>
  <div class="flex flex-col gap-4 mx-auto py-10 px-4 sm:px-6 md:px-10">
    <RbagEventForm
      v-if="data"
      :initial-event-data="data"
    />
  </div>
</template>
