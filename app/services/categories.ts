import type { Category } from '@prisma/client'
import { categorySchema } from '~~/validation/categorySchema'

export async function getCategories() {
  const request = await useRequestFetch()('/api/admin/categories', {
    method: 'GET'
  })
  const validatedData = {
    ...request,
    data: request.data.map((category) => {
      return categorySchema.parse(category)
    })
  }
  return validatedData
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
