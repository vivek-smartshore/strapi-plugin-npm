import React from 'react'
import { IconButton } from '@strapi/design-system'
import { CarretUp, CarretDown } from '@strapi/icons'
import { SortOrders } from '../types'

interface SortingProps {
  sortOrder: SortOrders
  onSort: (val: string) => void
  field: string
  sortActive: string
}

const Sorting: React.FC<SortingProps> = ({ sortOrder, onSort, field, sortActive }) => {
  const label = field.charAt(0).toUpperCase() + field.slice(1)
  const isActive = sortActive.toLocaleLowerCase() === label.toLocaleLowerCase()

  return (
    <IconButton size="S" noBorder label={`Sort by ${label}`} onClick={() => onSort(field)}>
      {isActive ? sortOrder === 'ASC' ? <CarretUp /> : <CarretDown /> : <></>}
    </IconButton>
  )
}

export default Sorting
