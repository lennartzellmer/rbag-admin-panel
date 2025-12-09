export const updateProfileImage = async (userId: string, file: File) => {
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
      userId,
      uploadedFileKey: uploadData.key
    }
  })
}

export const removeProfileImage = async (userId: string) => {
  return await $fetch(`/api/admin/user/${userId}/remove-profile-image`, {
    method: 'POST',
    body: {
      userId
    }
  })
}

export const getUserById = async (id: string) => {
  return await $fetch(`/api/admin/user/${id}`, {
    method: 'GET'
  })
}
