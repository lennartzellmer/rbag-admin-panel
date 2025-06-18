import { z } from 'zod'

export const PlatzreservierungSchema = z.object({
  veranstaltungId: z.string(),
  reservierendePerson: z.object({
    vorname: z.string().min(1),
    nachname: z.string().min(1),
    email: z.string().email()
  }),
  reservierungen: z.array(z.object({
    vorname: z.string().min(1),
    nachname: z.string().min(1)
  }))
})
