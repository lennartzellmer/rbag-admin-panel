<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

const links = [[{
  label: 'Home',
  icon: 'i-lucide-house',
  to: '/admin',
  onSelect: () => {
    open.value = false
  }
}]]

const open = ref(false)
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      collapsible
      resizable
      class="bg-elevated/25"
      :ui="{ footer: 'lg:border-t lg:border-default', root: 'pt-6' }"
    >
      <template #default="{ collapsed }">
        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[0]"
          orientation="vertical"
          tooltip
          popover
        />
      </template>
    </UDashboardSidebar>

    <NuxtPage />
  </UDashboardGroup>
</template>
