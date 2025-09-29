import { randomUUID } from 'node:crypto'
import { createDomainEvent } from 'vorfall'
import type { Command } from 'vorfall'
import type { CreateMediaSchema } from './validation'
import { getMediaStreamSubjectById, type MediaCreated } from './eventHandling'

// =============================================================================
// Commands
// =============================================================================

export type MediaCommandMetadata = {
  requestedBy: string
}

export type CreateMedia = Command<
  'CreateMedia',
  CreateMediaSchema,
  MediaCommandMetadata
>

// =============================================================================
// Command Handlers
// =============================================================================

export const createMedia = async (
  { command }: { command: CreateMedia }
): Promise<MediaCreated> => {
  const { data, metadata } = command

  const mediaId = randomUUID()

  return createDomainEvent({
    type: 'MediaCreated',
    subject: getMediaStreamSubjectById(mediaId),
    data: {
      id: mediaId,
      ...data
    },
    metadata: { requestedBy: metadata.requestedBy }
  })
}
