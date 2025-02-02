import type { CollectionResponseList, PaginatedRequestParams } from '~/types/base.types'
import type { UserDocument } from '~~/server/models/User'

export function getUsers({ paginationParams }: { paginationParams: PaginatedRequestParams }) {
  const request = useRequestFetch()('/api/users', {
    method: 'GET',
    params: {
      offset: paginationParams.offset,
      limit: paginationParams.limit
    }
  })
  return request as Promise<CollectionResponseList<UserDocument>>
}

export function patchUser(id: string, user: UserDocument) {
  const request = useRequestFetch()(`/api/users/${id}`, {
    method: 'PATCH',
    body: user
  })
  return request as Promise<UserDocument>
}
