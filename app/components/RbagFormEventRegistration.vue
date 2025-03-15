<script setup lang="ts">
import { parseDate } from '@internationalized/date'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import type { RegistrationDetails } from '~~/validation/eventSchema'
import { RegistrationDetailsSchema } from '~~/validation/eventSchema'

const props = defineProps<{
  initialData?: RegistrationDetails | null
  submitLabel?: string
}>()

const emit = defineEmits<{
  submit: [event: RegistrationDetails]
}>()

const formSchema = toTypedSchema(RegistrationDetailsSchema)

const { handleSubmit, values, setFieldValue } = useForm({
  validationSchema: formSchema,
  initialValues: {
    lateRegistration: false,
    startDate: new Date(),
    endDate: new Date(),
    externalLink: null,
    participationFees: null,
    ...props.initialData
  }
})

const onSubmit = handleSubmit(async (values) => {
  emit('submit', values)
})
</script>

<template>
  <form>
    <div class="p-6 grid gap-6 grid-cols-3">
      <div class="col-span-2">
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
        name="lateRegistration"
      >
        <UiFormItem class="col-span-2 flex gap-4">
          <UiFormControl>
            <div>
              <UiSwitch
                :model-value="value"
                @update:model-value="handleChange"
              />
            </div>
          </UiFormControl>
          <UiFormLabel>Anmeldung nach Zeitraum erlauben</UiFormLabel>
          <UiFormMessage />
        </UiFormItem>
      </UiFormField>
      <UiSeparator class="col-span-3" />
      <UiFormField
        v-slot="{ componentField }"
        name="confirmationText"
        :validate-on-model-update="false"
      >
        <UiFormItem class="col-span-2">
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
        <UiFormItem class="col-span-2">
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
        <UiFormItem class="col-span-2">
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
    </div>
    <UiSeparator />
    <div class="px-6 py-4 w-full flex justify-end">
      <UiButton @click="onSubmit">
        {{ props.submitLabel || 'Speichern' }}
      </UiButton>
    </div>
  </form>
</template>
