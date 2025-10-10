<script setup lang="ts">
import { useMachine } from '@xstate/vue'
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { machine } from '~/machines/userProfileImageMachine/userProfileImage.machine'

const form = useTemplateRef('form')

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const MIN_DIMENSIONS = { width: 200, height: 200 }
const MAX_DIMENSIONS = { width: 4096, height: 4096 }
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

const schema = z.object({
  profilbild: z
    .instanceof(File, {
      message: 'Bitte wähle ein Bild aus.'
    })
    .refine(file => file.size <= MAX_FILE_SIZE, {
      message: `Das Bild ist zu groß. Bitte wähle ein Bild kleiner als ${formatBytes(MAX_FILE_SIZE)}.`
    })
    .refine(file => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: 'Bitte lade ein gültiges Bild hoch (JPEG, PNG, oder WebP).'
    })
    .refine(
      file =>
        new Promise((resolve) => {
          const reader = new FileReader()
          reader.onload = (e) => {
            const img = new Image()
            img.onload = () => {
              const meetsDimensions
                = img.width >= MIN_DIMENSIONS.width
                  && img.height >= MIN_DIMENSIONS.height
                  && img.width <= MAX_DIMENSIONS.width
                  && img.height <= MAX_DIMENSIONS.height
              resolve(meetsDimensions)
            }
            img.src = e.target?.result as string
          }
          reader.readAsDataURL(file)
        }),
      {
        message: `Die Bildgröße ist ungültig. Bitte lade ein Bild zwischen ${MIN_DIMENSIONS.width}x${MIN_DIMENSIONS.height} und ${MAX_DIMENSIONS.width}x${MAX_DIMENSIONS.height} Pixel hoch.`
      }
    )
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  profilbild: undefined
})

const props = defineProps<{
  userId: string
}>()

const { snapshot, send } = useMachine(machine, {
  input: {
    userId: props.userId
  }
})

const onSubmit = (event: FormSubmitEvent<Schema>) => {
  console.log('event', event)
  send({ type: 'ADD_IMAGE', file: event.data.profilbild })
}
</script>

<template>
  <UCard
    variant="subtle"
    class="self-start"
    :ui="{ body: 'flex gap-8 items-center' }"
  >
    <span
      class="rounded-full size-32 relative bg-gradient-to-b from-primary-400 to-primary-600"
    >
      <NuxtImg
        v-if="snapshot.matches('showImage')"
        alt="Profile picture"
        width="400"
        height="400"
        class="rounded-full absolute inset-0"
        :src="snapshot.context.objectName!"
      />
    </span>
    <UForm
      v-if="snapshot.matches('showForm')"
      ref="form"
      class="flex gap-4"
      :state="state"
      :schema="schema"
      :validate-on="['change']"
      @submit="onSubmit"
    >
      <UFormField
        name="profilbild"
        label="Profilbild"
        description="JPG, GIF or PNG. 1MB Max."
      >
        <UFileUpload
          v-slot="{ open }"
          v-model="state.profilbild"
          accept="image/*"
          @update:model-value="form?.submit()"
        >
          <div class="flex flex-wrap items-center gap-3">
            <UButton
              label="Bild hochladen"
              color="neutral"
              variant="outline"
              :loading="snapshot.matches({ showForm: 'uploadImage' })"
              @click="open()"
            />
          </div>
        </UFileUpload>
      </UFormField>
    </UForm>
    <UForm
      v-if="snapshot.matches('showImage')"
    >
      <UFormField
        name="profilbild"
        label="Profilbild"
      >
        <UButton
          label="Bild löschen"
          color="neutral"
          variant="outline"
          size="xs"
          :loading="snapshot.matches({ showImage: 'removingImage' })"
          @click="send({ type: 'REMOVE_IMAGE' })"
        />
      </UFormField>
    </UForm>
  </UCard>
</template>
