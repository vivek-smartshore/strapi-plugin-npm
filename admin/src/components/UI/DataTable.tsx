import { Button, Table, Tbody, Td, Th, Thead, Tr, Typography } from '@strapi/design-system'
import { useMemo } from 'react'
import styled from 'styled-components'
import Sorting from '../Sorting'
import EmptyStateContent from './EmptyStateContent'
import { SortOrders } from '../../types'

interface TableHeader {
  field: string
  label: string
  sortable?: boolean
}

type SortConfig = {
  handleSort: (
    field: string,
    order: SortOrders,
    setSortOrder: React.Dispatch<React.SetStateAction<SortOrders>>,
    setQuery: React.Dispatch<React.SetStateAction<Record<string, any>>>
  ) => void
  sortOrder: SortOrders
  activeSort: string
  setSortOrder: React.Dispatch<React.SetStateAction<SortOrders>>
  setQuery: React.Dispatch<React.SetStateAction<Record<string, any>>>
}

type DataTableProps<T> = {
  data: T[]
  renderRow: (row: T, index: number) => JSX.Element
  headers: TableHeader[]
  emptyMessage: string
  onAddItem?: () => void
  sortConfig?: SortConfig
  footer?: JSX.Element
}

const SortIconButton = styled(Button)`
  background: transparent !important;
  border: none;
  padding: 0;
`

const DataTable = <T,>({
  data,
  renderRow,
  headers,
  emptyMessage,
  onAddItem,
  sortConfig,
  footer,
}: DataTableProps<T>) => {
  const COL_COUNT = headers.length + 1

  const renderSorting = (field: string, sortable: boolean | undefined) => {
    if (!sortable || !sortConfig) return null
    const { handleSort, sortOrder, setSortOrder, setQuery, activeSort } = sortConfig
    return (
      <Sorting
        sortOrder={sortOrder}
        onSort={() => handleSort(field, sortOrder, setSortOrder, setQuery)}
        field={field}
        sortActive={activeSort}
      />
    )
  }

  const renderedHeaders = useMemo(
    () =>
      headers.map(({ field, label, sortable }) => (
        <Th key={field} action={renderSorting(field, sortable)}>
          {sortable && sortConfig ? (
            <SortIconButton
              variant="ghost"
              onClick={() =>
                sortConfig.handleSort(field, sortConfig.sortOrder, sortConfig.setSortOrder, sortConfig.setQuery)
              }
            >
              <Typography variant="sigma">{label}</Typography>
            </SortIconButton>
          ) : (
            <Typography variant="sigma">{label}</Typography>
          )}
        </Th>
      )),
    [headers, sortConfig]
  )

  const renderedRows = useMemo(() => data.map((row, index) => renderRow(row, index)), [data, renderRow])

  return (
    <Table colCount={COL_COUNT} width="100%" footer={footer || null}>
      <Thead>
        <Tr>{renderedHeaders}</Tr>
      </Thead>
      <Tbody>
        {data && data.length > 0 ? (
          renderedRows
        ) : (
          <Tr>
            <Td colSpan={COL_COUNT}>
              <EmptyStateContent content={emptyMessage} {...(onAddItem && { onAddEntry: onAddItem })} />
            </Td>
          </Tr>
        )}
      </Tbody>
    </Table>
  )
}

export default DataTable
