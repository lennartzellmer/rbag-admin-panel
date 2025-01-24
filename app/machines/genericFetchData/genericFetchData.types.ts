export type MachineContext<T> = {
  data?: T
  errorMessage?: string
}

export type MachineEvents =
  | { type: 'RETRY' }

export type MachineServices<T> = {
  fetchData: {
    data: T
  }
}
