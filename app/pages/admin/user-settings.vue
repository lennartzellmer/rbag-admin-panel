<script setup lang="ts">
const { user } = useUserSession()

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 5) return `Gute Nacht,`
  if (hour < 12) return `Guten Morgen,`
  if (hour < 18) return `Guten Tag,`
  return `Guten Abend`
})
</script>

<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar
        title="Dein Profil"
        :ui="{ right: 'gap-3' }"
      >
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div
        v-if="user"
        class="flex flex-col gap-4 p-8 rounded-2xl"
      >
        <div class="flex flex-col gap-1 pb-12">
          <h3 class="text-xl font-semibold text-slate-700 leading-5">
            {{ greeting }} <br>
            <span class="text-slate-950 text-6xl font-bold">
              {{ user.given_name }}
            </span>
          </h3>
          <h3 class="text-md text-gray-500">
            {{ user.email }}
          </h3>
        </div>
        <RbagUserProfileRoles
          :roles="Object.keys(user['urn:zitadel:iam:org:project:roles'])"
        />
        <RbagUserProfileImage :user-id="user.sub" />
      </div>
    </template>
  </UDashboardPanel>
</template>
