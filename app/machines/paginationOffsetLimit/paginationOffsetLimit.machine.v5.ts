import { assign, sendParent, setup } from 'xstate'

const totalPages = (totalCount: number, limit: number) =>
  Math.ceil((totalCount || 0) / limit)

const currentPage = (offset: number, limit: number) =>
  Math.ceil(offset / limit) + 1

export const paginationOffsetLimitMachine = setup({
  types: {
    input: {} as {
      initialOffset: number
      initialLimit: number
    },
    context: {} as {
      offset: number
      limit: number
      currentPage: number
      // for convenience this machine also holds the human readable pages data
      // currentPage is one-indexed
      totalPages?: number
      totalCount?: number
    },
    events: {} as
    {
      type: 'UPDATE_TOTAL_COUNT'
      totalCount: number
    } | {
      type: 'NEXT_PAGE'
    } | {
      type: 'PREV_PAGE'
    } | {
      type: 'GO_TO_TARGET_PAGE'
      targetPage: number
    }
  },
  actions: {
    sendPageUpdated: sendParent(({ context }) => {
      // If a pagination machine is used as a child we inform the partent
      // so that it can react on it. e.g. by fetching a new page
      return {
        type: 'PAGE_UPDATED',
        offset: context.offset,
        limit: context.limit
      }
    }),
    goToPrevPage: assign({
      offset: ({ context }) => context.offset - context.limit
    }),
    goToNextPage: assign({
      offset: ({ context }) => context.offset + context.limit
    }),
    goToTargetPage: assign({
      offset: ({ context, event }) => {
        if (event.type === 'GO_TO_TARGET_PAGE') {
          return (event.targetPage - 1) * context.limit
        }
        return 0
      }
    }),
    assignPagesToContext: assign({
      totalPages: ({ context }) => totalPages(context.totalCount!, context.limit),
      currentPage: ({ context }) => currentPage(context.offset, context.limit)
    }),
    assignDataToContext: assign({
      totalCount: ({ event }) => event.totalCount,
      offset: ({ context, event }) => {
        // We need to check if the new totalCount is eliminating a page
        // and we jump out of bounce with the current limit

        const currentPageAboveNewTotalPages = currentPage(context) > Math.ceil(event.totalCount / context.limit) + 1

        if (currentPageAboveNewTotalPages) {
          sendParent({
            type: 'PAGE_UPDATED',
            limit: context.limit,
            offset: (context.totalPages || 1 - 1) * context.limit
          })
          return 0
        }
        return context.offset
      }
    })
  },
  guards: {
    newTotalCountIsValidValue: ({ event }) => {
      return event.totalCount >= 0
    },
    canGoToNextPage: ({ context }) => {
      if (!totalPages(context))
        return false

      return currentPage(context) < totalPages(context)
    },
    canGoToPrevPage: ({ context }) => {
      return currentPage(context) > 1
    },
    targetPageIsWithinBounds: ({ context, event }) => {
      if (totalPages(context) === 0)
        return true

      return (
        event.targetPage >= 1 && event.targetPage <= totalPages(context)
      )
    },
    hasTotalCount: ({ context }) => !!context.totalCount
  }
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAcCGUCWA7VAXDA9lgLKoDGAFtmAMQCqACgCICCAKgKID6bA8mywAyXAMK86AOTYBtAAwBdRCgKwM+IkpAAPRABYATABoQATz0BOAGwA6S-oCsAX0fG0mHOpLkqWMNdQA7qhq2FBsBLioADYiBACuWLg0copIIMgqIRppOgi6AIz51gDs5rKW+foAHObFAMyy+nXFxmYIdXW61rKdNbLF+rLmVZbmzq7o2HiEXpTU1hgQUbQSHAAabFwMLADiHCmaGaqemrlVTdYFuub5unVV97rFuq16XbJV9jfFlj8VX-lxulJh4ZqQ5r4FktaAwAEocABqW12+wUh0yJxyiHyH301kKdUsdnsNQaVleeXyVWs9h6+WK5WGhWKQLcU084J8fkWyxoO14PAFAlhe022z2BzSRyyWFOiCJshKd30+WGVSGPyMpnlump+hVwzuBQqHWcLhAWAIEDghxB0yInOo6OOMzlCAAtJYKe67pdbh8qp9nqVLKy7RzvPNAsF8FgwhForEErhnTK3YSbISqvVijV6o1mhT8vdrJ0GSNypZsxmw+57bMuVDlqnMaBcvYcdYrCrCg4GrJrhTdENS09s6USWUhrozY4gA */
  id: 'paginationMachine',
  initial: 'awaitingTotalCount',
  context: ({ input }) => ({
    limit: input.initialLimit,
    offset: input.initialOffset,
    currentPage: Math.ceil(input.initialOffset / input.initialLimit) + 1
  }),
  on: {
    UPDATE_TOTAL_COUNT: {
      guard: 'newTotalCountIsValidValue',
      actions: ['assignDataToContext', 'assignPagesToContext'],
      target: 'idle'
    }
  },
  states: {
    awaitingTotalCount: {
      always: [
        {
          guard: 'hasTotalCount',
          target: 'idle'
        }
      ],
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
          actions: ['goToTargetPage', 'sendPageUpdated', 'assignPagesToContext']
        }
      }
    }
  }
})
