<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import { useMachine } from '@xstate/vue'
import { machine } from '~/machines/userProfileImageMachine/userProfileImage.machine'

defineProps<{
  collapsed?: boolean
}>()

const { user: authUser, clear } = useUserSession()

const user = ref({
  name: authUser.value?.name
})

const { snapshot } = useMachine(machine, {
  input: {
    userId: authUser.value!.sub!
  }
})

const items = computed<DropdownMenuItem[][]>(() => ([[
  {
    label: 'Log out',
    icon: 'i-lucide-log-out',
    onClick: () => {
      clear()
    }
  },
  {
    label: 'Settings',
    icon: 'i-lucide-settings',
    to: '/admin/user-settings'
  }
]]))
</script>

<template>
  <UDropdownMenu
    :items="items"
    :content="{ align: 'center', collisionPadding: 12 }"
    :ui="{ content: collapsed ? 'w-48' : 'w-(--reka-dropdown-menu-trigger-width)' }"
  >
    <UButton
      v-bind="{
        ...user,
        label: collapsed ? undefined : user?.name,
        trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down'
      }"
      :avatar="{
        class: snapshot.matches('showForm') ? 'bg-gradient-to-b from-primary-400 to-primary-600 text-on-primary' : undefined,
        size: 'md',
        src: snapshot.context.objectName
      }"
      color="neutral"
      variant="ghost"
      block
      :square="collapsed"
      class="data-[state=open]:bg-elevated"
      :ui="{
        trailingIcon: 'text-dimmed'
      }"
    />

    <template #chip-leading="{ item }">
      <span
        :style="{
          '--chip-light': `var(--color-${(item as any).chip}-500)`,
          '--chip-dark': `var(--color-${(item as any).chip}-400)`
        }"
        class="ms-0.5 size-2 rounded-full bg-(--chip-light) dark:bg-(--chip-dark)"
      />
    </template>
  </UDropdownMenu>
</template>
