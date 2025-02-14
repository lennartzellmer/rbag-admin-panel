export interface CollectionResponseList<T> {

  data: T[]
  meta: {
    total: number
    offset: number
    limit: number
  }
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
