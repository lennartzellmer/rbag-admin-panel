<script setup lang="ts">
import { useMachine } from '@xstate/vue'
import { createFetchPaginatedMachine } from '~/machines/fetchPaginated/fetchPaginated.machine'
import { getUsersPaginated } from '~/service/user'

const { snapshot } = useMachine(createFetchPaginatedMachine({
  fetchDataFunction: getUsersPaginated
}))
</script>

<template>
  <div>
    <p>
      Mitglieder Page
    </p>
    <template v-if="snapshot.context.data">
      <div
        v-for="user in snapshot.context.data"
        :key="user.userId"
      >
        <p>{{ user.givenName }} {{ user.familyName }}</p>
        <p>{{ user.email.email }}</p>
        <UAvatar
          :src="user.profileImage?.objectName"
          size="3xl"
          :alt="`${user.givenName} ${user.familyName}`"
          class="rounded-none squircle"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
.squircle {
  mask-image: url("data:image/svg+xml,%3csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M100 0C20 0 0 20 0 100s20 100 100 100 100-20 100-100S180 0 100 0Z'/%3e%3c/svg%3e");
  mask-size: contain;
  mask-position: center;
  mask-repeat: no-repeat;
}
</style>
