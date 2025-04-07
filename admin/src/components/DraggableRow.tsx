import React, { DragEvent } from 'react'
import { Tr } from '@strapi/design-system'
import styled from 'styled-components'

interface DraggableRowProps {
  index: number
  onDropHandler: (fromIndex: number, toIndex: number) => void
  draggableContent: React.ReactNode
}

const HighlightedTr = styled(Tr)`
  user-select: none;
  pointer-events: none;
`

const DraggableRow: React.FC<DraggableRowProps> = ({ index, onDropHandler, draggableContent }) => {
  const onDragStart = (e: DragEvent<HTMLTableRowElement>) => {
    e.dataTransfer.setData('dragIndex', index.toString())
  }

  const onDragOver = (e: DragEvent<HTMLTableRowElement>) => {
    e.preventDefault()
  }

  const onDrop = (e: DragEvent<HTMLTableRowElement>) => {
    const fromIndex = parseInt(e.dataTransfer.getData('dragIndex'), 10)
    if (fromIndex !== index) {
      onDropHandler(fromIndex, index)
    }
  }

  return (
    <HighlightedTr onDragStart={onDragStart} onDragOver={onDragOver} onDrop={onDrop} draggable>
      {draggableContent}
    </HighlightedTr>
  )
}

export default DraggableRow
