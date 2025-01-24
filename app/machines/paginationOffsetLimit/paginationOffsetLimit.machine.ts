import { assign, createMachine, sendParent } from 'xstate'
import type {
  MachineContext,
  MachineEvents,
} from './paginationOffsetLimit.types'

export function createPaginationOffsetLimitMachine(
  { initialOffset, initialLimit }: { initialOffset: number, initialLimit: number },
) {
  const totalPages = (context: MachineContext) =>
    Math.ceil((context.totalCount || 0) / context.limit)

  const currentPage = (context: MachineContext) =>
    Math.ceil(context.offset / context.limit) + 1

  return createMachine(
    {
      /** @xstate-layout N4IgpgJg5mDOIC5QAcCGUCWA7VAXDA9lgPIBmpsYuAMhgLYa4CyqAxgBbZgDEAqgAoARAIIAVAKIB9UcVHDqkgMLFeAOVEBtAAwBdRCgKxGhLPpAAPRABYATABoQAT2sBWGwDoXARhsBOKwBsAOzBLr6+AQEAvlEOaJg4+ERkFFS0DMxsnFhg7qgA7qjGWFCiBLioADaKBACuWLjc2npIIMiGxkRmlghWWlruXgFWAMyBIyFBfgAcDs4IE9Putl5aXoFa0y7TVjFx6Nh4JimUNPSMLBxc7hgQlTyq4gAaopL8wgDi4s1m7UZJplaPVWm2Wvn6XmmIx2IxGWl8c0QNmmQUGAX6NgC02RfmGLj2bQOiWO5FO6QuWWut3u3H4ACVxAA1N6fb66X4dAHdRAuEYeLQhfy+aa+IK2IIuREIaZeQZeUXCgLhbYRIIE+KHAEnNLnTJXHI3O48D7EaSmuR0r6vd5fH6tP6dQGgHoy1FBILraZaLFBXwuIKzJyIALbZZK0YCrwuTY2GKxEBYAgQOC-IlHZKknUZS7ZMAc-4mbkIAC0ASlpfcNi0cP9OysVnCI2F6rTWszZ2zlINBSK+BKZQq1TqDXzjqL0JGy3lLjcWK2VijZaDCExqP9Nd8qxs6wCXhbCXTJHb5L1ucN91HXKBwfC7l8mNsWhsNjhIYRy6s3jv4J2Vb5kKCEY4yiIA */
      id: 'paginationOffsetLimitMachine',
      initial: 'awaitingTotalCount',
      predictableActionArguments: true,
      tsTypes: {} as import('./paginationOffsetLimit.machine.typegen').Typegen0,
      schema: {
        context: {} as MachineContext,
        events: {} as MachineEvents,
      },
      context: {
        limit: initialLimit,
        offset: initialOffset,
        currentPage: Math.ceil(initialOffset / initialLimit) + 1,
      },
      on: {
        UPDATE_TOTAL_COUNT: {
          cond: 'newTotalCountIsValidValue',
          actions: ['assignDataToContext', 'assignPagesToContext'],
          target: 'idle',
        },
      },
      states: {
        awaitingTotalCount: {
          always: [
            {
              cond: 'hasTotalCount',
              target: 'idle',
            },
          ],
          exit: ['assignPagesToContext'],
        },
        idle: {
          on: {
            NEXT_PAGE: {
              cond: 'canGoToNextPage',
              actions: ['goToNextPage', 'sendPageUpdated', 'assignPagesToContext'],
            },
            PREV_PAGE: {
              cond: 'canGoToPrevPage',
              actions: ['goToPrevPage', 'sendPageUpdated', 'assignPagesToContext'],
            },
            GO_TO_TARGET_PAGE: {
              cond: 'targetPageIsWithinBounds',
              actions: ['goToTargetPage', 'sendPageUpdated', 'assignPagesToContext'],
            },
          },
        },
      },
    },
    {
      guards: {
        newTotalCountIsValidValue: (_, event) => {
          return event.totalCount >= 0
        },
        canGoToNextPage: (context) => {
          if (!totalPages(context))
            return false

          return currentPage(context) < totalPages(context)
        },
        canGoToPrevPage: (context) => {
          return currentPage(context) > 1
        },
        targetPageIsWithinBounds: (context, event) => {
          if (totalPages(context) === 0)
            return true

          return (
            event.targetPage >= 1 && event.targetPage <= totalPages(context)
          )
        },
        hasTotalCount: context => !!context.totalCount,
      },
      actions: {
        sendPageUpdated: sendParent((context) => {
          // If a pagination machine is used as a child we inform the partent
          // so that it can react on it. e.g. by fetching a new page
          return {
            type: 'PAGE_UPDATED',
            offset: context.offset,
            limit: context.limit,
          }
        }),
        goToPrevPage: assign({
          offset: context => context.offset - context.limit,
        }),
        goToNextPage: assign({
          offset: context => context.offset + context.limit,
        }),
        goToTargetPage: assign({
          offset: (context, event) => (event.targetPage - 1) * context.limit,
        }),
        assignDataToContext: assign({
          totalCount: (_, event) => event.totalCount,
          offset: (context, event) => {
            // We need to check if the new totalCount is eliminating a page
            // and we jump out of bounce with the current limit

            const currentPageAboveNewTotalPages = currentPage(context) > Math.ceil(event.totalCount / context.limit) + 1

            if (currentPageAboveNewTotalPages) {
              sendParent({
                type: 'PAGE_UPDATED',
                limit: context.limit,
                offset: (context.totalPages || 1 - 1) * context.limit,
              })
              return 0
            }
            return context.offset
          },
        }),
        assignPagesToContext: assign({
          totalPages: context => totalPages(context),
          currentPage: context => currentPage(context),
        }),
      },
    },
  )
}
