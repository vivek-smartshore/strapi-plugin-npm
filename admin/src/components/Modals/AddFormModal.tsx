import { useState } from 'react'
import {
  TextInput,
  ModalLayout,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Button,
  Box,
  Typography,
} from '@strapi/design-system'
import { useFormatMessage } from '../../hooks/useFormatMessage'

interface Props {
  isOpen: boolean
  onClose: () => void
  onFormSubmit: (formTitle: string) => void
}

const AddFormModal: React.FC<Props> = ({ isOpen, onClose, onFormSubmit }) => {
  const formatMessage = useFormatMessage()
  const [formText, setFormText] = useState<string>('')
  const [error, setError] = useState<string>('')

  const handleFormSubmit = () => {
    if (formText.trim() === '') {
      setError(formatMessage('AddFormModal.InputError', 'Form name is required'))
    } else {
      setError('')
      onFormSubmit(formText)
    }
  }

  return (
    isOpen && (
      <ModalLayout onClose={onClose} labelledBy="title">
        <ModalHeader>
          <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
            {formatMessage('AddFormModal.Title', 'Create Form')}
          </Typography>
        </ModalHeader>

        <ModalBody>
          <Box color="neutral800" background="neutral0" paddingTop={4} paddingBottom={4}>
            <Box paddingBottom={1}>
              <Box paddingBottom={1}>
                <Typography fontWeight="bold" style={{ fontSize: '12px' }}>
                  {formatMessage('Form.NamePlaceholder', 'Form name')}
                </Typography>
              </Box>
              <TextInput
                placeholder={formatMessage('Form.NamePlaceholder', 'Form name')}
                aria-label={formatMessage('Form.NamePlaceholder', 'Form name')}
                name={formatMessage('Form.NamePlaceholder', 'Form name')}
                value={formText}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormText(e.target.value)}
              />
              {error && (
                <Box paddingTop={1}>
                  <Typography variant="pi" textColor="danger600">
                    {error}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </ModalBody>

        <ModalFooter
          startActions={
            <Button onClick={onClose} variant="tertiary">
              {formatMessage('Button.Cancel', 'Cancel')}
            </Button>
          }
          endActions={
            <Button onClick={handleFormSubmit}>{formatMessage('Button.Finish', 'Finish')}</Button>
          }
        />
      </ModalLayout>
    )
  )
}

export default AddFormModal
