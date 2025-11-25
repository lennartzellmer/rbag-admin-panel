export type InboundMachineEvents<TFilterConfig extends FilterConfig<string>>
  = {
    type: 'SET_FILTER_DEBOUNCED'
    payload: TFilterConfig
  }
  | { type: 'CONFIRM' }
  | {
    type: 'SET_FILTER'
    payload: TFilterConfig | null
  }

export type OutboundMachineEvents<TFilterConfig extends FilterConfig<string>>
  = {
    type: 'FILTER_UPDATED'
    filter: TFilterConfig
  }
  | {
    type: 'FILTER_RESET'
    filterParamsKey: TFilterConfig['filterParamsKey']
  }

export type MachineContext<
  TFilterConfig extends FilterConfig<string>,
  TUrlKey extends string
> = {
  URLKey: TUrlKey
  filterParamsKey: NonNullable<TFilterConfig>['filterParamsKey']
  filterState: TFilterConfig | null
}

export type FilterConfig<TFilterParamsKey extends string> = {
  ['filterParamsKey']: TFilterParamsKey
  ['filterValue']: URLSearchParams
}
