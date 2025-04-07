import React, { useEffect, useMemo } from 'react'
import { Select, Option, Flex, Typography } from '@strapi/design-system'
import { useHistory, useLocation } from 'react-router-dom'
import { defaultPagination } from '../../config'
import { useFormatMessage } from '../../hooks/useFormatMessage'

interface PageSizeSelectorProps {
  entriesPerPage: number
  setEntriesPerPage: (value: number) => void
  options?: number[]
}

const PageSizeSelector: React.FC<PageSizeSelectorProps> = ({
  entriesPerPage,
  setEntriesPerPage,
  options = [10, 20, 50, 100],
}) => {
  const formatMessage = useFormatMessage()
  const history = useHistory()
  const location = useLocation()

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search])

  useEffect(() => {
    const pageSize = searchParams.get('pageSize')
    const pageSizeValue = parseInt(pageSize || '', 10)

    if (!isNaN(pageSizeValue) && pageSizeValue !== entriesPerPage) {
      setEntriesPerPage(pageSizeValue)
    }
  }, [searchParams, setEntriesPerPage, entriesPerPage])

  const handleSelectChange = (value: string | null) => {
    if (!value) return
    const newEntriesPerPage = parseInt(value, 10)
    if (isNaN(newEntriesPerPage)) return

    setEntriesPerPage(newEntriesPerPage)
    searchParams.set('pageSize', value)
    searchParams.set('page', defaultPagination.page.toString())
    history.push(`?${decodeURIComponent(searchParams.toString())}`)
  }

  return (
    <Flex direction="row" alignItems="center" gap={2}>
      <Select
        size="S"
        value={String(entriesPerPage)}
        onChange={handleSelectChange}
        placeholder={formatMessage('PageSizeSelector.Placeholder', 'Select entries')}
      >
        {options.map((option) => (
          <Option key={option} value={String(option)}>
            {option}
          </Option>
        ))}
      </Select>
      <Typography>{formatMessage('PageSizeSelector.Label', 'per page')}</Typography>
    </Flex>
  )
}

export default PageSizeSelector
