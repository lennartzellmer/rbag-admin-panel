import type { CollectionResponseList, PaginatedRequestParams } from '~/types/base.types'
import type { IEventDocument } from '~~/server/models/Event'

export function getEvents({ paginationParams }: { paginationParams: PaginatedRequestParams }) {
  const request = useRequestFetch()('/api/events', {
    method: 'GET',
    params: {
      offset: paginationParams.offset,
      limit: paginationParams.limit
    }
  })
  return request as Promise<CollectionResponseList<IEventDocument>>
}

export function patchEvent(id: string, event: IEventDocument) {
  const request = useRequestFetch()(`/api/events/${id}`, {
    method: 'PATCH',
    body: event
  })
  return request as Promise<IEventDocument>
}
