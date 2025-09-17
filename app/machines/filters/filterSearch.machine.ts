import { createFilterMachine } from '../genericFilter/genericFilter.machine'
import type { FilterConfig } from '../genericFilter/genericFilter.types'

const FILTER_URL_KEY = 'searchTerm'
const FILTER_PARAMS_KEY = 'search'

function getSearchFromUrl(URLKey: string): FilterConfig<typeof FILTER_PARAMS_KEY> | null {
  const params = new URLSearchParams(window.location.search)
  const paramValue = params.get(URLKey)
  const searchParams = new URLSearchParams()
  if (paramValue) {
    searchParams.set(FILTER_PARAMS_KEY, paramValue)
    return { filterParamsKey: FILTER_PARAMS_KEY, filterValue: searchParams }
  }
  return null
}

export const filterSearchMachine = createFilterMachine({
  filterUrlKey: FILTER_URL_KEY,
  filterParamsKey: FILTER_PARAMS_KEY,
  filterValueGetter: getSearchFromUrl
})
