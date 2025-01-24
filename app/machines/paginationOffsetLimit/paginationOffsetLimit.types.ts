export type MachineContext = {
  limit: number
  // offset is zero-indexed
  offset: number
  totalCount?: number
  // for convenience this machine also holds the human readable pages data
  // currentPage is one-indexed
  currentPage: number
  totalPages?: number
}

export type MachineEvents =
  | {
    type: 'UPDATE_TOTAL_COUNT'
    totalCount: number
  }
  | {
    type: 'NEXT_PAGE'
  }
  | {
    type: 'PREV_PAGE'
  }
  | {
    type: 'GO_TO_TARGET_PAGE'
    targetPage: number
  }
