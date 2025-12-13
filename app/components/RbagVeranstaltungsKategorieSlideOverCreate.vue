<script setup lang="ts">
import type { ActorRefFromLogic } from 'xstate'
import type { categoryCreateMachine } from '~/machines/categoryMachine/categoryCreate.machine'
import { veranstaltungsKategorieCreateSchema } from '~~/shared/validation/veranstaltungKategorieSchema'
import type { z } from 'zod'

const form = useTemplateRef('form')

type Schema = z.output<typeof veranstaltungsKategorieCreateSchema>

const formState = reactive<Schema>({
  name: '',
  beschreibung: ''
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

defineProps<{
  categoryCreateActorRef?: ActorRefFromLogic<typeof categoryCreateMachine>
  open: boolean
}>()

const onClose = (event: boolean) => {
  if (event === false) {
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
      <UForm
        ref="form"
        :schema="veranstaltungsKategorieCreateSchema"
        :state="formState"
        class="space-y-4 mt-8"
        @submit="categoryCreateActorRef?.send({ type: 'SAVE', category: formState })"
      >
        <UFormField
          label="Name"
          name="name"
        >
          <UInput
            v-model="formState.name"
            :ui="{ root: 'w-full' }"
          />
        </UFormField>

        <UFormField
          label="Beschreibung"
          name="beschreibung"
        >
          <UTextarea
            v-model="formState.beschreibung"
            :ui="{ root: 'w-full' }"
          />
        </UFormField>
      </UForm>
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
