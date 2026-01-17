<script setup lang="ts">
import type { ActorRefFromLogic } from 'xstate'
import type { categoryCreateMachine } from '~/machines/categoryMachine/categoryCreate.machine'
import type { VeranstaltungsKategorieCreateSchema } from '~~/shared/validation/veranstaltungKategorieSchema'

const form = useTemplateRef('form')

const emit = defineEmits<{
  (e: 'close'): void
}>()

const props = defineProps<{
  categoryCreateActorRef?: ActorRefFromLogic<typeof categoryCreateMachine>
  open: boolean
}>()

const onClose = (event: boolean) => {
  if (event === false) {
    emit('close')
  }
}

const handleSubmit = (state: VeranstaltungsKategorieCreateSchema) => {
  props.categoryCreateActorRef?.send({ type: 'SAVE', category: state })
}
</script>

<template>
  <USlideover
    title="Kategorie Hinzufügen"
    :open="open"
    :dismissible="false"
    @update:open="onClose"
  >
    <template #body>
      <RbagVeranstaltungsKategorieForm
        ref="form"
        @submit="handleSubmit"
      />
    </template>

    <template #footer>
      <div class="flex gap-2 justify-end w-full">
        <UButton
          color="primary"
          icon="i-lucide-plus"
          label="Kategorie hinzufügen"
          @click="form?.submit()"
        />
      </div>
    </template>
  </USlideover>
</template>
