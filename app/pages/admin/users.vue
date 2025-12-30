<script setup lang="ts">
import { computed, h, resolveComponent } from 'vue'
import type { SelectMenuItem, TableColumn } from '@nuxt/ui'
import { useMachine, useSelector } from '@xstate/vue'
import { createFetchPaginatedMachine } from '~/machines/fetchPaginated/fetchPaginated.machine'
import { getUsersPaginated } from '~/service/user'
import RbagPagination from '~/components/RbagPagination.vue'

// =============================================================================
// Types
// =============================================================================
type UserTableRow = Awaited<ReturnType<typeof getUsersPaginated>>['data'][number]

const UUser = resolveComponent('UUser')
const UBadge = resolveComponent('UBadge')
const RbagUserRoleSwitcher = resolveComponent('RbagUserRoleSwitcher')

const { snapshot, actorRef } = useMachine(createFetchPaginatedMachine<UserTableRow>({
  fetchDataFunction: getUsersPaginated
}))

const availableRoles: SelectMenuItem[] = [
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
] as const

const tableData = computed<UserTableRow[]>(() => snapshot.value.context.data ?? [])

const paginationMachineRef = useSelector(
  actorRef,
  state => state.context.paginationMachineRef
)

// =============================================================================
// Table columns
// =============================================================================
const columns: TableColumn<UserTableRow>[] = [
  {
    accessorKey: 'givenName',
    header: 'Name',
    cell: ({ row }) => {
      const fullName = `${row.original.givenName} ${row.original.familyName}`

      return h('div', { class: 'flex items-center gap-3' }, [
        h(UUser, {
          name: fullName,
          size: 'lg',
          description: row.original.email.email,
          avatar: {
            src: row.original.media?.profileImage.objectName,
            alt: fullName
          }
        })
      ])
    }
  },
  {
    id: 'rechte',
    header: 'Rollen',
    cell: ({ row }) => {
      return h(RbagUserRoleSwitcher, {
        roles: row.original.roles
      })
    }
  },
  {
    accessorKey: 'verifiedEmail',
    header: 'Email Bestätigt',
    cell: ({ row }) => {
      return h(UBadge, {
        label: row.original.email.isVerified ? 'Verifiziert' : 'Nicht verifiziert',
        color: row.original.email.isVerified ? 'success' : 'neutral',
        icon: row.original.email.isVerified ? 'i-lucide-check' : 'i-lucide-x',
        variant: 'subtle',
        size: 'md'
      })
    }
  }
]

const value = ref<SelectMenuItem>([availableRoles.find((r) => {
  if (!r) return false
  if (typeof r !== 'object') return false
  if (!Object.hasOwn(r, 'value')) return false
  return r.value === 'user'
})!])
</script>

<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar
        title="Mitglieder"
        :ui="{ right: 'gap-3' }"
      >
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-col gap-6">
        <pre>{{ value }}</pre>
        <UTable
          :data="tableData"
          :columns="columns"
          :loading="snapshot.matches('fetching')"
          empty="Keine Mitglieder gefunden"
          class="flex-1"
        />
        <RbagPagination
          v-if="paginationMachineRef"
          :pagination-actor-ref="paginationMachineRef"
        />
      </div>
    </template>
  </UDashboardPanel>
</template>
