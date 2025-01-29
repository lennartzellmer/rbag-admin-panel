import type { PaginatedRequestParams } from '~/types/base.types'

export const fetchDataFunction = ({ paginationParams }: { paginationParams: PaginatedRequestParams }) => {
  const test = useRequestFetch()('/api/users', {
    params: {
      offset: paginationParams.offset,
      limit: paginationParams.limit
    }
  })
  return test
}
