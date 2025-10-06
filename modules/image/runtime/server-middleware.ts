import { checkPermissions } from './utils/check-permissions'

export default defineEventHandler(async (event) => {
  if (event.path.startsWith('/_ipx')) {
    await checkPermissions(event)
  }
})
