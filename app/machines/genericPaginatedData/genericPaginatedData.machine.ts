/* eslint-disable @typescript-eslint/no-explicit-any */
import type { StatesConfig } from 'xstate'
import { assign, createMachine, spawn } from 'xstate'
import { createPaginationOffsetLimitMachine } from '../paginationOffsetLimit/paginationOffsetLimit.machine'
import type {
  FetchDataFilterParams,
  FetchDataFunction,
  FilterMachines,
  MachineContext,
  MachineEvents,
  MachineServices,
  PaginatedDataFactoryParams,
  SpawnedFilterMachines
} from './genericPaginatedData.types'

export function createGenericPaginatedDataMachine<TFetchedDataFunction extends FetchDataFunction, TFetchDataFilterParams extends FetchDataFilterParams, TFilterMachines extends FilterMachines>(
  {
    fetchDataFunction,
    filterMachines,
    initialOffset,
    initialLimit,
    initialFilter,
    append
  }: PaginatedDataFactoryParams<TFetchedDataFunction, TFilterMachines>
) {
  // Define substates for the waitForInitialFilter state
  // This is necessary to make sure that the filter machines provided
  // their initial state before the machine starts fetching data
  function initialFilterSubStates() {
    const states: StatesConfig<MachineContext<TFetchedDataFunction, TFilterMachines>, any, MachineEvents<TFilterMachines>> = {}
    filterMachines?.forEach((filterMachine, index) => {
      states[`${filterMachine.context.URLKey}_${index}`] = {
        initial: 'wait',
        states: {
          wait: {
            on: {
              FILTER_UPDATED: {
                target: 'done',
                cond: (context, _, meta) => {
                  // get matching machine for the current state
                  // We need to use any here because inferring the type doesn't work

                  const machineMetchingState = context.filterMachineRefs?.find((entry: any) => entry.URLKey === filterMachine.context.URLKey)?.machine as any
                  return machineMetchingState?.getSnapshot()?._sessionid === meta._event.origin
                },
                actions: ['assignFilterToContext']
              },
              FILTER_RESET: {
                target: 'done'
              }
            }
          },
          done: {
            type: 'final'
          }
        }
      }
    })

    return states
  }

  return createMachine(
    {
      /** @xstate-layout N4IgpgJg5mDOIC5QwHZgE4EsDGAxMALtgBa6YA2BGkACgIZSYp1UQAiLdAsnSU2ADoA7nUwFcAe3QBJFGMx1yZShgDEECWgGwCLQagw58RUhSrpaDJnvacefLSLGSZcggqVmMAbQAMAXURQAAcJWHlNIJAAD0QAWgBmAHYBABYARgBWTN9fVIBOZNSADgTUgBoQAE9EACZ6gVrMhIA2QtTffIL0rIBfXsqDLDxCEmVzS0ZmVg5de2J+YVFxKVl5RXG1P0CkEFDw90jd2IRElNT633Ta1MzUpMLfTMqahATMlISmjOKLlo78vl+oMwGhhsYxl4LBB6FMbLNuLwFloLHQIFVVLhpAAZAAqAFEAEoAfQAqjQ2ABBAlsbZRfYRFBRE7pJLpRrvTL5Zq3dK+Fq1YoveJ8lK1blNJLvAW1BLFFrAkBDIyjUwqaGw6wzOxIxao9GYnEEkmE-EAZXxuLpuwZhyZx0QAIEyWaV3ynUyAqSwtOosaEo+0vqcoVAyVoMMIxMmw1VmmkAR8z1YDRVQEGHQUlUptxhIAmtaQmFGczEHdagJfFLalcWul8vUkrUfZlxWlWklsjkXalUorlVHIerJlqEzqHIJ9WmAGaqphQdSaQRMABuEgA1voI+DVTGR-HbHNdSiU+iBLOTPOEKuJNgWJhNNtC3ti3bSwgBcUBFz0qlWrU60FbIfUFfIBFKLJfE5O5clDEEwRVaMoX3eFx2RSdTxnOcUAXDQtBvTcBAHCE1QmGE41Qo8JwEKdz2wqBrxQNc7ztJ90h2IsDgfe1QBOf4EjSf5e3ydJikyUT8haEDWQEOtClKYpFK5G4kn7bdEKHMjNQPRNjww1M6MvHDVAzKQBGCcgWGnKQAFsiPUwdSOoci4W1Kj0JozDDIcBibxY7inwCelX2498Eig8CvhaZJigbLIkik6oyy+ARrkklooJEqtmjUhDHL3FzR0PRFqNozAIHIMBVBoSkAHF8TJClqXxWkgptEKjl4xB-grDoqxi3wbli5skoQP1cmSVlFOimsun6MMUAkCA4CiYjd2QwqdLQ-hgq4zqYniWUvy6G4El-W5PVqb1RsSbJ-VbXl0haUp3lyyMSIK7TKJKjynBWVx1k8dVdpLB1fXdAQTr-c7si9EDflkh4ugy8Twt8Yo3p3JDh0276kxPVMQbfMHrgE2Vsm5MpxP5QUfTietUgEB5Wy7EpuSSJIMbDNbsa0ii3J+5MDNM9AidCsGzsyStyxKTJigeeshVG56Uiy34Wg565Yq5+D3vWnGvoF-H9LPC8fLF-aThiwT+RaaLkfyDmfTR2Sskdv4kjdJI+25hyPo2w2x3coWz3KyqLZ4g6EEklIGZreo5M7dIfWuFJMvl1lOzOtpMkxjSnNjVyg8FgnQ4qwRFoRCP3z5LJUpOwaAPrJPpMZ5pAT-OttYSbk8-ygP+eL43PIMsPBAgThKRXURLIAI3D9q9sjlk8l8dtMpaHImkKBJnYaTme7aVJN8d1H5t6IA */
      id: 'genericFetchFilteredPaginatedDataMachine',
      initial: 'waitForInitialFilter',
      predictableActionArguments: true,
      preserveActionOrder: true,
      tsTypes: {} as import('./genericPaginatedData.machine.typegen').Typegen0,
      schema: {
        context: {} as MachineContext<TFetchedDataFunction, TFilterMachines>,
        events: {} as MachineEvents<TFilterMachines>,
        services: {} as MachineServices<TFetchedDataFunction>
      },
      context: {
        data: null,
        filter: initialFilter,
        pagination: {
          offset: initialOffset,
          limit: initialLimit
        }
      },
      entry: ['spawnPaginationActor', 'spawnFilterMachines'],
      states: {
        waitForInitialFilter: {
          type: 'parallel',

          states: {
            ...initialFilterSubStates()
          },
          onDone: 'ready',
          always: {
            // Always skip this step if no fiter machines are set
            target: 'ready',
            cond: () => !filterMachines
          }
        },

        ready: {
          initial: 'fetching',
          on: {
            FILTER_UPDATED: {
              target: '.fetching',
              actions: [
                'assignFilterToContext',
                'resetPaginationAndData',
                'spawnPaginationActor'
              ]
            },
            FILTER_RESET: {
              target: '.fetching',
              actions: [
                'removeFilterFromContext',
                'resetPaginationAndData',
                'spawnPaginationActor'
              ]
            }
          },
          states: {
            error: {
              id: 'idle',
              on: {
                RETRY: {
                  target: 'fetching'
                }
              },
              exit: 'clearErrorMessageFromContext'
            },

            fetching: {
              invoke: {
                src: 'fetchData',
                onDone: [
                  {
                    cond: 'isDataAvailable',
                    target: 'idle.dataAvailable',
                    actions: ['appendOrAssignDataToContext', 'sendTotalCountToPaginationMachine']
                  },
                  {
                    target: 'idle.noData'
                  }
                ],
                onError: {
                  actions: 'assignErrorToContext',
                  target: 'error'
                }
              }
            },

            idle: {
              states: {
                noData: {
                  type: 'final',
                  data: (context) => { return { ...context } }
                },

                dataAvailable: {
                  type: 'final',
                  data: (context) => { return { ...context } }
                }
              },

              on: {
                PAGE_UPDATED: {
                  target: 'fetching',
                  actions: 'assignLimitAndOffsetToContext'
                }
              }
            }
          }
        }
      }
    },
    {
      actions: {
        spawnFilterMachines: assign({
          filterMachineRefs: () => {
            // The array if filtermachines is mapped to an array of objects
            // where the machine is a spawed version of the given filter state machine
            const spawnedFilterMachines = filterMachines?.map((filterMachine) => {
              return {
                URLKey: filterMachine.context.URLKey,
                machine: spawn(filterMachine)
              }
            }) as SpawnedFilterMachines<TFilterMachines>
            return spawnedFilterMachines
          }
        }),
        spawnPaginationActor: assign({
          paginationMachineRef: (context) => {
            if (context.paginationMachineRef?.stop)
              context.paginationMachineRef.stop()
            return spawn(
              createPaginationOffsetLimitMachine({
                initialOffset: context.pagination.offset,
                initialLimit: context.pagination.limit
              }),
              'paginationOffsetLimitMachine'
            )
          }
        }),
        assignFilterToContext: assign({
          filter: (context, event) => {
            return {
              ...context.filter,
              ...event.filter
            }
          }
        }),
        removeFilterFromContext: assign({
          filter: (context, event) => {
            if (!context.filter)
              return undefined

            const newFilter = { ...context.filter }

            event.filterParamsKeys.forEach((key) => {
              // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
              delete newFilter[key]
            })

            const isEmptyObject = Object.keys(newFilter).length === 0
            if (isEmptyObject)
              return undefined

            return newFilter
          }
        }),
        assignErrorToContext: assign({
          errorMessage: (_, event: any) => event.data?.message.toString() || 'Could not fetch data'
        }),
        clearErrorMessageFromContext: assign({
          errorMessage: undefined
        }),
        appendOrAssignDataToContext: assign({
          data: (context, event) => {
            if (append) {
              if (context.data === null || context.data === undefined)
                return event.data.data
              return context.data.concat(event.data.data)
            }
            return event.data.data
          }
        }),
        resetPaginationAndData: assign({
          pagination: (context) => {
            return {
              offset: 0,
              limit: context.pagination.limit
            }
          },
          data: null
        }),
        sendTotalCountToPaginationMachine: (context, event) => {
          context.paginationMachineRef?.send({
            type: 'UPDATE_TOTAL_COUNT',
            totalCount: event.data.totalCount || 0
          })
        },
        assignLimitAndOffsetToContext: assign({
          pagination: (_, event) => {
            return {
              offset: event.offset,
              limit: event.limit
            }
          }
        })
      },
      services: {
        fetchData: context => async () => {
          // We need to assert the type of the filter because the type of the filter in the machine is partial
          // and the type of the filter in the fetchDataFunction is not partial.
          // This is because the filter in the machine is composed from the initial filter and the filter machines passed to the machine.
          // Only both merged form the complete filter object. Typing this is possible but would be a lot of work.
          const response = await fetchDataFunction(context.pagination, context.filter as TFetchDataFilterParams)
          return response.data
        }
      },
      guards: {
        isDataAvailable: (context, event) => {
          // If we are in append mode and data is available in context, return true
          if (append && context.data && context.data.length > 0)
            return true

          // If fetch delivered no data (undefined or null), return false
          if (event.data === undefined || event.data === null)
            return false

          // If fetch delivered no data (empty array), return false
          if (Array.isArray(event.data.data) && event.data.data.length === 0)
            return false

          // Fetch delivered data, return true
          return true
        }
      }
    }
  )
}
