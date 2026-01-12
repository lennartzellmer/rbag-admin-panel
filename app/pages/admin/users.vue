<script setup lang="ts">
import { getUsers } from '~/service/user'
import UserList from '~/components/users/UserList.vue'
import UserDetails from '~/components/users/UserDetails.vue'
import type { User } from '~~/shared/validation/userSchema'

const { data } = await useAsyncData('admin-users', () => getUsers())

const selectedUser = ref<User | null>()
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
      v-model="selectedUser"
      :users="data?.data"
    />
  </UDashboardPanel>
  <UserDetails
    v-if="selectedUser"
    :user="selectedUser"
    @close="selectedUser = null"
  />
  <div
    v-else
    class="flex items-center justify-center w-full"
  >
    <UEmpty
      icon="i-lucide-user-check"
      title="No user selected"
      description="Select a user from the list to view their details."
    />
  </div>
</template>
