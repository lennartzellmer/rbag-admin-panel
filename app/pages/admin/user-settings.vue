<script setup lang="ts">
import { getVeranstaltungsKategorienPaginated } from '../../service/veranstaltung-kategorie'

const test = await getVeranstaltungsKategorienPaginated()
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
      <pre>{{ test }}</pre>
    </template>
  </UDashboardPanel>
</template>
