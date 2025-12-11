<script setup lang="ts">
interface Props {
  title: string
  description: string
}

defineProps<Props>()
defineEmits(['edit'])
</script>

<template>
  <div
    class="bg-coffee-100 p-6 rounded-lg flex justify-between"
  >
    <div>
      <h3 class="font-semibold text-base text-coffee-600">
        {{ title }}
      </h3>
      <p class="text-sm text-coffee-500">
        {{ description }}
      </p>
    </div>
    <div class="mt-4">
      <UButton
        variant="soft"
        color="primary"
        label="Bearbeiten"
        trailing-icon="i-lucide-chevron-right"
        @click="$emit('edit')"
      />
    </div>
  </div>
</template>
