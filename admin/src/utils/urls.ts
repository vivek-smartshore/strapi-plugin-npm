import pluginId from '../pluginId'
import { defaultPagination } from '../config'

// Base URL for all frontend routes
const FRONT_END_BASE_URL = `/plugins/${pluginId}`

// Define the default query string for listings
const defaultQueryString = `pageSize=${defaultPagination.pageSize}&page=${defaultPagination.page}&sort=${defaultPagination.sort}`

const FormURLs = {
  FRONT_END_BASE_URL,
  BASE: `${FRONT_END_BASE_URL}/forms`,
  LISTING: `${FRONT_END_BASE_URL}/forms/listing`,
  EDIT: (id: string | number) => `${FRONT_END_BASE_URL}/forms/listing/edit/${id}`,

  LISTING_WITH_QUERY: (queryString: string = defaultQueryString) => {
    return `${FRONT_END_BASE_URL}/forms/listing?${queryString}`
  },

  SUBMISSIONS: `${FRONT_END_BASE_URL}/submissions`,

  SUBMISSIONS_WITH_FORM_ID: (formId: string | number | undefined) => {
    if (formId === undefined) {
      throw new Error('formId is required')
    }
    return `${FRONT_END_BASE_URL}/submissions?pageSize=${defaultPagination.pageSize}&page=${defaultPagination.page}&sort=${defaultPagination.sort}&filters[$and][0][form][$eq]=${formId}`
  },

  SUBMISSIONS_LISTING_WITH_QUERY: (queryString: string = defaultQueryString) => {
    return `${FRONT_END_BASE_URL}/submissions?${queryString}`
  },
}

export default FormURLs
