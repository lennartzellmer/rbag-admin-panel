import type { WithMediaUrls } from '~/types/media.types'
import type { User } from '~~/server/domain/user/validation'

export const updateProfileImage = async (userId: string, file: File) => {
  const { uploadUrl, key, contentType } = await useRequestFetch()('/api/admin/media/init-upload', {
    method: 'POST',
    body: {
      filename: file.name,
      contentType: file.type,
      size: file.size
    }
  })

  await useRequestFetch()(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': contentType }
  })

  const response = await useRequestFetch()('/api/admin/user/:id/set-profile-image'.replace(':id', userId), {
    method: 'POST',
    body: {
      userId,
      uploadedFileKey: key
    }
  })

  return response
}

export const removeProfileImage = async (userId: string) => {
  const response = await useRequestFetch()('/api/admin/user/:id/remove-profile-image'.replace(':id', userId), {
    method: 'POST',
    body: {
      userId
    }
  })

  return response
}

export const getProfileImageUrl = (key: string) => {
  const response = useRequestFetch()('/api/admin/media/get-media-url', {
    query: {
      key
    }
  })

  return response
}

export const getUserById = async (id: string): Promise<WithMediaUrls<User>> => {
  const response = await useRequestFetch()<WithMediaUrls<User>>('/api/admin/user/:id'.replace(':id', id), {
    method: 'GET'
  })

  return response || null
}
