import { defineEventHandler } from 'h3'
import { createCommand, handleCommand } from 'vorfall'
import { createUser, type CreateUser } from '~~/server/domain/user/commandHandling'
import { evolve, getUserById, getUserStreamSubjectById, initialState } from '~~/server/domain/user/eventHandling'
import { federatedUserSchema } from '~~/server/domain/user/validation'
import { useAuthenticatedUser } from '~~/server/utils/useAuthenticatedUser'

export default defineEventHandler(async (event) => {
  // =============================================================================
  // Get user details
  // =============================================================================

  const sessionUser = await useAuthenticatedUser(event)

  const { success: isValidUser, data: validUser, error } = federatedUserSchema.safeParse(sessionUser)

  if (!isValidUser) {
    console.error('Invalid user data', error)
    throw createError({ statusCode: 400, statusMessage: 'Invalid user data', statusText: error?.message })
  }

  // =============================================================================
  // Create or update user in event store
  // =============================================================================

  const eventStore = event.context.eventStore
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
      requestedBy: {
        email: validUser.email,
        userId: validUser.sub
      },
      now: new Date()
    }
  })

  const existingUser = await getUserById(eventStore, validUser.sub)

  if (existingUser) {
    return sendNoContent(event, 204)
  }

  await handleCommand({
    eventStore,
    streams: [{
      evolve,
      initialState,
      streamSubject: getUserStreamSubjectById(validUser.sub)
    }],
    commandHandlerFunction: createUser,
    command: command
  })

  return sendNoContent(event, 204)
})
