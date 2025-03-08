<script setup lang="ts">
import { useForm } from 'vee-validate'
import { parseDate } from '@internationalized/date'
import type { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import type { EventSchema } from '~~/validation/eventSchema'
import type { categorySchema } from '~~/validation/categorySchema'
import { eventSchema } from '~~/validation/eventSchema'

const props = defineProps<{
  eventCategories: z.infer<typeof categorySchema>[]
  initialData?: EventSchema
  submitLabel?: string
}>()

const emit = defineEmits<{
  submit: [event: EventSchema]
}>()

const formSchema = toTypedSchema(eventSchema)

const { handleSubmit, values, setFieldValue } = useForm({
  validationSchema: formSchema,
  initialValues: {
    startDate: new Date(),
    endDate: new Date(),
    ...props.initialData
  }
})

const onSubmit = handleSubmit(async (values) => {
  emit('submit', values)
})
</script>

<template>
  <form class="flex flex-col">
    <div class="px-6 grid gap-4 grid-cols-3">
      <div class="grid gap-4 grid-cols-3 col-span-3">
        <UiFormField
          v-slot="{ componentField }"
          name="name"
          :validate-on-model-update="false"
        >
          <UiFormItem class="col-span-2">
            <UiFormLabel>Veranstaltungsname</UiFormLabel>
            <UiFormControl dynamic-vaidation>
              <UiInput
                type="text"
                placeholder="Name..."
                v-bind="componentField"
                data-1p-ignore
              />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
        <UiFormField
          v-slot="{ componentField }"
          name="abbreviation"
          :validate-on-model-update="false"
        >
          <UiFormItem>
            <UiFormLabel>Abkürzung</UiFormLabel>
            <UiFormControl dynamic-vaidation>
              <UiInput
                type="text"
                placeholder="SMS12"
                v-bind="componentField"
              />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
      </div>
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
        v-slot="{ componentField }"
        name="targetGroupDescription"
        :validate-on-model-update="false"
      >
        <UiFormItem class="col-span-2">
          <UiFormLabel>Zielgruppe</UiFormLabel>
          <UiFormControl dynamic-vaidation>
            <UiTextarea
              v-bind="componentField"
            />
          </UiFormControl>
          <UiFormMessage />
        </UiFormItem>
      </UiFormField>
      <UiFormField
        v-slot="{ componentField }"
        name="categoryId"
      >
        <UiFormItem class="col-span-2">
          <UiFormLabel>Kategorie</UiFormLabel>
          <UiFormControl>
            <UiSelect v-bind="componentField">
              <UiFormControl>
                <UiSelectTrigger>
                  <UiSelectValue placeholder="Kategorie wählen" />
                </UiSelectTrigger>
                <UiSelectContent>
                  <UiSelectGroup>
                    <UiSelectItem
                      v-for="eventCategory in eventCategories"
                      :key="eventCategory.id!"
                      :value="eventCategory.id!"
                    >
                      {{ eventCategory.name }}
                    </UiSelectItem>
                  </UiSelectGroup>
                </UiSelectContent>
              </UiFormControl>
            </UiSelect>
          </UiFormControl>
          <UiFormMessage />
        </UiFormItem>
      </UiFormField>
    </div>
    <UiSeparator class="col-span-3 mt-6" />
    <div class="px-6 py-4 w-full flex justify-end">
      <UiButton @click="onSubmit">
        {{ props.submitLabel || 'Speichern' }}
      </UiButton>
    </div>
  </form>
</template>
