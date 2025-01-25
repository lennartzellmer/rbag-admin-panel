import { createFilterMachine } from '../genericFilter/genericFilter.machine'

const FILTER_URL_KEY = 'searchTerm'
const FILTER_PARAMS_KEY = 'searchTerm2'

function getSearchFromUrl(URLKey: string): Record<typeof FILTER_PARAMS_KEY, string> | null {
  const params = new URLSearchParams(window.location.search)
  const paramValue = params.get(URLKey)
  return paramValue ? { [FILTER_PARAMS_KEY]: paramValue } : null
}

export const filterSearchMachine = createFilterMachine({
  filterUrlKey: FILTER_URL_KEY,
  filterParamsKeys: [FILTER_PARAMS_KEY],
  filterValueGetter: getSearchFromUrl
})
