<script setup lang="ts">
import { LogOut, ChevronsUpDown } from 'lucide-vue-next'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const { user, clear } = useUserSession()

// Get the initials of the user's name
// If the user has no name, return an empty string
// If the user has only one name, return the first letter of the name
// If the user has two names, return the first letter of the first name and the first letter of the last name
function getInitials(name: string) {
  if (!name) return ''
  const names = name.trim().split(' ').filter(n => n.length > 0)
  if (names.length === 0) return ''
  if (names.length === 1) return names[0]?.charAt(0).toUpperCase() ?? ''
  return (names[0]?.charAt(0).toUpperCase() ?? '') + (names[names.length - 1]?.charAt(0).toUpperCase() ?? '')
}
</script>

<template>
  <SidebarFooter>
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <SidebarMenuButton
              size="lg"
              class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar class="h-8 w-8 rounded-lg">
                <AvatarFallback class="rounded-lg">
                  {{ getInitials(user?.name ?? '') }}
                </AvatarFallback>
              </Avatar>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">{{ user?.name }}</span>
                <span class="truncate text-xs">{{ user?.email }}</span>
              </div>
              <ChevronsUpDown class="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            class="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side="bottom"
            align="end"
            :side-offset="4"
          >
            <DropdownMenuGroup>
              <DropdownMenuItem @click="clear">
                <LogOut />
                Logout
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarFooter>
</template>
