<script setup lang="ts">
import { getUsers } from '~/service/user'
import UserList from '~/components/users/UserList.vue'

const { data } = await useAsyncData('admin-users', () => getUsers())
</script>

<template>
  <UDashboardPanel
    id="inbox-1"
    :default-size="25"
    :min-size="20"
    :max-size="30"
    resizable
  >
    <UDashboardNavbar title="Mitglieder">
      <template #leading>
        <UDashboardSidebarCollapse />
      </template>
    </UDashboardNavbar>
    <UserList
      v-if="data"
      :users="data?.data"
    />
  </UDashboardPanel>
</template>
