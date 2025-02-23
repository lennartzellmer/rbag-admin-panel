<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { parseDate } from '@internationalized/date'
import type z from 'zod'
import { useMachine } from '@xstate/vue'
import { eventSchema } from '~~/validation/eventSchema'
import type { categorySchema } from '~~/validation/categorySchema'
import { autoSaveEventMachine } from '~/machines/autoSaveEventMachine/autoSaveEventMachine.machine'

const props = defineProps<{
  initialEventData: z.infer<typeof eventSchema>
  eventCategories: z.infer<typeof categorySchema>[]
}>()

const formSchema = toTypedSchema(eventSchema)

const { handleSubmit, values, setFieldValue } = useForm({
  validationSchema: formSchema,
  initialValues: props.initialEventData
})

watch(values, () => {
  onSubmit()
}, { deep: true })

const { send } = useMachine(autoSaveEventMachine)

const onSubmit = handleSubmit((values) => {
  send({ type: 'user.edit', payload: { event: values } })
  console.log(values)
})
        value: EventStatus.SAVE_THE_DATE,
</script>

<template>
  <form
    class="flex flex-col gap-4"
  >
    <UiFormField
      v-slot="{ componentField }"
      name="name"
      :validate-on-model-update="false"
    >
      <UiFormItem>
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
    <div>
      <UiLabel>Zeitraum</UiLabel>
      <UiDateRangePicker
        :model-value="{
          start: parseDate(values.startDate?.toISOString().substring(0, 10) || '01-01-1990'),
          end: parseDate(values.endDate?.toISOString().substring(0, 10) || '01-01-1990')
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
      <UiFormItem>
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
      <UiFormItem>
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
  </form>
</template>
