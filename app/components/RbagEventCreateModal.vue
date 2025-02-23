<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { parseDate } from '@internationalized/date'
import { registrationSchema } from '~~/validation/eventSchema'
import { createEventRegistration } from '~/services/events'

const { id } = useRoute().params

const formSchema = toTypedSchema(registrationSchema)

const { handleSubmit, values, setFieldValue } = useForm({
  validationSchema: formSchema,
  initialValues: {
    lateRegistration: false,
    startDate: new Date(),
    endDate: new Date()
  }
})

const onSubmit = handleSubmit(async (values) => {
  if (!id) return
  await createEventRegistration(id.toString(), values)
})
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
        <UiDialogTitle>Edit profile</UiDialogTitle>
        <UiDialogDescription>
          Make changes to your profile here. Click save when you're done.
        </UiDialogDescription>
      </UiDialogHeader>
      <pre>{{ values }}</pre>
      <form
        class="flex flex-col gap-4"
      >
        <div>
          <UiLabel>Zeitraum</UiLabel>
          <UiDateRangePicker
            :model-value="{
              start: parseDate(values.startDate?.toISOString().substring(0, 10)!),
              end: parseDate(values.endDate?.toISOString().substring(0, 10)!)
            }"
            @update:model-value="(e) => {
              if (e.start && e.end) {
                setFieldValue('startDate', new Date(e.start.toString()))
                setFieldValue('endDate', new Date(e.end.toString()))
              }
            }"
          />
        </div>
        <UiFormField
          v-slot="{ value, handleChange }"
          name="isPublished"
        >
          <UiFormItem>
            <UiFormLabel>Veröffentlicht</UiFormLabel>
            <UiFormControl>
              <div>
                <UiSwitch
                  :model-value="value"
                  @update:model-value="handleChange"
                />
              </div>
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
        <UiFormField
          v-slot="{ value, handleChange }"
          name="lateRegistration"
        >
          <UiFormItem>
            <UiFormLabel>Anmeldung nach Zeitraum erlauben</UiFormLabel>
            <UiFormControl>
              <div>
                <UiSwitch
                  :model-value="value"
                  @update:model-value="handleChange"
                />
              </div>
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
        <UiFormField
          v-slot="{ componentField }"
          name="confirmationText"
          :validate-on-model-update="false"
        >
          <UiFormItem>
            <UiFormLabel>Bestätigungstext</UiFormLabel>
            <UiFormControl dynamic-vaidation>
              <UiInput
                type="text"
                placeholder="Danke für deine Buchung..."
                v-bind="componentField"
                data-1p-ignore
              />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
        <UiFormField
          v-slot="{ componentField }"
          name="fromPDFDownloadLink"
          :validate-on-model-update="false"
        >
          <UiFormItem>
            <UiFormLabel>Download URL Anmeldeformular</UiFormLabel>
            <UiFormControl dynamic-vaidation>
              <UiInput
                type="text"
                placeholder="https://example.com"
                v-bind="componentField"
                data-1p-ignore
              />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
        <UiFormField
          v-slot="{ componentField }"
          name="singleRoomSurcharge"
          :validate-on-model-update="false"
        >
          <UiFormItem>
            <UiFormLabel>Zuzahlung Einzelzimmer</UiFormLabel>
            <UiFormControl dynamic-vaidation>
              <UiInput
                type="number"
                placeholder="12 EUR"
                v-bind="componentField"
                data-1p-ignore
              />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
      </form>

      <UiDialogFooter>
        <UiButton type="submit">
          Confirm
        </UiButton>
      </UiDialogFooter>
    </UiDialogContent>
  </UiDialog>
</template>
