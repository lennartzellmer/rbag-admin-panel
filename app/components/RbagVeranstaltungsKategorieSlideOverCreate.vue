<script setup lang="ts">
import { useSelector } from '@xstate/vue'
import type { ActorRefFromLogic } from 'xstate'
import type { categoryCreateMachine } from '~/machines/categoryMachine/categoryCreate.machine'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const props = defineProps<{
  categoryCreateActorRef?: ActorRefFromLogic<typeof categoryCreateMachine>
  open: boolean
}>()

const state = useSelector(props.categoryCreateActorRef, state => state)

const onClose = (event: boolean) => {
  if (!event) {
    emit('close')
  }
}
</script>

<template>
  <USlideover
    title="Kategorie Hinzufügen"
    :open="open"
    @update:open="onClose"
  >
    <template #body>
      <RbagKategorieFormCreate
        @submit="categoryCreateActorRef?.send({ type: 'SAVE', category: $event })"
      />
    </template>

    <template #footer>
      <div class="flex gap-2 justify-end w-full">
        <UButton
          color="primary"
          icon="i-lucide-plus"
          label="Hinzufügen"
        />
      </div>
    </template>
  </USlideover>
</template>
