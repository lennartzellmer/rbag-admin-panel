<script setup lang="ts">
const route = useRoute()
const id = computed(() => route.params.id)

const { data } = await useFetch(`/api/events/${id.value}`)
</script>

<template>
  <div>
    <pre>{{ data }}</pre>
  </div>
</template>
