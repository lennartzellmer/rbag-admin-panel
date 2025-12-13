<script setup lang="ts">
import { veranstaltungsKategorieCreateSchema } from '~~/shared/validation/veranstaltungKategorieSchema'
import type { z } from 'zod'

type Schema = z.output<typeof veranstaltungsKategorieCreateSchema>

const state = reactive<Schema>({
  name: '',
  beschreibung: ''
})

const emit = defineEmits<{
  (e: 'submit', data: Schema): void
}>()
</script>

<template>
  <UForm
    :schema="veranstaltungsKategorieCreateSchema"
    :state="state"
    class="space-y-4 mt-8"
    @submit="emit('submit', state)"
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
  </UForm>
</template>
