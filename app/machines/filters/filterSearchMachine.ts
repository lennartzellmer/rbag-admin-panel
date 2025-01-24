import { createFilterMachine } from '../genericFilter/genericFilter.machine'

const URL_KEY = 'searchTerm'
const FILTER_PARAMS_KEY = 'searchTerm'

function getSearchFromUrl(URLKey: string): Record<typeof URL_KEY, string> | null {
  const params = new URLSearchParams(window.location.search)
  const paramValue = params.get(URLKey)
  return paramValue ? { [URL_KEY]: paramValue } : null
}

export const filterSearchMachine = createFilterMachine({
  filterUrlKey: URL_KEY,
  filterParamsKeys: [FILTER_PARAMS_KEY],
  filterValueGetter: getSearchFromUrl,
})
