<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { parseDate } from '@internationalized/date'
import type z from 'zod'
import { EventStatus } from '@prisma/client'
import { useMachine } from '@xstate/vue'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { DateRangePicker } from '~/components/ui/date-range-picker'
import { eventSchema } from '~~/validation/eventSchema'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
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

const statusOptions = Object.values(EventStatus).map((status) => {
  switch (status) {
    case EventStatus.CANCELED:
      return {
        value: EventStatus.CANCELED,
        label: 'Abgesagt'
      }
    case EventStatus.COMPLETED:
      return {
        value: EventStatus.COMPLETED,
        label: 'Abgeschlossen'
      }
    case EventStatus.REGISTRATION_CLOSED:
      return {
        value: EventStatus.REGISTRATION_CLOSED,
        label: 'Registrierung geschlossen'
      }
    case EventStatus.REGISTRATION_OPEN:
      return {
        value: EventStatus.REGISTRATION_OPEN,
        label: 'Registrierung läuft'
      }
    case EventStatus.REGISTRATION_SCHEDULED:
      return {
        value: EventStatus.REGISTRATION_SCHEDULED,
        label: 'Registrierung geplant'
      }
    case EventStatus.SAVE_THE_DATE:
      return {
        value: EventStatus.SAVE_THE_DATE,
        label: 'Save the Date'
      }
    case EventStatus.DRAFT:
      return {
        value: EventStatus.DRAFT,
        label: 'Entwurf'
      }
  }
})
</script>

<template>
  <form
    class="flex flex-col gap-4"
  >
    <FormField
      v-slot="{ componentField }"
      name="name"
      :validate-on-model-update="false"
    >
      <FormItem>
        <FormLabel>Veranstaltungsname</FormLabel>
        <FormControl dynamic-vaidation>
          <Input
            type="text"
            placeholder="Name..."
            v-bind="componentField"
            data-1p-ignore
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField
      v-slot="{ componentField }"
      name="abbreviation"
      :validate-on-model-update="false"
    >
      <FormItem>
        <FormLabel>Abkürzung</FormLabel>
        <FormControl dynamic-vaidation>
          <Input
            type="text"
            placeholder="SMS12"
            v-bind="componentField"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField
      v-slot="{ componentField }"
      name="status"
    >
      <FormItem>
        <FormLabel>Status</FormLabel>
        <FormControl>
          <Select v-bind="componentField">
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Status wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem
                    v-for="statusOption in statusOptions"
                    :key="statusOption.value"
                    :value="statusOption.value"
                  >
                    {{ statusOption.label }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </FormControl>
          </Select>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <div>
      <Label>Zeitraum</Label>
      <DateRangePicker
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
    <FormField
      v-slot="{ componentField }"
      name="targetGroupDescription"
      :validate-on-model-update="false"
    >
      <FormItem>
        <FormLabel>Zielgruppe</FormLabel>
        <FormControl dynamic-vaidation>
          <Textarea
            v-bind="componentField"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField
      v-slot="{ componentField }"
      name="categoryId"
    >
      <FormItem>
        <FormLabel>Kategorie</FormLabel>
        <FormControl>
          <Select v-bind="componentField">
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Kategorie wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem
                    v-for="eventCategory in eventCategories"
                    :key="eventCategory.id!"
                    :value="eventCategory.id!"
                  >
                    {{ eventCategory.name }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </FormControl>
          </Select>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
  </form>
</template>
