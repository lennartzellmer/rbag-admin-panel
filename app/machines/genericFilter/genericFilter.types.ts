export type InboundMachineEvents<FilterType extends GetterReturnType> =
  {
    type: 'SET_FILTER_DEBOUNCED'
    payload: FilterType
  } |
  { type: 'CONFIRM' } |
  {
    type: 'SET_FILTER'
    payload: FilterType | null
  }

export type OutboundMachineEvents<FilterType extends GetterReturnType> =
  {
    type: 'FILTER_UPDATED'
    filter: NonNullable<FilterType>
  } |
  {
    type: 'FILTER_RESET'
    filterParamsKeys: Array<keyof NonNullable<FilterType>>
  }

export type MachineContext<
  TGetterReturnType extends GetterReturnType,
  TUrlKey extends string
> = {
  URLKey: TUrlKey
  filterValue: TGetterReturnType | null
  filterParamsKeys: Array<keyof NonNullable<TGetterReturnType>>
}

export type GetterReturnType = Record<string, string> | null
