<script setup lang="ts">
import type { User } from '~~/shared/validation/userSchema'

const props = defineProps<{
  user: User
}>()

const emits = defineEmits(['close'])
</script>

<template>
  <UDashboardPanel id="inbox-2">
    <template #header>
      <UDashboardNavbar
        :title="`${user.givenName} ${user.familyName} Details`"
        :toggle="false"
      >
        <template #leading>
          <UButton
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            class="-ms-1.5"
            @click="emits('close')"
          />
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <div class="max-w-2xl mx-auto">
        <UForm
          id="settings"
        >
          <UPageCard variant="subtle">
            <UFormField
              name="givenName"
              label="Vorname"
              description="Vorname des Benutzers"
              class="flex max-sm:flex-col justify-between items-start gap-4"
            >
              <UInput
                :model-value="user.givenName"
                autocomplete="off"
                disabled
              />
            </UFormField>
            <USeparator />
            <UFormField
              name="familyName"
              label="Nachname"
              description="Nachname des Benutzers"
              class="flex max-sm:flex-col justify-between items-start gap-4"
            >
              <UInput
                :model-value="user.familyName"
                autocomplete="off"
                disabled
              />
            </UFormField>
            <USeparator />
            <UFormField
              name="avatar"
              label="Avatar"
              description="Profilbild"
              class="flex max-sm:flex-col justify-between items-start gap-4"
            >
              <UAvatar
                :src="user.media?.profileImage.objectName"
                :alt="`${user.givenName} ${user.familyName}`"
                size="xl"
              />
            </UFormField>
            <USeparator />
            <UFormField
              name="email"
              label="E-Mail"
              description="E-Mail des Benutzers"
              class="flex max-sm:flex-col justify-between items-start gap-4"
            >
              <UInput
                :model-value="user.email.email"
                autocomplete="off"
                disabled
              />
            </UFormField>
            <USeparator />
            <UFormField
              name="roles"
              label="Rollen"
              description="Rollen des Benutzers"
              class="flex max-sm:flex-col justify-between items-start gap-4"
            >
              <RbagUserRoleSwitcher
                :user-id="user.id"
                :roles="user.roles"
              />
            </UFormField>
          </UPageCard>
        </UForm>
      </div>
    </template>
  </UDashboardPanel>
</template>
