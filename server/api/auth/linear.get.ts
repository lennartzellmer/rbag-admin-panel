import { createCommand, handleCommand } from 'vorfall'
import { federatedUserSchema } from '~~/server/domain/user/validation'
import { createUser, type CreateUser } from '~~/server/domain/user/commandHandling'
import { evolve, getUserById, getUserStreamSubjectById, initialState } from '~~/server/domain/user/eventHandling'

export default defineOAuthLinearEventHandler({
  async onSuccess(event, { user }) {
    const { user: sessionUser } = await setUserSession(event, { user })

    const { success: isValidUser, data: validUser, error } = federatedUserSchema.safeParse(sessionUser)

    if (!isValidUser) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid user data', statusText: error?.message })
    }

    const eventStore = event.context.eventStore
    const command: CreateUser = createCommand({
      type: 'CreateUser',
      data: {
        ...validUser,
        provider: 'linear',
        role: 'user'
      },
      metadata: {
        requestedBy: user.email,
        now: new Date()
      }
    })

    const existingUser = await getUserById(eventStore, validUser.id)

    if (existingUser) {
      return sendRedirect(event, '/admin')
    }

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
