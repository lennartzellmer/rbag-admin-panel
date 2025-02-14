import type { CollectionResponseList, PaginatedRequestParams } from '~/types/base.types'
import type { IEventDocumentFrontend } from '~~/server/models/Event'

export async function getEvents({ paginationParams }: { paginationParams: PaginatedRequestParams }) {
  const request = useRequestFetch()('/api/events', {
    method: 'GET',
    params: {
      offset: paginationParams.offset,
      limit: paginationParams.limit
    }
  }) as Promise<CollectionResponseList<IEventDocumentFrontend>>
  return request
}

export function patchEvent(id: string, event: IEventDocumentFrontend) {
  const request = useRequestFetch()(`/api/events/${id}`, {
    method: 'PATCH',
    body: event
  })
  return request as Promise<IEventDocumentFrontend>
}
