export interface ResponseInterface {
  data: any
  meta?: any
  error?: any
}

export type PublicationState = 'live' | 'preview'

export type PaginationParams = {
  limit: number
  start: number
}
export type Params = {
  pagination: PaginationParams
  sort: string
  publicationState?: PublicationState
  filters: any
  fields: string[]
  populate?: any
}

export type SortOrders = 'ASC' | 'DESC'
/* type used for sidebar Information */
export type InfoDetails = {
  Created: string
  'Last updated': string
  'Submitted on': string
  Form: number
}

export type InfoDetailsOptional = {
  [key in keyof InfoDetails]?: InfoDetails[key]
}
