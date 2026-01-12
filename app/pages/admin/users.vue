<script setup lang="ts">
import { computed, h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { getUsersPaginated } from '~/service/user'
import { getUsers } from '~/service/user'

// =============================================================================
// Types
// =============================================================================
type UserTableRow = Awaited<ReturnType<typeof getUsersPaginated>>['data'][number]

const UUser = resolveComponent('UUser')
const UBadge = resolveComponent('UBadge')
const RbagUserRoleSwitcher = resolveComponent('RbagUserRoleSwitcher')

const { data, pending } = await useAsyncData('admin-users', () => getUsers())

const tableData = computed<UserTableRow[]>(() => data.value?.data ?? [])

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
        roles: row.original.roles,
        userId: row.original.id
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
      <div class="flex flex-col border border-coffee-100 overflow-hidden rounded-2xl bg-white">
        <UTable
          :data="tableData"
          :columns="columns"
          :loading="pending"
          empty="Keine Mitglieder gefunden"
          class="flex-1"
          sticky
        />
      </div>
    </template>
  </UDashboardPanel>
</template>
