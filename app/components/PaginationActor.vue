<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { useSelector } from '@xstate/vue'
import type { ActorRefFrom } from 'xstate'
import type { paginationMachine } from '~/machines/pagination/pagination.machine'

const props = defineProps<{
  paginationActorRef: ActorRefFrom<typeof paginationMachine>
}>()

const state = useSelector(props.paginationActorRef, state => state)

const send = props.paginationActorRef.send
</script>

<template>
  <Pagination
    v-slot="{ page }"
    :sibling-count="1"
    show-edges
    :total="state.context.totalCount"
    :items-per-page="state.context.limit"
    @update:page="send({ type: 'GO_TO_TARGET_PAGE', targetPage: $event })"
  >
    <PaginationList
      v-slot="{ items }"
      class="flex items-center gap-1"
    >
      <PaginationFirst />
      <PaginationPrev />

      <template v-for="(item, index) in items">
        <PaginationListItem
          v-if="item.type === 'page'"
          :key="index"
          :value="item.value"
          as-child
        >
          <Button
            class="w-10 h-10 p-0"
            :variant="item.value === page ? 'default' : 'outline'"
          >
            {{ item.value }}
          </Button>
        </PaginationListItem>
        <PaginationEllipsis
          v-else
          :key="item.type"
          :index="index"
        />
      </template>

      <PaginationNext />
      <PaginationLast />
    </PaginationList>
  </Pagination>
</template>
