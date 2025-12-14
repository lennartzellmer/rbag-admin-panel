<script setup lang="ts">
import { veranstaltungsKategorieCreateSchema } from '~~/shared/validation/veranstaltungKategorieSchema'
import type { VeranstaltungsKategorieCreateSchema, VeranstaltungsKategorieSchema } from '~~/shared/validation/veranstaltungKategorieSchema'

const form = useTemplateRef('form')

const props = defineProps<{
  initialState?: VeranstaltungsKategorieCreateSchema
}>()

const emit = defineEmits<{
  (e: 'submit', state: VeranstaltungsKategorieCreateSchema): void
}>()

const createDefaultVoreinstellungen = (): VeranstaltungsKategorieSchema['voreinstellungen'] => ({
  zielgruppe: '',
  beschreibung: '',
  ort: {
    name: '',
    adresszeile1: undefined,
    adresszeile2: undefined,
    plz: undefined,
    ort: undefined,
    land: undefined
  },
  anzeigebild: {
    objectName: '',
    type: 'image'
  },
  leitung: {
    userIds: []
  }
})

const defaultVoreinstellungen = createDefaultVoreinstellungen()

const formState = reactive<VeranstaltungsKategorieCreateSchema>({
  name: props.initialState?.name ?? '',
  beschreibung: props.initialState?.beschreibung ?? '',
  voreinstellungen: {
    ...defaultVoreinstellungen,
    ...props.initialState?.voreinstellungen,
    ort: {
      ...defaultVoreinstellungen.ort,
      ...props.initialState?.voreinstellungen?.ort
    },
    anzeigebild: {
      ...defaultVoreinstellungen.anzeigebild,
      ...props.initialState?.voreinstellungen?.anzeigebild
    },
    leitung: {
      userIds: props.initialState?.voreinstellungen?.leitung?.userIds
        ? [...props.initialState.voreinstellungen.leitung.userIds]
        : [...defaultVoreinstellungen.leitung.userIds]
    }
  }
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
    class="space-y-6"
    @submit="handleSubmit"
  >
    <div class="space-y-4">
      <UFormField
        label="Kategoriename"
        name="name"
      >
        <UInput
          v-model="formState.name"
          :ui="{ root: 'w-full' }"
        />
      </UFormField>

      <UFormField
        label="Beschreibung der Kategorie"
        name="beschreibung"
      >
        <UTextarea
          v-model="formState.beschreibung"
          :ui="{ root: 'w-full' }"
        />
      </UFormField>
    </div>

    <USeparator />

    <RbagVeranstaltungsKategorieVoreinstellungenForm
      v-model="formState.voreinstellungen"
    />
  </UForm>
</template>
