<script setup lang="ts">
import { Calendar, Music4 } from 'lucide-vue-next'

const data = {
  navMain: [
    {
      title: 'Veranstaltungen',
      items: [
        { title: 'Liste',
          url: '/admin/events',
          icon: Calendar
        },
        { title: 'Workshops',
          url: '#',
          icon: Music4
        }
      ]
    }
  ]
}
</script>

<template>
  <AuthState v-slot="{ loggedIn }">
    <template v-if="loggedIn">
      <UiSidebarProvider>
        <UiSidebar>
          <UiSidebarHeader>
            <UiSidebarMenu>
              <UiSidebarMenuItem>
                <UiNuxtLink
                  to="/admin"
                  class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground p-2 flex gap-3 items-center"
                >
                  <RbagLogo class="size-8" />
                  <div class="grid flex-1 text-left text-sm leading-tight">
                    <span class="truncate font-semibold">RBAG</span>
                    <span class="truncate text-xs">Veranstaltungsplaner</span>
                  </div>
                </UiNuxtLink>
              </UiSidebarMenuItem>
            </UiSidebarMenu>
          </UiSidebarHeader>

          <UiSidebarContent>
            <UiSidebarGroup
              v-for="item in data.navMain"
              :key="item.title"
            >
              <UiSidebarGroupLabel>{{ item.title }}</UiSidebarGroupLabel>
              <UiSidebarGroupContent>
                <UiSidebarMenu>
                  <UiSidebarMenuItem
                    v-for="subItem in item.items"
                    :key="subItem.title"
                  >
                    <UiSidebarMenuButton
                      as-child
                    >
                      <NuxtLink
                        :to="subItem.url"
                        active-class="font-semibold"
                      >
                        <component :is="subItem.icon" />
                        <span>{{ subItem.title }}</span>
                      </NuxtLink>
                    </UiSidebarMenuButton>
                  </UiSidebarMenuItem>
                </UiSidebarMenu>
              </UiSidebarGroupContent>
            </UiSidebarGroup>
          </UiSidebarContent>

          <RbagSidebarFooter />

          <UiSidebarRail />
        </UiSidebar>

        <UiSidebarInset>
          <header class="w-full z-50 bg-background flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <UiSidebarTrigger class="-ml-1" />
            <UiSeparator
              orientation="vertical"
              class="mr-2 h-4"
            />
            <RbagBreadcrump class=" shrink-0" />
            <div class="w-full flex justify-end pr-5">
              <slot name="header-action" />
            </div>
          </header>

          <UiScrollArea>
            <slot />
          </UiScrollArea>
        </UiSidebarInset>
      </UiSidebarProvider>
    </template>
    <template v-else>
      <div class="flex justify-center items-center h-screen">
        <UiButton
          variant="outline"
          as="a"
          href="/api/auth/linear"
        >
          Login
        </UiButton>
      </div>
    </template>
  </AuthState>
</template>
