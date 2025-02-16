<script setup lang="ts">
const route = useRoute()
const id = computed(() => route.params.id)

const { data } = await useFetch(`/api/admin/events/${id.value}`)
</script>

<template>
  <div>
    <pre>{{ data?.registration }}</pre>
  </div>
</template>
