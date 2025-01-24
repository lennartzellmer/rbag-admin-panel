export interface CollectionResponseList<T> {
  data: T[]
  totalCount: number
}

export interface Response<T> {
  data: T
  meta?: { [key: string]: unknown }
}

export interface ResponseList<T> {
  data: T[]
  meta?: { [key: string]: unknown }
}

export interface PaginatedRequestParams {
  offset: number
  limit: number
}
