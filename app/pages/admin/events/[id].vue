<script setup lang="ts">
import type { IEvent } from '~~/server/models/Event'

const route = useRoute()
const id = computed(() => route.params.id)

const { data } = await useFetch<IEvent>('/api/events/' + id.value)
</script>

<template>
  <div>
    <pre>{{ route }}</pre>
    <pre>{{ data }}</pre>
  </div>
</template>
