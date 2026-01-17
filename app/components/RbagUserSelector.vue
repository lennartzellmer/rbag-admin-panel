<script setup lang="ts">
import type { User } from '~~/shared/validation/userSchema'

interface UserSelectItem extends User {
  label: string
  value: string
}

const selectedUsers = defineModel<UserSelectItem[]>({ default: () => [] })

interface Props {
  users: UserSelectItem[]
  loading?: boolean
}

const open = ref(false)

defineProps<Props>()

const removeUser = (userId: string) => {
  selectedUsers.value = selectedUsers.value.filter(user => user.id !== userId)
}
</script>

<template>
  <UFormField
    label="Leitung"
    name="voreinstellungen.leitung.userIds"
  >
    <USelectMenu
      v-model:model-value="selectedUsers"
      v-model:open="open"
      :items="users"
      variant="none"
      placeholder="Nutzer auswählen"
      :ui="{ content: 'min-w-fit', base: 'p-0' }"
      class="w-full mt-2"
      multiple
      :loading="loading"
      description-key:="email.email"
      :arrow="false"
      :trailing-icon="false"
      :content="{ position: 'popper', side: 'left' }"
    >
      <template #default>
        <UEmpty
          v-if="selectedUsers.length === 0"
          title="Keiner ausgewählt"
          class="w-full"
          :actions="[
            {
              label: 'Mitglied auswählen',
              variant: 'soft',
              icon: 'i-lucide-user-plus'
            }
          ]"
        />
        <div
          v-else
          class="grid gap-2 text-left divide-y divide-coffee-200 w-full"
        >
          <div
            v-for="user in selectedUsers"
            :key="user.id"
            class="p-4 border rounded-2xl border-coffee-200 hover:bg-coffee-100/50 flex justify-between items-center"
          >
            <UUser
              :name="`${user.givenName} ${user.familyName}`"
              :avatar="{
                src: user.media?.profileImage.objectName,
                icon: 'i-lucide-user'
              }"
              :description="user.email.email"
            />
            <UButton
              icon="i-lucide-x"
              size="md"
              variant="ghost"
              color="neutral"
              @click.prevent="() => { removeUser(user.id) }"
            />
          </div>
          <UButton
            icon="i-lucide-plus"
            label="Hinzufügen"
            class="place-self-start mt-2"
            variant="soft"
            color="neutral"
          />
        </div>
      </template>
      <template #item-label="{ item: user }">
        <UUser
          :name="`${user.givenName} ${user.familyName}`"
          :avatar="{
            src: user.media?.profileImage.objectName,
            icon: 'i-lucide-user'
          }"
          :description="user.email.email"
          size="xs"
        />
      </template>
      <template #content-bottom>
        <div class="p-2 flex justify-end">
          <UButton
            variant="outline"
            color="primary"
            size="sm"
            label="Fertig"
            @click="open = false"
          />
        </div>
      </template>
    </USelectMenu>
  </UFormField>
</template>
