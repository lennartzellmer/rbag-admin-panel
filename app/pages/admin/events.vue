<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import { LazyRbagVeranstaltungsKategorieSlideOverList } from '#components'

const overlay = useOverlay()

const slideover = overlay.create(LazyRbagVeranstaltungsKategorieSlideOverList)

const items = ref<DropdownMenuItem[]>([
  {
    label: 'Veranstaltungskategorien',
    icon: 'i-lucide-tags',
    onSelect: () => {
      slideover.open()
    }
  }
])
</script>

<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar
        title="Veranstaltungen"
      >
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <UDropdownMenu
            :items="items"
            :content="{
              align: 'start',
              side: 'bottom',
              sideOffset: 8
            }"
            :ui="{
              content: 'w-56'
            }"
          >
            <UButton
              icon="i-lucide-ellipsis"
              color="neutral"
              variant="ghost"
            />
          </UDropdownMenu>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-col gap-4 p-8 rounded-2xl">
        dhjkashska
      </div>
    </template>
  </UDashboardPanel>
</template>
