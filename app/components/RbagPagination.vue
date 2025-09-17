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
  <UPagination
    :total="state.context.totalCount"
    :items-per-page="state.context.limit ?? 10"
    :default-page="state.context.currentPage"
    show-edges
    :sibling-count="1"
    @update:page="send({ type: 'GO_TO_TARGET_PAGE', targetPage: $event })"
  />
</template>
