import Zitadel from '@zitadel/zitadel-node/dist/index.js'

const runtimeConfig = useRuntimeConfig()

const url = runtimeConfig.zitadel.url
const personalAccessToken = runtimeConfig.zitadel.personalAccessToken

if (!url || !personalAccessToken) {
  throw new Error('Zitadel URL and Personal Access Token must be provided through env variables')
}

const clientPromise = Zitadel.withAccessToken(
  url,
  personalAccessToken
)

// Extend the H3EventContext interface to include the idpClient type
declare module 'h3' {
  interface H3EventContext {
    idpClient: Awaited<typeof clientPromise>
  }
}

// Add the event store to the request event context
// This way, the event store is available in all request handlers
// like this: const idpClient = event.context.idpClient
export default defineNitroPlugin(async (nitroApp) => {
  const zitadelClient = await clientPromise
  nitroApp.hooks.hook('request', (event) => {
    event.context.idpClient = zitadelClient
  })
})
