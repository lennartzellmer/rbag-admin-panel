import { ZITADEL_ROLES } from '~~/constants'

export default defineEventHandler(async (event) => {
  if (!event.path.startsWith('/api/admin/'))
    return

  const { user } = await requireUserSession(event)
  const roleKeys = Object.keys(user['urn:zitadel:iam:org:project:roles'] || [])
  console.log('User roles:', roleKeys)
  if (!roleKeys.includes(ZITADEL_ROLES.ADMIN)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden'
    })
  }
})
