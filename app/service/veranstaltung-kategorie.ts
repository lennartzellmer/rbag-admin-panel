export async function getVeranstaltungsKategorienPaginated() {
  return await $fetch(`/api/admin/veranstaltung-kategorie`, {
    method: 'GET'
  })
}
