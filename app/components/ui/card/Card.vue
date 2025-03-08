<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div
    :class="
      cn(
        'bg-gray-50 border border-gray-200 p-8 rounded-lg',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
