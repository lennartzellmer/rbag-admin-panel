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

const UAvatar = resolveComponent('UAvatar')
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
    header: 'Mitglied',
    cell: ({ row }) => {
      const fullName = `${row.original.givenName} ${row.original.familyName}`

      return h('div', { class: 'flex items-center gap-3' }, [
        h(UAvatar, {
          src: row.original.profileImage?.objectName,
          alt: fullName,
          size: 'lg'
        }),
        h('div', { class: 'flex flex-col' }, [
          h('p', { class: 'font-medium text-gray-900' }, fullName),
          h('p', { class: 'text-sm text-gray-500' }, row.original.email.email)
        ])
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
        variant: 'soft',
        size: 'md'
      })
    }
  },
  {
    accessorKey: 'userId',
    header: 'User ID'
  }
]
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold text-gray-900">
        Mitglieder
      </h1>
    </div>

    <UTable
      :data="tableData"
      :columns="columns"
      :loading="isLoading"
      empty="Keine Mitglieder gefunden"
      class="flex-1"
    />
  </div>
</template>
