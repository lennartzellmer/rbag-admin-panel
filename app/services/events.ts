import type { Event } from '@prisma/client'
import type { PaginatedRequestParams } from '~/types/base.types'
import { eventSchema } from '~~/validation/eventSchema'

export async function getEvents({ paginationParams }: { paginationParams: PaginatedRequestParams }) {
  const request = useRequestFetch()('/api/admin/events', {
    method: 'GET',
    params: {
      offset: paginationParams.offset,
      limit: paginationParams.limit
    }
  })
  return request
}

export async function getEvent(id: string) {
  const request = useRequestFetch()(`/api/admin/events/${id}`, {
    method: 'GET'
  })
  return request
}

export async function getEventParsed(id: string) {
  const request = await useRequestFetch()(`/api/admin/events/${id}`, {
    method: 'GET'
  })
  const validatedData = eventSchema.strict().parse(request)
  return validatedData
}

export async function createEvent(event: Partial<Event>) {
  const request = useRequestFetch()('/api/admin/events', {
    method: 'POST',
    body: event
  })
  return request
}

export function patchEvent(id: string, event: Partial<Event>) {
  const request = useRequestFetch()(`/api/admin/events/${id}`, {
    method: 'PATCH',
    body: event
  })
  return request
}
