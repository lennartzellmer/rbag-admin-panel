import type z from 'zod'
import type { H3Event } from 'h3'
import { useSafeValidatedParams } from 'h3-zod'

export async function useValidatedBody<T extends z.ZodTypeAny>(
  event: H3Event,
  schema: T
): Promise<z.infer<T>> {
  const {
    success: isValidBody,
    data: validatedBody,
    error: validationError
  } = await readValidatedBody(event, body => schema.safeParse(body))

  if (!isValidBody) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid event data',
      statusText: validationError?.message
    })
  }
  return validatedBody
}

export async function useValidatedQuery<T extends z.ZodTypeAny>(
  event: H3Event,
  schema: T
): Promise<z.infer<T>> {
  const {
    success: isValidQuery,
    data: validatedQuery,
    error: validationErrorQuery
  } = await getValidatedQuery(event, body => schema.safeParse(body))

  if (!isValidQuery) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid query data',
      statusText: validationErrorQuery?.message
    })
  }

  return validatedQuery
}

export async function useValidatedParams<T extends z.ZodTypeAny>(
  event: H3Event,
  schema: T
): Promise<z.infer<T>> {
  const {
    success: isValidParams,
    data: validatedParams,
    error: validationErrorParams
  } = await useSafeValidatedParams(event, schema)

  if (!isValidParams) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid event data',
      statusText: validationErrorParams?.message
    })
  }

  return validatedParams
}
