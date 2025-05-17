import type { StreamCollectionName, StreamCollectionNameParts, StreamName, StreamNameParts, StreamType } from '../eventStore'

/**
 * Accepts a `streamType` (the type/category of the event stream) and an `streamId`
 * (the individual entity/object or aggregate ID) and combines them to a singular
 * `streamName` which can be used in `EventStore`.
 */
export function toStreamName<T extends StreamType>(
  streamType: T,
  streamId: string
): StreamName<T> {
  return `${streamType}:${streamId}`
}

/**
   * Accepts a fully formatted `streamName` and returns the broken down
   * `streamType` and `streamId`.
   */
export function fromStreamName<T extends StreamType>(
  streamName: StreamName<T>
): StreamNameParts<T> {
  const parts = streamName.split(':') as [T, string]
  return {
    streamType: parts[0],
    streamId: parts[1]
  }
}

/**
   * Accepts a `streamType` (the type/category of the event stream)
   * and combines them to a `collectionName` which can be used in `EventStore`.
   */
export function toStreamCollectionName<T extends StreamType>(
  streamType: T
): StreamCollectionName<T> {
  return `emt:${streamType}`
}

/**
   * Accepts a fully formatted `streamCollectionName` and returns the parsed `streamType`.
   */
export function fromStreamCollectionName<T extends StreamType>(
  streamCollectionName: StreamCollectionName<T>
): StreamCollectionNameParts<T> {
  const parts = streamCollectionName.split(':') as [string, T]
  return {
    streamType: parts[1]
  }
}
