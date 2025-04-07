import { useHistory } from 'react-router-dom'
import { defaultPagination } from '../config'

export const useHandleSelectChange = (setEntriesPerPage?: (value: number) => void) => {
  const history = useHistory()

  const handleSelectChange = (value: string) => {
    const newEntriesPerPage = parseInt(value, 10)
    setEntriesPerPage && setEntriesPerPage(newEntriesPerPage)
    const searchParams = new URLSearchParams(history.location.search)
    searchParams.set('pageSize', value)
    searchParams.set('page', defaultPagination.page.toString())
    history.push(`?${searchParams.toString()}`)
  }

  return { handleSelectChange }
}
