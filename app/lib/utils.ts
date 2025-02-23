import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { parseDate, today, getLocalTimeZone } from '@internationalized/date'
import type { EventSchema } from '~~/validation/eventSchema'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getEventStatusFromEvent(event: EventSchema) {
  if (!event.isPublished) return 'DRAFT'
  if (event.isCanceled) return 'CANCELED'
  if (!event.registration) return 'SAVE_THE_DATE'
  if (event.registration) {
    // Convert plain strings (or JS Date `.toISOString()` output) to CalendarDate
    const registrationStartDate = parseDate(event.registration.startDate.toISOString().substring(0, 10))
    const registrationEndDate = parseDate(event.registration.endDate.toISOString().substring(0, 10))

    // Get today's date in the local time zone as a CalendarDate
    const currentDate = today(getLocalTimeZone())

    // Compare currentDate to startDate and endDate
    if (currentDate.compare(registrationStartDate) < 0) {
      return 'REGISTRATION_SCHEDULED'
    }
    else if (currentDate.compare(registrationEndDate) < 0) {
      return 'REGISTRATION_OPEN'
    }
  }

  const eventStartDate = parseDate(event.startDate.toISOString().substring(0, 10))
  const eventEndDate = parseDate(event.endDate.toISOString().substring(0, 10))

  if (eventStartDate.compare(today(getLocalTimeZone())) > 0) {
    return 'UPCOMING'
  }
  if (eventEndDate.compare(today(getLocalTimeZone())) > 0) {
    return 'ONGOING'
  }
  return 'COMPLETED'
}

export type EventStatus = ReturnType<typeof getEventStatusFromEvent>
