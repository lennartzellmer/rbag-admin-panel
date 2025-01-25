import { assign, sendParent, setup, assertEvent } from 'xstate'
import type { MachineContext, MachineEvents, MachineInput } from './paginationMachine.types'

const totalPages = (totalCount: number, limit: number) =>
  Math.ceil((totalCount || 0) / limit)

const currentPage = (offset: number, limit: number) =>
  Math.ceil(offset / limit) + 1

export const paginationOffsetLimitMachine = setup({
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
      },
      offset: ({ context, event }) => {
        assertEvent(event, 'UPDATE_TOTAL_COUNT')
        // We need to check if the new totalCount is eliminating a page
        // and we jump out of bounce with the current limit
        const currentPageAboveNewTotalPages = currentPage(context.offset, context.limit) > Math.ceil(event.totalCount / context.limit) + 1

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
  /** @xstate-layout N4IgpgJg5mDOIC5QAcCGUCWA7VAXDA9lgLKoDGAFtmAMQCqACgCICCAKgKID6bA8mywAyXAMK86AOTYBtAAwBdRCgKwM+IkpAAPRAFoAjLICsAOgDsZ-QCYAzGYAs+gBxWzANhsBOADQgAnohONiaesh76Nm6h9k76bmYAvgm+aJg46iTkVFhgJhgQADa0EhwAGmxcDCwA4hxyikggyCpqhFiaOgheViayZnZmVm5OTm76Rja+AQhWhr1ubhOW9laeTp4eSSno2HhtpJTUeYW0DABKHABqlTV1CprNqhkdiDYrJkOyXmGyxm-2U0QblsJicRg2NisRlsRnGNi2TR26X2WSO+SKNGqvB42IEZ1qFSqtXqDxaz0anQMznmNmsExsdiMgycgIQZiMbg++ncNlk9ksYUsSWSICwBAgcAeSL2RAO2TApKebReCF09gWJii+k89k8Orc-PsAP8emC4MiYLMTlknl5o08CNSuwycqOqAA7qhWlgoGwCLhUAURAQAK5YXCK1oaCl6RxOTWebW6-WG43TDag8H2IzqhbZuyO6Uu1E5Y5FSPk0CdRbmP6woauKzGMys+w2kwxNZ2KyrRZ9eHCoA */
  id: 'paginationMachine',
  initial: 'awaitingTotalCount',
  context: ({ input }) => ({
    limit: input.initialLimit,
    offset: input.initialOffset,
    currentPage: Math.ceil(input.initialOffset / input.initialLimit) + 1,
    totalCount: 0
  }),
  on: {
    UPDATE_TOTAL_COUNT: {
      guard: 'newTotalCountIsValidValue',
      actions: ['assignTotalCount', 'assignPagesToContext'],
      target: 'idle'
    }
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
