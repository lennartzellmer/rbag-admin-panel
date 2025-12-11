import type { VeranstaltungsKategorieUpdateSchema } from '~~/shared/validation/veranstaltungKategorieSchema'

export async function getVeranstaltungsKategorienPaginated({ currentPage, currentPageSize }: { currentPage: number, currentPageSize: number }) {
  return await $fetch(`/api/admin/veranstaltung-kategorie`, {
    method: 'GET',
    params: {
      offset: (currentPage - 1) * currentPageSize,
      limit: currentPageSize
    }
  })
}

export async function updateVeranstaltungsKategorie({ id, category }: { id: string, category: VeranstaltungsKategorieUpdateSchema }) {
  return await $fetch(`/api/admin/veranstaltung-kategorie/${id}/update`, {
    method: 'POST',
    body: category
  })
}
