<script setup lang="ts">
import { getCategories } from '~/services/categories'
import { createEventDraft } from '~/services/events'
import type { EventSchema } from '~~/validation/eventSchema'

const { data: eventCategories } = await useAsyncData('categories', () => getCategories())

const onSubmit = async (values: EventSchema) => {
  try {
    const event = await createEventDraft(values)
    navigateTo(`/admin/events/${event.id}`)
  }
  catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <UiDialog>
    <UiDialogTrigger>
      <UiButton as="div">
        Veranstaltung erstellen
      </UiButton>
    </UiDialogTrigger>
    <UiDialogContent>
      <UiDialogHeader>
        <UiDialogTitle>Veranstaltungsentwurf erstellen</UiDialogTitle>
        <UiDialogDescription>
          Die Veranstaltung wird noch nicht veröffentlicht. Details wie Ort, Registrierung und Aufführung können später hinzugefügt werden.
        </UiDialogDescription>
      </UiDialogHeader>
      <UiSeparator />
      <RbagFormEventDetails
        v-if="eventCategories"
        :event-categories="eventCategories.data"
        :submit-label="'Veranstaltung erstellen'"
        @submit="onSubmit"
      />
    </UiDialogContent>
  </UiDialog>
</template>
