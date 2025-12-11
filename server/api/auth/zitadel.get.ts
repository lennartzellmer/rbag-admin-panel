import { createCommand, handleCommand } from 'vorfall'
import { federatedUserSchema } from '~~/server/domain/user/validation'
import { createUser, type CreateUser } from '~~/server/domain/user/commandHandling'
import { evolve, getUserById, getUserStreamSubjectById, initialState } from '~~/server/domain/user/eventHandling'

export default defineOAuthZitadelEventHandler({
  onError(event, error) {
    console.error('Zitadel OAuth error:', error)
    throw createError({ statusCode: 500, statusMessage: 'Authentication error', statusText: error.message })
  },
  async onSuccess(event, { user }) {
    // =============================================================================
    // Create or update user in event store
    // =============================================================================
    const { user: sessionUser } = await setUserSession(event, { user })

    const { success: isValidUser, data: validUser, error } = federatedUserSchema.safeParse(sessionUser)

    if (!isValidUser) {
      console.error('Invalid user data', error)
      throw createError({ statusCode: 400, statusMessage: 'Invalid user data', statusText: error?.message })
    }

    const eventStore = event.context.eventStore

    const existingUser = await getUserById(eventStore, validUser.sub)

    if (existingUser) {
      return sendRedirect(event, '/admin')
    }

    const command: CreateUser = createCommand({
      type: 'CreateUser',
      data: {
        id: validUser.sub,
        name: validUser.name,
        email: validUser.email,
        provider: 'linear',
        role: 'user'
      },
      metadata: {
        requestedBy: user.email,
        now: new Date()
      }
    })

    await handleCommand({
      eventStore,
      streams: [{
        evolve,
        initialState,
        streamSubject: getUserStreamSubjectById(user.id)
      }],
      commandHandlerFunction: createUser,
      command: command
    })

    return sendRedirect(event, '/admin')
  }
})
