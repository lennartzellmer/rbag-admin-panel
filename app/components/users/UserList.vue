<script setup lang="ts">
import type { User } from '~~/shared/validation/userSchema'

const props = defineProps<{
  users: User[]
}>()

const usersRefs = ref<Element[]>([])

const selectedUser = defineModel<User | null>()

watch(selectedUser, () => {
  if (!selectedUser.value) {
    return
  }
  const ref = usersRefs.value.find(el => el.id === selectedUser.value?.id)
  if (ref) {
    ref.scrollIntoView({ block: 'nearest' })
  }
})

defineShortcuts({
  arrowdown: () => {
    const index = props.users.findIndex(user => user.id === selectedUser.value?.id)

    if (index === -1) {
      selectedUser.value = props.users[0]
    }
    else if (index < props.users.length - 1) {
      selectedUser.value = props.users[index + 1]
    }
  },
  arrowup: () => {
    const index = props.users.findIndex(user => user.id === selectedUser.value?.id)

    if (index === -1) {
      selectedUser.value = props.users[props.users.length - 1]
    }
    else if (index > 0) {
      selectedUser.value = props.users[index - 1]
    }
  }
})
</script>

<template>
  <UScrollArea
    v-if="users"
    v-slot="{ item }"
    :items="users"
    as="div"
    :ui="{
      viewport: 'overflow-y-auto divide-y divide-default'
    }"
  >
    <div
      :key="item.id"
      :ref="item.id"
    >
      <div
        class="p-4 sm:px-6 text-sm cursor-pointer border-l-2 transition-colors flex justify-between"
        :class="[
          selectedUser && selectedUser.id === item.id
            ? 'border-primary bg-primary/10'
            : 'border-bg hover:border-primary hover:bg-primary/5'
        ]"
        @click="selectedUser = item"
      >
        <UUser
          :name="`${item.givenName} ${item.familyName}`"
          :description="item.email.email"
          :avatar="{
            src: item.media?.profileImage.objectName,
            alt: `${item.givenName} ${item.familyName}`
          }"
        />
        <div class="flex gap-1 grow-0 self-center">
          <UBadge
            v-for="role in item.roles.filter(r => r !== 'user')"
            :key="role"
            variant="soft"
            size="sm"
            :label="role.charAt(0).toUpperCase() + role.slice(1)"
            :ui="{ label: 'font-mono' }"
          />
        </div>
      </div>
    </div>
  </UScrollArea>
</template>
