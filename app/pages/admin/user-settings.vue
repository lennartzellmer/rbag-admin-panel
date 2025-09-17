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
      Body
    </template>
  </UDashboardPanel>
</template>
