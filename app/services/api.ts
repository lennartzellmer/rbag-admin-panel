import type { Event } from '@prisma/client'
import type { PaginatedRequestParams } from '~/types/base.types'

export async function getEvents({ paginationParams }: { paginationParams: PaginatedRequestParams }) {
  const request = useRequestFetch()('/api/events', {
    method: 'GET',
    params: {
      offset: paginationParams.offset,
      limit: paginationParams.limit
    }
  })
  return request
}

export function patchEvent(id: string, event: Partial<Event>) {
  const request = useRequestFetch()(`/api/events/${id}`, {
    method: 'PATCH',
    body: event
  })
  return request
}
