<script setup lang="ts">
import type { SelectMenuItem } from '@nuxt/ui'

interface Props {
  roles: string[]
}

const props = defineProps<Props>()

const availableRoleDetails = [
  {
    label: 'User',
    value: 'user',
    disabled: true,
    description: 'Standardrolle für alle Benutzer. Kann nicht entfernt werden.'
  },
  {
    label: 'Admin',
    value: 'admin',
    disabled: false,
    description: 'Hat Zugriff auf das Admin-Dashboard und kann Benutzer verwalten.'
  },
  {
    label: 'Referent',
    value: 'referent',
    disabled: false,
    description: 'Leitet einen Workshop und kann seine Workshops verwalten.'
  }
] satisfies SelectMenuItem[]

const enrichedRoles = computed<SelectMenuItem[]>(() =>
  props.roles.map((role) => {
    const foundRole = availableRoleDetails.find(r => r.value === role)
    if (!foundRole) throw new Error(`Role "${role}" not found in availableRoles`)
    return foundRole
  })
)

const onUpdateModelValue = (r: SelectMenuItem[]) => {
  console.log(r)
}
</script>

<template>
  <div>
    <USelectMenu
      multiple
      :items="availableRoleDetails"
      icon="i-lucide-user"
      placeholder="Select user"
      class="w-48"
      :model-value="enrichedRoles"
      @update:model-value="onUpdateModelValue"
    />
  </div>
</template>
