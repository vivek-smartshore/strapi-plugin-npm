import { SortOrders } from '../types'

export const handleSort = (
  field: string,
  sortOrder: SortOrders,
  setSortOrder: React.Dispatch<React.SetStateAction<SortOrders>>,
  setQuery: React.Dispatch<React.SetStateAction<{}>>
) => {
  const newSortOrder = sortOrder === 'ASC' ? 'DESC' : 'ASC'
  setSortOrder(newSortOrder)
  setQuery({
    sort: `${field}:${newSortOrder}`,
  })
}
