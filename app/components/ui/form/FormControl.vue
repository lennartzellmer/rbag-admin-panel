<script lang="ts" setup>
import { Slot } from 'reka-ui'
import { useFormField } from './useFormField'

interface Props {
  dynamicVaidation?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  dynamicVaidation: false
})

const { error, formItemId, formDescriptionId, formMessageId, errors, handleChange } = useFormField()

const validationListeners = computed(() => {
  if (!props.dynamicVaidation) {
    return {}
  }
  // If the field is valid or have not been validated yet
  // lazy
  if (!errors.value.length) {
    return {
      blur: handleChange,
      change: handleChange,
      input: (e: Event) => handleChange(e, false)
    }
  }

  // Aggressive
  return {
    blur: handleChange,
    change: handleChange,
    input: handleChange // only switched this
  }
})
</script>

<template>
  <Slot
    :id="formItemId"
    :aria-describedby="!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`"
    :aria-invalid="!!error"
    v-on="validationListeners"
  >
    <slot />
  </Slot>
</template>
