<script setup lang="ts">
import { updateProfileImage, removeProfileImage, getUserById } from '~/service/user'

const value = ref(null)
const { user } = useUserSession()

const domainUser = await getUserById(user.value?.sub || '')

const onFileChange = (file: File | null | undefined) => {
  if (!user.value) {
    return
  }
  if (!file) {
    removeProfileImage(user.value.sub)
    return
  }
  updateProfileImage(user.value.sub, file)
}
</script>

<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar
        title="User Settings"
        :ui="{ right: 'gap-3' }"
      >
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <h2>User Settings</h2>
      <h3>Profile picture</h3>
      <pre>{{ domainUser }}</pre>
      <UFileUpload
        v-model="value"
        class="w-96 min-h-48"
        @update:model-value="onFileChange"
      />
    </template>
  </UDashboardPanel>
</template>
