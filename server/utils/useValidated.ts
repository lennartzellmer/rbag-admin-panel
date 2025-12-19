import type z from 'zod'
import type { H3Event } from 'h3'

export async function useValidatedBody<T extends z.ZodTypeAny>(
  event: H3Event,
  schema: T
): Promise<z.infer<T>> {
  const {
    success: isValidBody,
    data: validatedBody,
    error: validationError
  } = await readValidatedBody(event, data => schema.safeParse(data))

  if (!isValidBody) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body',
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
  } = await getValidatedQuery(event, data => schema.safeParse(data))

  if (!isValidQuery) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request query',
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
  } = await getValidatedRouterParams(event, data => schema.safeParse(data))

  if (!isValidParams) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request params',
      statusText: validationErrorParams?.message
    })
  }

  return validatedParams
}
