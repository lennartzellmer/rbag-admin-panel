export default defineEventHandler(async (event) => {
  if (!event.path.startsWith('/api/webhooks-zitadel/'))
    return

  const runtimeConfig = useRuntimeConfig()
  const signingKey = runtimeConfig.zitadel.signingKey

  const { error, valid } = await validateSigningHeader(event, signingKey)

  if (!valid) {
    throw createError({
      statusCode: 403,
      statusMessage: `Could not validate request against signing key: ${error}`
    })
  }
})
