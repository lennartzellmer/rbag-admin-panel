import type { PaginatedRequestParams } from '~/types/base.types'

export const getUsers = ({ paginationParams }: { paginationParams: PaginatedRequestParams }) => {
  return useRequestFetch()('/api/users', {
    params: {
      offset: paginationParams.offset,
      limit: paginationParams.limit
    }
  })
}
