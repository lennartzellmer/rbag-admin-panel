<script setup lang="ts">
import { Calendar, Music4 } from 'lucide-vue-next'
import { Separator } from '@/components/ui/separator'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarRail, SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

const data = {
  versions: ['1.0.1', '1.1.0-alpha', '2.0.0-beta1'],
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
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <NuxtLink
                  to="/admin"
                  class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground p-2 flex gap-3 items-center"
                >
                  <RbagLogo class="size-8" />
                  <div class="grid flex-1 text-left text-sm leading-tight">
                    <span class="truncate font-semibold">RBAG</span>
                    <span class="truncate text-xs">Veranstaltungsplaner</span>
                  </div>
                </NuxtLink>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup
              v-for="item in data.navMain"
              :key="item.title"
            >
              <SidebarGroupLabel>{{ item.title }}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem
                    v-for="subItem in item.items"
                    :key="subItem.title"
                  >
                    <SidebarMenuButton
                      as-child
                    >
                      <NuxtLink
                        :to="subItem.url"
                        active-class="font-semibold"
                      >
                        <component :is="subItem.icon" />
                        <span>{{ subItem.title }}</span>
                      </NuxtLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <RbagSidebarFooter />

          <SidebarRail />
        </Sidebar>

        <SidebarInset>
          <header class="w-full z-50 bg-background flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger class="-ml-1" />
            <Separator
              orientation="vertical"
              class="mr-2 h-4"
            />
            <RbagBreadcrump />
          </header>

          <ScrollArea>
            <NuxtPage />
          </ScrollArea>
        </SidebarInset>
      </SidebarProvider>
    </template>
    <template v-else>
      <div class="flex justify-center items-center h-screen">
        <Button
          variant="outline"
          as="a"
          href="/api/auth/linear"
        >
          Login
        </Button>
      </div>
    </template>
  </AuthState>
</template>
