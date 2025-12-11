<script setup lang="ts">
import { useMachine } from '@xstate/vue'
import { createEditCategoryMachine } from '~/machines/editCategory/editCategory.machine'
import { veranstaltungsKategorieUpdateSchema, type VeranstaltungsKategorieSchema } from '~~/shared/validation/veranstaltungKategorieSchema'
import type { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

interface Props {
  category: VeranstaltungsKategorieSchema
}
const props = defineProps<Props>()

type Schema = z.output<typeof veranstaltungsKategorieUpdateSchema>

const state = reactive<Partial<Schema>>({
  name: props.category.name,
  beschreibung: props.category.beschreibung
})

const { snapshot, send } = useMachine(createEditCategoryMachine())

async function onSubmit(event: FormSubmitEvent<Schema>) {
  send({
    type: 'SAVE',
    category: {
      ...props.category,
      ...event.data
    }
  })
}
</script>

<template>
  <UForm
    v-if="snapshot.matches('idle')"
    :schema="veranstaltungsKategorieUpdateSchema"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
  >
    <UFormField
      label="Name"
      name="name"
    >
      <UInput
        v-model="state.name"
        :ui="{ root: 'w-full' }"
      />
    </UFormField>

    <UFormField
      label="Beschreibung"
      name="beschreibung"
    >
      <UTextarea
        v-model="state.beschreibung"
        :ui="{ root: 'w-full' }"
      />
    </UFormField>

    <UButton type="submit">
      Speichern
    </UButton>
  </UForm>
</template>
