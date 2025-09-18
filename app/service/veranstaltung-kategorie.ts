export async function getVeranstaltungsKategorienPaginated() {
  const response = await useRequestFetch()(`/api/veranstaltung-kategorie`, {
    method: 'GET'
  })
  // const validatedData = veranstaltungsKategorieSchema.strict().parse(response)
  return response
}
