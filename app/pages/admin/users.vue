<script setup lang="ts">
import { computed, h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import { useMachine } from '@xstate/vue'
import { createFetchPaginatedMachine } from '~/machines/fetchPaginated/fetchPaginated.machine'
import { getUsersPaginated } from '~/service/user'

// =============================================================================
// Types
// =============================================================================
type UserTableRow = {
  userId: string
  givenName: string
  familyName: string
  email: {
    email: string
    isVerified: boolean
  }
  profileImage?: {
    objectName: string
    type: 'image' | 'video' | 'audio'
  }
}

const UUser = resolveComponent('UUser')
const UBadge = resolveComponent('UBadge')

const { snapshot } = useMachine(createFetchPaginatedMachine<UserTableRow>({
  fetchDataFunction: getUsersPaginated
}))

const tableData = computed<UserTableRow[]>(() => snapshot.value.context.data ?? [])
const isLoading = computed(() =>
  snapshot.value.matches('fetching') || snapshot.value.matches('waitForInitialPagination')
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
            src: row.original.profileImage?.objectName,
            alt: fullName
          }
        })
      ])
    }
  },
  {
    id: 'verification',
    header: 'Verifizierung',
    cell: ({ row }) => {
      return h(UBadge, {
        label: row.original.email.isVerified ? 'Verifiziert' : 'Nicht verifiziert',
        color: row.original.email.isVerified ? 'primary' : 'neutral',
        variant: 'subtle',
        size: 'md'
      })
    }
  },
  {
    accessorKey: 'userId',
    header: 'User ID',
    cell: ({ row }) => {
      return h(UBadge, {
        label: row.original.email.isVerified ? 'Verifiziert' : 'Nicht verifiziert',
        color: row.original.email.isVerified ? 'primary' : 'neutral',
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
      <div class="flex flex-col gap-6">
        <UTable
          :data="tableData"
          :columns="columns"
          :loading="isLoading"
          empty="Keine Mitglieder gefunden"
          class="flex-1"
        />
      </div>
    </template>
  </UDashboardPanel>
</template>
