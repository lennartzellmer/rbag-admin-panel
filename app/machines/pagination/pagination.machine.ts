import { assign, sendParent, setup, assertEvent } from 'xstate'
import type { MachineContext, MachineEvents } from './pagination.types'

const totalPages = (totalCount: number, limit: number) =>
  Math.ceil((totalCount || 0) / limit)

const currentPage = (offset: number, limit: number) =>
  Math.ceil(offset / limit) + 1

export const paginationMachine = setup({
  types: {
    context: {} as MachineContext,
    events: {} as MachineEvents
  },
  actions: {
    sendPageUpdated: sendParent(({ context }) => ({
      type: 'PAGE_UPDATED',
      description: 'If a pagination machine is used as a child we inform the partent so that it can react on it. e.g. by fetching a new page',
      pagination: {
        offset: context.offset,
        limit: context.limit
      }
    })),
    assignOffsetWithTargetPage: assign({
      offset: ({ context, event }) => {
        assertEvent(event, 'GO_TO_TARGET_PAGE')
        return (event.targetPage - 1) * context.limit!
      }
    }),
    assignPagesToContext: assign({
      totalPages: ({ context }) => totalPages(context.totalCount!, context.limit!),
      currentPage: ({ context }) => currentPage(context.offset!, context.limit!)
    }),
    assignTotalCount: assign({
      totalCount: ({ event }) => {
        assertEvent(event, 'UPDATE_TOTAL_COUNT')
        return event.totalCount
      }
    }),
    resetOffsetAndCurrentPage: assign({
      offset: 0,
      currentPage: 1
    }),
    assignInitialStateFromURLParam: assign(() => {
      const url = new URL(window.location.href)
      const offset = parseInt(url.searchParams.get('offset') || '0', 10)
      const limit = parseInt(url.searchParams.get('limit') || '10', 10)
      const currentPageNumber = currentPage(offset, limit)
      return {
        offset,
        limit,
        currentPage: currentPageNumber
      }
    }),
    updateURLParams: async ({ context }) => {
      const url = new URL(window.location.href)
      url.searchParams.set('offset', context.offset!.toString())
      url.searchParams.set('limit', context.limit!.toString())
      const router = useRouter()
      await router.push(url)
      history.replaceState({ ...history.state }, '', url.toString())
    }
  },
  guards: {
    currentPageAboveNewTotalPages: ({ event, context }) => {
      assertEvent(event, 'UPDATE_TOTAL_COUNT')
      const currentPageAboveNewTotalPages = currentPage(context.offset!, context.limit!) > Math.ceil(event.totalCount / context.limit!) + 1
      const valueIsPositive = event.totalCount >= 0
      return valueIsPositive && !currentPageAboveNewTotalPages
    },
    newTotalCountIsPositive: ({ event }) => {
      assertEvent(event, 'UPDATE_TOTAL_COUNT')
      return event.totalCount >= 0
    },
    canGoToNextPage: ({ context }) => {
      if (!totalPages(context.totalPages!, context.limit!))
        return false
      return currentPage(context.offset!, context.limit!) < totalPages(context.totalCount!, context.limit!)
    },
    canGoToPrevPage: ({ context }) => {
      return currentPage(context.offset!, context.limit!) > 1
    },
    targetPageIsWithinBounds: ({ context, event }) => {
      assertEvent(event, 'GO_TO_TARGET_PAGE')
      return event.targetPage >= 1 && event.targetPage <= totalPages(context.totalCount!, context.limit!)
    }
  }
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAcCGUCWA7VAXDA9lgLKoDGAFtmAMQCqACgCICCAKgKID6bA8mywAyXAMK86AOTYBtAAwBdRCgKwM+IkpAAPRAFoAjACYA7ADoAnIYDMsgBzmAbABZbx81YdWANCACeifVlZU0MHAFZjYzD9c31jcKsnAF8knzRMHHUSciosWkZWTh5+IVFxKWl9RSQQZBU1QixNHQRdJ30wkPd4xyNjIzCffwRrW1MHezc420CZpzCUtPRsPEbSSmpTDAgAG1oJDgANNi4GFgBxDjlq5VUs5sRE4PNZQKDDGdsw9qHEQ1kHKY4s5ZN0XoYOrZFrVlpk1jlNts9jQGAAlDgANVOFyuCk0dTujQeCEShhCDlkVheFNkYUSTl+CAc1lMX0cVkMYWs0Tp0PSKyy61yYC2u1o514xR4LFRlxOZ0u13x9XuNRaukSnX0NKsVmMtnm-QBjOZVlZYXZnO5HSsKVSICwBAgcHxsNWRCF1GVhI0ar0TmMZNk1lk7Wpnn0+kZRlM8QixisYVstkpHkpfLdgoReVMqAA7qgGlgoGwCLhUDsRAQAK5YXDehq+0DqpyGJymYM2MMAiNRvwBfRmiHJmbmb4UhwOYwZjLu7IbHNIsAN1XNxDhWO0xNGZmB2nGRlOUGmFzmWx6wyGRxhWQJu1JIA */
  id: 'paginationMachine',
  initial: 'awaitingTotalCount',
  entry: [
    'assignInitialStateFromURLParam',
    'sendPageUpdated'
  ],
  on: {
    UPDATE_TOTAL_COUNT: [{
      guard: 'currentPageAboveNewTotalPages',
      actions: ['assignTotalCount', 'assignPagesToContext'],
      target: '.idle'
    }, {
      target: '.idle',
      guard: 'newTotalCountIsPositive',
      actions: ['assignTotalCount', 'resetOffsetAndCurrentPage', 'sendPageUpdated']
    }]
  },
  states: {
    awaitingTotalCount: {
      exit: ['assignPagesToContext']
    },

    idle: {

      on: {
        GO_TO_TARGET_PAGE: {
          guard: 'targetPageIsWithinBounds',
          actions: [
            'assignOffsetWithTargetPage',
            'sendPageUpdated',
            'assignPagesToContext',
            'updateURLParams'
          ],
          reenter: true
        }
      }
    }
  }
})
