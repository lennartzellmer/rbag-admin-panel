<script setup lang="ts">
import { CalendarPlus } from 'lucide-vue-next'
import { addEventRegistration } from '~/services/events'
import type { RegistrationSchema } from '~~/validation/eventSchema'

const props = defineProps<{
  eventId: string
}>()

const emit = defineEmits<{
  added: [registration: RegistrationSchema]
}>()

const modalOpen = ref(false)

const onSubmit = async (values: RegistrationSchema) => {
  try {
    const eventRegistration = await addEventRegistration(props.eventId, values)
    emit('added', eventRegistration)
    modalOpen.value = false
  }
  catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <UiDialog v-model:open="modalOpen">
    <UiDialogTrigger>
      <div
        class="flex items-center flex-col gap-4 hover:bg-gray-50 border-dashed border border-gray-200 p-8 rounded-lg"
      >
        <CalendarPlus class="text-slate-500 size-12" />
        <p class="text-gray-500 text-sm">
          Es wurde noch keine Registrierung für diese Veranstaltung erstellt.
        </p>
        <UiButton
          as="div"
          variant="secondary"
        >
          Registrierung hinzufügen
        </UiButton>
      </div>
    </UiDialogTrigger>
    <UiDialogContent>
      <UiDialogHeader>
        <UiDialogTitle>Veranstaltung erstellen</UiDialogTitle>
        <UiDialogDescription>
          Details wie Ort, Registrierung und Aufführung können später hinzugefügt werden.
        </UiDialogDescription>
      </UiDialogHeader>
      <UiSeparator />
      <RbagFormEventRegistration
        :submit-label="'Veranstaltung erstellen'"
        @submit="onSubmit"
      />
    </UiDialogContent>
  </UiDialog>
</template>
