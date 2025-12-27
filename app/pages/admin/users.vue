<script setup lang="ts">
import { computed, h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
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

const { snapshot, actorRef } = useMachine(createFetchPaginatedMachine<UserTableRow>({
  fetchDataFunction: getUsersPaginated
}))

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
    header: 'Rechte',
    cell: ({ row }) => {
      return h('div', { class: 'flex gap-2' }, row.original.roles.map((v, i) => {
        return h(UBadge, {
          key: i,
          label: v,
          color: row.original.email.isVerified ? 'primary' : 'neutral',
          variant: 'subtle',
          size: 'md'
        }, () => v)
      }))
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
      }, () => row.original.id)
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
