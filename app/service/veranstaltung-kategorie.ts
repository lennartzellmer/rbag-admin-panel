export async function getVeranstaltungsKategorienPaginated({ currentPage, currentPageSize }: { currentPage: number, currentPageSize: number }) {
  return await $fetch(`/api/admin/veranstaltung-kategorie`, {
    method: 'GET',
    params: {
      offset: (currentPage - 1) * currentPageSize,
      limit: currentPageSize
    }
  })
}
