<script setup lang="ts">
defineProps<{
  roles: string[]
}>()
</script>

<template>
  <UCard
    variant="subtle"
    class="self-start"
    :ui="{ body: 'flex flex-col gap-4' }"
  >
    <div>
      <div class="flex content-center items-center justify-between">
        <label
          class="block font-medium text-default"
        >Rollen</label>
      </div>
      <p
        class="text-muted text-sm"
      >
        Du hast die folgenden Superkräfte
      </p>
    </div>
    <div class="flex gap-1">
      <code
        v-for="role in roles"
        :key="role"
        class="px-1.5 py-0.5 text-xs font-mono font-medium rounded-md inline-block border border-secondary/25 bg-secondary/10 text-secondary"
      >
        {{ role.charAt(0).toUpperCase() + role.slice(1) }}
      </code>
    </div>
  </UCard>
</template>
