import type { PaginatedRequestParams } from '~/types/base.types'
import { eventSchema, registrationSchema, type EventSchema, type RegistrationSchema } from '~~/validation/eventSchema'

export async function getEvents({ paginationParams }: { paginationParams: PaginatedRequestParams }) {
  const response = await useRequestFetch()('/api/admin/events', {
    method: 'GET',
    params: {
      offset: paginationParams.offset,
      limit: paginationParams.limit
    }
  })
  const validatedData = {
    ...response,
    data: response.data.map((event) => {
      return eventSchema.parse(event)
    })
  }
  return validatedData
}

export async function getEvent(id: string) {
  const response = await useRequestFetch()(`/api/admin/events/${id}`, {
    method: 'GET'
  })
  const validatedData = eventSchema.strict().parse(response)
  return validatedData
}

export async function createEvent(event: EventSchema) {
  const response = await useRequestFetch()('/api/admin/events', {
    method: 'POST',
    body: event
  })
  const validatedData = eventSchema.strict().parse(response)
  return validatedData
}

export async function patchEvent(id: string, event: Partial<EventSchema>, signal: AbortSignal) {
  const response = await useRequestFetch()(`/api/admin/events/${id}`, {
    method: 'PATCH',
    body: event,
    signal
  })
  const validatedData = eventSchema.strict().parse(response)
  return validatedData
}

export async function createEventRegistration(id: string, registration: RegistrationSchema) {
  const response = await useRequestFetch()(`/api/admin/events/${id}/registration`, {
    method: 'POST',
    body: registration
  })
  const validatedData = registrationSchema.strict().parse(response)
  return validatedData
}
