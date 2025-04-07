import React, { useRef, useState } from 'react'
import { Button, Flex } from '@strapi/design-system'
import { FilterPopoverURLQuery, FilterListURLQuery, useQueryParams, FilterData } from '@strapi/helper-plugin'
import { Filter } from '@strapi/icons'
import { useFormatMessage } from '../hooks/useFormatMessage'

interface FiltersProps {
  filtersSchema: (typeof FilterData)[]
  onChange: (newFilters: typeof FilterData) => void
}
const Filters: React.FC<FiltersProps> = ({ filtersSchema, onChange }) => {
  const formatMessage = useFormatMessage()
  const [isVisible, setIsVisible] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const handleToggle = () => {
    setIsVisible((prev) => !prev)
  }
  const [{ query }, setQuery] = useQueryParams()

  return (
    <Flex paddingLeft={10} paddingRight={10} paddingBottom={4} background="neutral100">
      <Button
        startIcon={<Filter width={12} height={12} />}
        variant="tertiary"
        onClick={handleToggle}
        size="S"
        ref={buttonRef}
        style={{ justifySelf: 'flex-start' }}
      >
        {formatMessage('Filters', 'Filters')}
      </Button>
      <FilterPopoverURLQuery
        displayedFilters={filtersSchema}
        isVisible={isVisible}
        onToggle={handleToggle}
        source={buttonRef}
        onChange={(newFilters: typeof FilterData) => {
          setQuery({ filters: newFilters })
          onChange(newFilters)
        }}
      />
      <FilterListURLQuery filtersSchema={filtersSchema} />
    </Flex>
  )
}
export default Filters
