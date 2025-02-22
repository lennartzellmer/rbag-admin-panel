<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { parseDate } from '@internationalized/date'
import type z from 'zod'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { DateRangePicker } from '~/components/ui/date-range-picker'
import { registrationSchema } from '~~/validation/eventSchema'
import { Switch } from '@/components/ui/switch'
import { createEventRegistration } from '~/services/events'

const props = defineProps<{
  initialRegistrationData: z.infer<typeof registrationSchema> | null
}>()

const { id } = useRoute().params

const formSchema = toTypedSchema(registrationSchema)

const { handleSubmit, values, setFieldValue } = useForm({
  validationSchema: formSchema,
  initialValues: {
    lateRegistration: false,
    startDate: new Date(),
    endDate: new Date(),
    ...props.initialRegistrationData
  }
})

const onSubmit = handleSubmit(async (values) => {
  if (!id) return
  await createEventRegistration(id.toString(), values)
})
</script>

<template>
  <form
    class="flex flex-col gap-4"
  >
    <div>
      <Label>Zeitraum</Label>
      <DateRangePicker
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
    <FormField
      v-slot="{ value, handleChange }"
      name="lateRegistration"
    >
      <FormItem>
        <FormLabel>Anmeldung nach Zeitraum erlauben</FormLabel>
        <FormControl>
          <div>
            <Switch
              :checked="value"
              @update:checked="handleChange"
            />
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
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
    <FormField
      v-slot="{ componentField }"
      name="singleRoomSurcharge"
      :validate-on-model-update="false"
    >
      <FormItem>
        <FormLabel>Zuzahlung Einzelzimmer</FormLabel>
        <FormControl dynamic-vaidation>
          <Input
            type="number"
            placeholder="12 EUR"
            v-bind="componentField"
            data-1p-ignore
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <Button @click="onSubmit">
      Speichern
    </Button>
  </form>
</template>
