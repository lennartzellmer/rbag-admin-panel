<script setup lang="ts">
import { useMachine } from '@xstate/vue'
import { createBrowserInspector } from '@statelyai/inspect'
import { machine } from '~/machines/userProfileImageMachine/userProfileImage.machine'

const { inspect } = createBrowserInspector()

const props = defineProps<{
  userId: string
}>()

const { snapshot, send } = useMachine(machine, {
  inspect,
  input: {
    userId: props.userId
  }
})

const onFileChange = (file: File | null | undefined) => {
  if (!file) {
    send({ type: 'REMOVE_IMAGE' })
    return
  }
  send({ type: 'ADD_IMAGE', file })
}
</script>

<template>
  <div>
    <div class="relative group size-24">
      <UFileUpload
        v-if="snapshot.matches('noProfileImage')"
        :ui="{ base: 'border-none bg-transparent inset-0' }"
        @update:model-value="onFileChange"
      />
      <USkeleton
        v-if="snapshot.matches('uploadImage')"
        class="size-24 flex items-center justify-center"
      >
        <UIcon
          name="i-lucide-loader-circle"
          class="size-5 animate-spin"
        />
      </USkeleton>
      <NuxtImg
        v-if="snapshot.matches('showImage')"
        alt="Profile picture"
        width="100"
        height="100"
        class="rounded-2xl inset-0 block"
        :src="snapshot.context.url"
      />
    </div>
    <UButton
      active
      color="neutral"
      variant="outline"
      active-color="neutral"
      active-variant="ghost"
      @click="send({ type: 'REMOVE_IMAGE' })"
    >
      Bild entfernen
    </UButton>
  </div>
</template>
