import { Dialog, DialogBody, DialogFooter, Button, Flex, Typography } from '@strapi/design-system'
import { ReactElement } from 'react'
import { Trash, ExclamationMarkCircle } from '@strapi/icons'
import { useFormatMessage } from '../../hooks/useFormatMessage'

interface PropType {
  isOpen: boolean
  children: JSX.Element | string
  onClose: () => void
  onConfirm: () => void
  endIcon?: ReactElement
}
const ConfirmationDialog: React.FC<PropType> = ({ isOpen, children, onClose, onConfirm, endIcon = <Trash /> }) => {
  const formatMessage = useFormatMessage()
  return (
    <>
      <Dialog title={formatMessage('ConfirmDialog.Title', 'Confirmation')} isOpen={isOpen} onClose={onClose}>
        <DialogBody icon={<ExclamationMarkCircle />}>
          <Flex alignItems="center" textAlign="center" direction="column" gap={1}>
            <Typography>{children}</Typography>
          </Flex>
        </DialogBody>
        <DialogFooter
          startAction={
            <Button onClick={onClose} variant="tertiary">
              {formatMessage('Button.Cancel', 'Cancel')}
            </Button>
          }
          endAction={
            <Button variant="danger-light" startIcon={endIcon} onClick={onConfirm}>
              {formatMessage('Button.Confirm', 'Confirm')}
            </Button>
          }
        />
      </Dialog>
    </>
  )
}

export default ConfirmationDialog
