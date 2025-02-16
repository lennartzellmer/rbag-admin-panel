import type { Category } from '@prisma/client'

export async function getCategories() {
  const request = useRequestFetch()('/api/admin/categories', {
    method: 'GET'
  })
  return request
}

export async function createCategory(category: Partial<Category>) {
  const request = useRequestFetch()('/api/admin/categories', {
    method: 'POST',
    body: category
  })
  return request
}

export async function patchCategory(id: string, category: Partial<Category>) {
  const request = useRequestFetch()(`/api/admin/categories/${id}`, {
    method: 'PATCH',
    body: category
  })
  return request
}
