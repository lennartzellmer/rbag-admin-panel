export default defineEventHandler(async (event) => {
  const idpClient = event.context.idpClient

  const { secure } = await getUserSession(event)

  try {
    if (secure && secure.sessionId) {
      idpClient.sessions.deleteSession({
        sessionServiceDeleteSessionRequest: {
          sessionId: secure!.sessionId
        }
      })
    }
  }
  catch (error) {
    return createError({
      statusCode: 500,
      statusMessage: 'Error during logout at identity provider',
      data: error
    })
  }
})
