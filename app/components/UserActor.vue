<script setup lang="ts">
defineProps<{
  user: IUser
}>()
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ user.firstname }} {{ user.lastname }}</CardTitle>
      <CardDescription>{{ user.email }}</CardDescription>
      <CardDescription>{{ user.organisation?.name }}</CardDescription>
    </CardHeader>
  </Card>
</template>
