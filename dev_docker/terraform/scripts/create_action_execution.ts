const requiredEnv = (name: string): string => {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

const parseBoolean = (value: string | undefined): boolean => {
  if (!value) {
    return false
  }
  return value.toLowerCase() === 'true' || value === '1'
}

const parseTargets = (value: string | undefined): string[] => {
  if (!value) {
    throw new Error('Missing required environment variable: ZITADEL_ACTION_EXECUTION_TARGET_IDS')
  }
  return value
    .split(',')
    .map(target => target.trim())
    .filter(Boolean)
}

const main = async () => {
  const domain = requiredEnv('ZITADEL_DOMAIN')
  const port = requiredEnv('ZITADEL_PORT')
  const insecure = parseBoolean(process.env.ZITADEL_INSECURE)
  const accessToken = requiredEnv('ZITADEL_PAT')
  const responseMethod
    = process.env.ZITADEL_ACTION_EXECUTION_RESPONSE_METHOD
      ?? 'zitadel.user.v2.UserService/AddHumanUser'
  const targets = parseTargets(process.env.ZITADEL_ACTION_EXECUTION_TARGET_IDS)
  const executionPath
    = process.env.ZITADEL_ACTION_EXECUTION_PATH ?? '/v2/actions/executions'
  const requestMethod
    = process.env.ZITADEL_ACTION_EXECUTION_METHOD ?? 'PUT'

  const scheme = insecure ? 'http' : 'https'
  const baseUrl = `${scheme}://${domain}:${port}`
  const url = new URL(executionPath, baseUrl)

  const payload = {
    condition: {
      response: {
        method: responseMethod
      }
    },
    targets
  }

  const response = await fetch(url.toString(), {
    method: requestMethod,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `Failed to set action execution. Status: ${response.status}. Body: ${errorText}`
    )
  }

  const responseText = await response.text()
  if (responseText) {
    console.log(responseText)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

export {}
