<script setup lang="ts">
import { veranstaltungsKategorieCreateSchema } from '~~/shared/validation/veranstaltungKategorieSchema'
import type { VeranstaltungsKategorieCreateSchema } from '~~/shared/validation/veranstaltungKategorieSchema'

const form = useTemplateRef('form')

const props = defineProps<{
  initialState?: VeranstaltungsKategorieCreateSchema
}>()

const emit = defineEmits<{
  (e: 'submit', state: VeranstaltungsKategorieCreateSchema): void
}>()

const formState = reactive<VeranstaltungsKategorieCreateSchema>({
  name: '',
  beschreibung: '',
  ...props.initialState
})

const handleSubmit = () => {
  emit('submit', { ...formState })
}

defineExpose({
  submit: () => form.value?.submit()
})
</script>

<template>
  <UForm
    ref="form"
    :schema="veranstaltungsKategorieCreateSchema"
    :state="formState"
    class="space-y-4"
    @submit="handleSubmit"
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
