<script setup lang="ts">
import type { SelectMenuItem } from '@nuxt/ui'
import { useMachine } from '@xstate/vue'
import { userRolesMachine } from '~/machines/userRoles/userRoles.machine'

const props = defineProps<
  { roles: string[], userId: string }
>()

const { snapshot, send } = useMachine(userRolesMachine, {
  input: {
    userId: props.userId,
    storedRoles: props.roles
  } })

const availableRoleDetails = [
  {
    label: 'Nutzer',
    value: 'user',
    disabled: true,
    description: 'Standardrolle. Kann nicht entfernt werden.'
  },
  {
    label: 'Admin',
    value: 'admin',
    disabled: false,
    description: 'Hat Zugriff auf alles.'
  },
  {
    label: 'Referent',
    value: 'referent',
    disabled: false,
    description: 'Leitet workshops und Veranstaltungen.'
  }
] as const satisfies SelectMenuItem[]

const enrichedRoles = computed({
  get() {
    return snapshot.value.context.localRoles.map((role) => {
      const foundRole = availableRoleDetails.find(r => r.value === role)
      if (!foundRole) throw new Error(`Role "${role}" not found in availableRoles`)
      return foundRole
    })
  },
  set(newValues: typeof availableRoleDetails) {
    send({ type: 'setRoles', roles: newValues.map(r => r.value) })
  }
})
</script>

<template>
  <div>
    <USelectMenu
      v-model="enrichedRoles"
      variant="soft"
      :loading="snapshot.matches('assigningRoles')"
      multiple
      :items="availableRoleDetails"
      placeholder="Select user"
      class="w-80"
      icon="i-lucide-shield-check"
    >
      <template #default="{ modelValue }">
        <div
          v-for="value in modelValue"
          :key="value.value"
          class="gap-1"
        >
          <UBadge
            variant="soft"
            :label="value.label"
            :ui="{ label: 'font-mono' }"
          />
        </div>
      </template>
    </USelectMenu>
  </div>
</template>
