<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

const links = [[
  {
    label: 'Veranstaltungen',
    icon: 'i-lucide-ticket',
    to: '/admin/events',
    onSelect: () => {
      open.value = false
    }
  },
  {
    label: 'Mitglieder',
    icon: 'i-lucide-users-round',
    to: '/admin/users',
    onSelect: () => {
      open.value = false
    }
  }
]]

const open = ref(false)
</script>

<template>
  <UDashboardGroup
    unit="rem"
    class=" bg-coffee-50"
  >
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      collapsible
      resizable
      class="bg-elevated/25"
      :ui="{
        footer: 'lg:border-t lg:border-default',
        root: 'pt-6',
        body: 'pt-6',
        header: 'h-auto'
      }"
    >
      <template #header="{ collapsed }">
        <RbagLogo
          v-if="!collapsed"
          class="h-8 w-auto shrink-0"
        />
        <div
          v-else
          class="bg-coffee-200 p-2 rounded-full border border-coffee-300"
        >
          <RbagLogoSmall
            class="size-5 text-primary mx-auto"
          />
        </div>
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[0]"
          orientation="vertical"
          tooltip
          popover
          :ui="{
            link: 'py-3'
          }"
        />
      </template>

      <template #footer="{ collapsed }">
        <RbagUserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>

    <NuxtPage />
  </UDashboardGroup>
</template>
