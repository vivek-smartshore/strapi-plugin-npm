import React from 'react'
import { Button, EmptyStateLayout } from '@strapi/design-system'
import { Plus, EmptyDocuments } from '@strapi/icons'
import { useFormatMessage } from '../../hooks/useFormatMessage'

interface EmptyStateContentProps {
  content: string
  onAddEntry?: () => void
}

const EmptyStateContent: React.FC<EmptyStateContentProps> = ({ content, onAddEntry }) => {
const formatMessage = useFormatMessage()
  return (
    <EmptyStateLayout
      icon={<EmptyDocuments width={160} />}
      content={content}
      action={
        onAddEntry && (
          <Button variant="secondary" startIcon={<Plus />} onClick={onAddEntry}>
            {formatMessage('EmptyStateContent.CreateNewEntry', 'Create new entry')}
          </Button>
        )
      }
    />
  )
}

export default EmptyStateContent
