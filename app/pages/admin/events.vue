<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'

const items = ref<TabsItem[]>([
  {
    label: 'Veranstaltungen',
    description: 'Alle Veranstaltungen verwalten',
    icon: 'i-lucide-ticket-check',
    slot: 'veranstaltungen' as const
  },
  {
    label: 'Kategorien',
    description: 'Alle Kategorien verwalten',
    icon: 'i-lucide-tags',
    slot: 'kategorien' as const
  }
])
</script>

<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar
        title="Veranstaltungen"
        :ui="{ right: 'gap-3' }"
      >
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-col gap-4 p-8 rounded-2xl">
        <UTabs
          color="neutral"
          variant="link"
          :content="false"
          :items="items"
          class="w-full"
          :ui="{ trigger: 'grow' }"
        />
      </div>
    </template>
  </UDashboardPanel>
</template>
