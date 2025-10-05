<script setup lang="ts">
const { user } = useUserSession()

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return `Guten Morgen, ${user?.value?.given_name}`
  if (hour < 18) return `Guten Tag, ${user?.value?.given_name}`
  return `Guten Abend, ${user?.value?.given_name}`
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
      <div class="flex gap-4">
        <RbagUserProfileImage :user-id="user!.sub" />
        <div class="flex flex-col gap-1">
          <h3 class="text-2xl font-semibold">
            {{ greeting }}
          </h3>
          <h3 class="text-md text-gray-500">
            {{ user?.email }}
          </h3>
          <div class="bg-gray-100 p-1 self-start rounded-md border-[0.5px] border-gray-200">
            <h3 class="text-md text-gray-500 sr-only">
              Rollen
            </h3>
            <div class="flex gap-1">
              <code
                v-for="role in user?.roles"
                :key="role"
                class="px-1.5 py-0.5 text-xs font-mono font-medium rounded-md inline-block border border-secondary/25 bg-secondary/10 text-secondary"
              >
                {{ role.charAt(0).toUpperCase() + role.slice(1) }}
              </code>
            </div>
          </div>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
