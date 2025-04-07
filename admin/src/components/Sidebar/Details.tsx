import { Box, Button, Typography, GridItem, Status, Flex } from '@strapi/design-system'
import { Trash } from '@strapi/icons/'
import { InfoDetailsOptional } from '../../types'
import { useMemo } from 'react'
import InfoBox from './InfoBox'
import { useFormatMessage } from '../../hooks/useFormatMessage'

interface PropType {
  page: 'forms' | 'submissions'
  isPublished?: boolean
  infoDetails: InfoDetailsOptional
  onConfirm: () => void
}


const SidebarDetails: React.FC<PropType> = ({ page, isPublished, infoDetails, onConfirm }) => {
  const formatMessage = useFormatMessage()
  const status = {
    success: formatMessage('MessageContent.Success', 'published version'),
    secondary: formatMessage('MessageContent.Draft', 'draft version'),
  }
  const variant = useMemo(() => (isPublished ? 'success' : 'secondary'), [isPublished])
  const type = useMemo(() => (page == 'forms' ? 'form' : 'submission'), [page])

  return (
    <>
      <Flex direction="column" gap={4}>
        {page == 'forms' && (
          <Status variant={variant} width="100%">
            <Typography>
              {formatMessage('MessageContent.EditingText','Editing')} <Typography fontWeight="bold">{status[variant]}</Typography>
            </Typography>
          </Status>
        )}
        <InfoBox details={infoDetails}></InfoBox>
        <Button variant="danger-light" onClick={onConfirm} startIcon={<Trash />} width="100%">
          {formatMessage('FormEdit.DeleteButton', 'Delete this')} {type}
        </Button>
      </Flex>
    </>
  )
}

export default SidebarDetails
