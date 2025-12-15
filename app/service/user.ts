import type { PaginatedRequestParams } from '~/types/base.types'

export async function updateProfileImage(userId: string, file: File) {
  const uploadData = await $fetch('/api/admin/media/init-upload', {
    method: 'POST',
    body: {
      filename: file.name,
      contentType: file.type,
      size: file.size
    }
  })

  await $fetch(uploadData.uploadUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': uploadData.contentType }
  })

  await $fetch(`/api/admin/user/${userId}/set-profile-image`, {
    method: 'POST',
    body: {
      uploadedFileKey: uploadData.key
    }
  })
}

export async function removeProfileImage(userId: string) {
  return await $fetch(`/api/admin/user/${userId}/remove-profile-image`, {
    method: 'POST',
    body: {
      userId
    }
  })
}

export async function getUserById(id: string) {
  return await $fetch(`/api/admin/user/${id}`, {
    method: 'GET'
  })
}

export async function getUsersPaginated({ paginationParams }: { paginationParams: PaginatedRequestParams }) {
  return await $fetch('/api/admin/user', {
    method: 'GET',
    params: {
      offset: paginationParams.offset,
      limit: paginationParams.limit
    }
  })
}
