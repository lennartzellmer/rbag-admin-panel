<script setup lang="ts">
import { updateProfileImage, removeProfileImage, getUserById } from '~/service/user'

const value = ref(null)
const { user } = useUserSession()

const userDetails = await getUserById(user.value?.sub || '')

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
      <h3>Profile picture2</h3>
      <pre>{{ user?.roles }}</pre>
      <NuxtImg
        v-if="userDetails.media"
        alt="Profile picture"
        width="100"
        height="100"
        class="rounded-2xl"
        :src="userDetails.media.profileImage.url"
      />

      <UFileUpload
        v-model="value"
        class="w-96 min-h-48"
        @update:model-value="onFileChange"
      />
    </template>
  </UDashboardPanel>
</template>
