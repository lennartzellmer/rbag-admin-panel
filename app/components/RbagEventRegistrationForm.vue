<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { parseDate } from '@internationalized/date'
import type z from 'zod'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { DateRangePicker } from '~/components/ui/date-range-picker'
import { registrationSchema } from '~~/validation/eventSchema'

const props = defineProps<{
  initialRegistrationData: z.infer<typeof registrationSchema> | null
}>()

const formSchema = toTypedSchema(registrationSchema)

const { handleSubmit, values, setFieldValue } = useForm({
  validationSchema: formSchema,
  initialValues: props.initialRegistrationData || undefined
})

watch(values, () => {
  onSubmit()
}, { deep: true })

const onSubmit = handleSubmit((values) => {
  console.log(values)
})

//   startDate: z.coerce.date(),
//   endDate: z.coerce.date(),
//   fromPDFDownloadLink: z.string().min(1),
//   externalLink: z.string().min(1),
//   lateRegistration: z.boolean(),
//   confirmationText: z.string().min(1),
//   singleRoomSurcharge: z.number(),
//   participationFees: participationFeesSchema
</script>

<template>
  <form
    class="flex flex-col gap-4"
  >
    <FormField
      v-slot="{ componentField }"
      name="confirmationText"
      :validate-on-model-update="false"
    >
      <FormItem>
        <FormLabel>Bestätigungstext</FormLabel>
        <FormControl dynamic-vaidation>
          <Input
            type="text"
            placeholder="Danke für deine Buchung..."
            v-bind="componentField"
            data-1p-ignore
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField
      v-slot="{ componentField }"
      name="fromPDFDownloadLink"
      :validate-on-model-update="false"
    >
      <FormItem>
        <FormLabel>Download URL Anmeldeformular</FormLabel>
        <FormControl dynamic-vaidation>
          <Input
            type="text"
            placeholder="https://example.com"
            v-bind="componentField"
            data-1p-ignore
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <div>
      <Label>Zeitraum</Label>
      <DateRangePicker
        :model-value="{
          start: parseDate(values.startDate?.toISOString().substring(0, 10) || '2007-08-31'),
          end: parseDate(values.endDate?.toISOString().substring(0, 10)! || '2007-08-31')
        }"
        @update:model-value="(e) => {
          if (e.start && e.end) {
            setFieldValue('startDate', new Date(e.start.toString()))
            setFieldValue('endDate', new Date(e.end.toString()))
          }
        }"
      />
    </div>
  </form>
</template>
