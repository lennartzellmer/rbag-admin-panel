import type { CollectionResponseList, PaginatedRequestParams } from '~/types/base.types'

export const getUsers = ({ paginationParams }: { paginationParams: PaginatedRequestParams }): Promise<CollectionResponseList<UserDocument>> => {
  return useRequestFetch()('/api/users', {
    params: {
      offset: paginationParams.offset,
      limit: paginationParams.limit
    }
  })
}
