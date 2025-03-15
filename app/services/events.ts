import type { PaginatedRequestParams } from '~/types/base.types'
import { RbagEventSchema, RegistrationDetailsSchema, type RbagEvent, type RegistrationDetails } from '~~/validation/eventSchema'

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
      return RbagEventSchema.parse(event)
    })
  }
  return validatedData
}

export async function getEvent(id: string) {
  const response = await useRequestFetch()(`/api/admin/events/${id}`, {
    method: 'GET'
  })
  const validatedData = RbagEventSchema.strict().parse(response)
  return validatedData
}

export async function createEventDraft(event: RbagEvent) {
  const response = await useRequestFetch()('/api/admin/create-event-draft', {
    method: 'POST',
    body: event
  })
  const validatedData = RbagEventSchema.strict().parse(response)
  return validatedData
}

export async function addEventRegistration(id: string, registration: RegistrationDetails) {
  const response = await useRequestFetch()(`/api/admin/events/${id}/registration`, {
    method: 'POST',
    body: registration
  })
  const validatedData = RegistrationDetailsSchema.strict().parse(response)
  return validatedData
}
