/**
 * Transforms a type to add url property to all media objects under the media key
 *
 * Example:
 * Input: { id: string; media?: { profileImage: { type: "image", objectName: string } } }
 * Output: { id: string; media?: { profileImage: { type: "image", objectName: string, url: string } } }
 */
export type WithMediaUrls<T> = T extends { media?: infer M }
  ? M extends Record<string, unknown> ? Omit<T, 'media'> & {
    media?: { [K in keyof M]: M[K] extends { objectName: string, type: string } ? M[K] & { url: string } : M[K] } } : T : T
