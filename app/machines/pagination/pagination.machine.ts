import { assign, sendParent, setup, assertEvent } from 'xstate'
import type { MachineContext, MachineEvents, MachineInput } from './pagination.types'

const totalPages = (totalCount: number, limit: number) =>
  Math.ceil((totalCount || 0) / limit)

const currentPage = (offset: number, limit: number) =>
  Math.ceil(offset / limit) + 1

export const paginationMachine = setup({
  types: {
    input: {} as MachineInput,
    context: {} as MachineContext,
    events: {} as MachineEvents
  },
  actions: {
    sendPageUpdated: sendParent(({ context }) => ({
      type: 'PAGE_UPDATED',
      description: 'If a pagination machine is used as a child we inform the partent so that it can react on it. e.g. by fetching a new page',
      offset: context.offset,
      limit: context.limit
    })),
    goToPrevPage: assign({
      offset: ({ context }) => context.offset - context.limit
    }),
    goToNextPage: assign({
      offset: ({ context }) => context.offset + context.limit
    }),
    goToTargetPage: assign({
      offset: ({ context, event }) => {
        assertEvent(event, 'GO_TO_TARGET_PAGE')
        return (event.targetPage - 1) * context.limit
      }
    }),
    assignPagesToContext: assign({
      totalPages: ({ context }) => totalPages(context.totalCount!, context.limit),
      currentPage: ({ context }) => currentPage(context.offset, context.limit)
    }),
    assignTotalCount: assign({
      totalCount: ({ event }) => {
        assertEvent(event, 'UPDATE_TOTAL_COUNT')
        return event.totalCount
      }
    }),
    resetOffset: assign({
      offset: 0
    })
  },
  guards: {
    newTotalCountIsValid: ({ event, context }) => {
      assertEvent(event, 'UPDATE_TOTAL_COUNT')
      const currentPageAboveNewTotalPages = currentPage(context.offset, context.limit) > Math.ceil(event.totalCount / context.limit) + 1
      const valueIsPositive = event.totalCount >= 0
      return valueIsPositive && !currentPageAboveNewTotalPages
    },
    newTotalCountIsPositive: ({ event }) => {
      assertEvent(event, 'UPDATE_TOTAL_COUNT')
      return event.totalCount >= 0
    },
    canGoToNextPage: ({ context }) => {
      if (!totalPages(context.totalPages!, context.limit))
        return false
      return currentPage(context.offset, context.limit) < totalPages(context.totalCount!, context.limit)
    },
    canGoToPrevPage: ({ context }) => {
      return currentPage(context.offset, context.limit) > 1
    },
    targetPageIsWithinBounds: ({ context, event }) => {
      assertEvent(event, 'GO_TO_TARGET_PAGE')
      if (totalPages(context.totalCount!, context.limit) === 0)
        return true
      return (
        event.targetPage >= 1 && event.targetPage <= totalPages(context.totalCount, context.limit)
      )
    }
  }
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAcCGUCWA7VAXDA9lgLKoDGAFtmAMQCqACgCICCAKgKID6bA8mywAyXAMK86AOTYBtAAwBdRCgKwM+IkpAAPRAFoAjACYA7ADoAnIYDMsgBzmAbABZbx81YdWANCACeifVlZU0MHAFZjYzD9c31jcKsnAF8knzRMHHUSciosWkZWTh5+IVFxKWl9RSQQZBU1QixNHQRdJ30wkPd4xyNjIzCffwRrW1MHezc420CZpzCUtPRsPEbSSmpTDAgAG1oJDgANNi4GFgBxDjlq5VUs5sRE4PNZQKDDGdsw9qHEQ1kHKY4s5ZN0XoYOrZFrVlpk1jlNts9jQGAAlDgANVOFyuCk0dTujQeCEShhCDlkVheFNkYUSTl+CAc1lMX0cVkMYWs0Tp0PSKyy61yYC2u1o514xR4LFRlxOZ0u13x9XuNRaukSnX0NKsVmMtnm-QBjOZVlZYXZnO5HSsKVSICwBAgcHxsNWRCF1GVhI0ar0TmMZNk1lk7Wpnn0+kZRlM8QixisYVstkpHkpfLdgoReVMqAA7qgGlgoGwCLhUDsRAQAK5YXDehq+0DqpyGJymYM2MMAiNRvwBfRmiHJmbmb4UhwOYwZjLu7IbHNIsAN1XNxDhWO0xNGZmB2nGRlOUGmFzmWx6wyGRxhWQJu1JIA */
  id: 'paginationMachine',
  initial: 'awaitingTotalCount',
  context: ({ input }) => ({
    limit: input.initialLimit,
    offset: input.initialOffset,
    currentPage: Math.ceil(input.initialOffset / input.initialLimit) + 1,
    totalCount: 0
  }),
  on: {
    UPDATE_TOTAL_COUNT: [{
      guard: 'newTotalCountIsValid',
      actions: ['assignTotalCount', 'assignPagesToContext'],
      target: '.idle'
    }, {
      target: '.idle',
      guard: 'newTotalCountIsPositive',
      actions: ['assignTotalCount', 'resetOffset', 'assignPagesToContext', 'sendPageUpdated']
    }]
  },
  states: {
    awaitingTotalCount: {
      exit: ['assignPagesToContext']
    },

    idle: {
      on: {
        NEXT_PAGE: {
          guard: 'canGoToNextPage',
          actions: ['goToNextPage', 'sendPageUpdated', 'assignPagesToContext']
        },
        PREV_PAGE: {
          guard: 'canGoToPrevPage',
          actions: ['goToPrevPage', 'sendPageUpdated', 'assignPagesToContext']
        },
        GO_TO_TARGET_PAGE: {
          guard: 'targetPageIsWithinBounds',
          actions: [
            'goToTargetPage',
            'sendPageUpdated',
            'assignPagesToContext'
          ]
        }
      }
    }
  }
})
