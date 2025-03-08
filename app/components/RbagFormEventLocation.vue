<script setup lang="ts">
import type { PartialDeep } from 'type-fest'
import type { useForm } from 'vee-validate'
import type { LocationSchema } from '~~/validation/eventSchema'

defineProps<{
  values: ReturnType<typeof useForm<PartialDeep<LocationSchema>>>['values']
  setFieldValue: ReturnType<typeof useForm<PartialDeep<LocationSchema>>>['setFieldValue']
}>()
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
        <UiFormLabel>Bestätigungstext</UiFormLabel>
        <UiFormControl dynamic-vaidation>
          <UiInput
            type="text"
            placeholder="Haus Altenberg"
            v-bind="componentField"
            data-1p-ignore
          />
        </UiFormControl>
        <UiFormMessage />
      </UiFormItem>
    </UiFormField>
    <UiFormField
      v-slot="{ componentField }"
      name="line1"
      :validate-on-model-update="false"
    >
      <UiFormItem>
        <UiFormLabel>Straße und Hausnummer</UiFormLabel>
        <UiFormControl dynamic-vaidation>
          <UiInput
            type="text"
            placeholder="Musterstraße 123"
            v-bind="componentField"
            data-1p-ignore
          />
        </UiFormControl>
        <UiFormMessage />
      </UiFormItem>
    </UiFormField>
    <UiFormField
      v-slot="{ componentField }"
      name="line2"
      :validate-on-model-update="false"
    >
      <UiFormItem>
        <UiFormLabel>Straße und Hausnummer</UiFormLabel>
        <UiFormControl dynamic-vaidation>
          <UiInput
            type="text"
            placeholder="Stadt"
            v-bind="componentField"
            data-1p-ignore
          />
        </UiFormControl>
        <UiFormMessage />
      </UiFormItem>
    </UiFormField>
    <UiFormField
      v-slot="{ componentField }"
      name="postalCode"
      :validate-on-model-update="false"
    >
      <UiFormItem>
        <UiFormLabel>Postleitzahl</UiFormLabel>
        <UiFormControl dynamic-vaidation>
          <UiInput
            type="text"
            placeholder="12345"
            v-bind="componentField"
            data-1p-ignore
          />
        </UiFormControl>
        <UiFormMessage />
      </UiFormItem>
    </UiFormField>
    <slot />
  </form>
</template>
