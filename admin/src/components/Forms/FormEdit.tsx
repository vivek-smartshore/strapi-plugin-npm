import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import ConfirmationDialog from '../UI/ConfirmationDialog'
import styled from 'styled-components'
import { Plus, Trash, Pencil } from '@strapi/icons'
import { Box, Flex, Typography, Td, TFooter, TextInput, Grid, GridItem, IconButton, ToggleInput } from '@strapi/design-system'
import { LoadingIndicatorPage } from '@strapi/helper-plugin'
import { FieldData, FormAttributes } from '../../../../types'
import { InfoDetailsOptional } from '../../types'
import { FormValidation } from '../../types/forms'
import CustomizeFieldModal from '../Modals/CustomizeFieldModal'
import FormDelete from './FormDelete'
import QuillEditor from '../Editor/QuillEditor'
import SidebarDetails from '../Sidebar/Details'
import { useFormsApi } from '../../hooks/useFormsAPI'
import DraggableRow from '../DraggableRow'
import { fieldIconGenerator } from '../FieldIcon'
import DataTable from '../UI/DataTable'
import FormURLs from '../../utils/urls'
import { useFormatMessage } from '../../hooks/useFormatMessage'
import pluginId from '../../pluginId'

const StyledIconButton = styled(IconButton)`
  pointer-events: auto;
  border: none;
  background-color: transparent;
  padding: 0;
  width: auto;
  cursor: pointer;
`
const StyledActionIconButton = styled(IconButton)`
  pointer-events: auto;
  border: none;
  cursor: pointer;
`

interface FormEditProps {
  formId: number
  submissionCount: number
  setFormContent: (formContent: any) => void
  formContent: any
  getSingleForm: (id: number) => void
  published: boolean
  setFormNameChanged: (formNameChanged: boolean) => void
  formNameChanged: boolean
  validation: FormValidation
}

// TODO: move the majority of the logic to a seperate component so it can be used for AddForm as well.
const FormEdit: React.FC<FormEditProps> = ({
  formId,
  submissionCount,
  setFormContent,
  formContent,
  published,
  validation,
}) => {
  const formatMessage = useFormatMessage()
  const [loading, setLoading] = useState<boolean>(false)
  const [editvisible, setEditVisible] = useState<Boolean>(false)
  const [field, setField] = useState<FieldData>({} as FieldData)
  const [isFormDialogOpen, setFormDialog] = useState(false)
  const [isFieldDialogOpen, setFieldDialog] = useState<boolean>(false)
  const [fieldId, setFieldId] = useState<string>('')
  const [newFormField, setNewFormField] = useState<boolean>(false)
  const history = useHistory()
  const { deleteForm } = useFormsApi()
  const infoDetails: InfoDetailsOptional = {
    Created: formContent.createdAt,
    'Last updated': formContent.updatedAt,
  }

  const generateRandomId = () => '_' + Math.random().toString(36).substr(2, 9)

  const updateFormFields = (data: FieldData) => {
    setFormContent((prevState: FormAttributes) => {
      if (!prevState) return prevState
      let allFields = prevState.allFields ?? []

      if (newFormField) {
        if (data.type !== 'number') {
          delete data['numberOfDecimals']
          delete data['numberRange']
        }
        const newFieldData = {
          ...data,
          isRequired: data.isRequired || false,
          id: generateRandomId(),
          isNew: true,
        }
        allFields = [...allFields, newFieldData]
        setNewFormField(false)
        setEditVisible(false)
      } else {
        allFields = allFields?.map((field: FieldData) => {
          if (field.id === data.id) {
            return { ...field, ...data }
          }
          return field
        })
        setEditVisible(false)
      }
      allFields = allFields.map((field: FieldData) => {
        if (!['text', 'textarea', 'dropdown'].includes(field.type)) {
          const { placeholder, ...rest } = field
          return { ...rest }
        }

        if (field.type !== 'number') {
          const { numberOfDecimals, numberRange, ...rest } = field
          return { ...rest }
        }

        return field
      })

      allFields = allFields?.map((field: FieldData, index: number) => {
        if (!['text', 'textarea'].includes(field.type)) {
          const { textConstraints, ...rest } = field
          return rest
        }
        return field
      })
      return { ...prevState, allFields }
    })
  }

  const handleFormContentChange = (value: string, key: string) => {
    if (['name', 'submit'].includes(key)) {
      setFormContent((prev: any) => {
        if (!prev) return prev

        return { ...prev, [key]: value }
      })
    } else if (['subject', 'content', 'isConfirmationEmail'].includes(key)) {
      setFormContent((prev: any) => {
        if (!prev) return prev

        return {
          ...prev,
          confirmationEmail: { ...prev.confirmationEmail, [key]: value },
        }
      })
    } else {
      setFormContent((prev: any) => {
        if (!prev) return prev
      })
    }
  }

  const editHandler = (field: FieldData) => {
    setField(field)
    setEditVisible(true)
  }

  const onDropHandler = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return
    setFormContent((prevState: FormAttributes) => {
      if (!prevState || !prevState.allFields) return prevState
      const updatedFields = [...prevState.allFields]
      const [movedField] = updatedFields.splice(fromIndex, 1)
      updatedFields.splice(toIndex, 0, movedField)
      return {
        ...prevState,
        allFields: updatedFields,
      }
    })
  }

  const draggableRowData = (field: FieldData) => {
    return (
      <>
        <Td>
          <Typography textColor="neutral800" variant="body">
            <Flex>
              <Flex paddingRight={4} gap={4}>
                <StyledIconButton icon={fieldIconGenerator('drag')} variant="ghost" />
                {fieldIconGenerator(field.type)}
              </Flex>
              <Box>{field.label}</Box>
            </Flex>
          </Typography>
        </Td>
        <Td>
          <Typography textColor="neutral800">{field.type}</Typography>
        </Td>
        <Td>
          <Flex justifyContent="flex-end">
            <StyledActionIconButton
              onMouseDown={(e: MouseEvent) => {
                e.stopPropagation()
                editHandler(field)
              }}
              onClick={(e: MouseEvent) => {
                e.stopPropagation()
                editHandler(field)
              }}
              label={formatMessage('FormEdit.ActionButton.Edit', 'Edit')}
              icon={<Pencil />}
            />
            <Box paddingLeft={1}>
              <StyledActionIconButton
                onMouseDown={(e: MouseEvent) => {
                  e.stopPropagation()
                  setFieldId(field.id)
                  setFieldDialog(true)
                }}
                onClick={(e: MouseEvent) => {
                  e.stopPropagation()
                  setFieldId(field.id)
                  setFieldDialog(true)
                }}
                label={formatMessage('FormEdit.ActionButton.Delete', 'Delete')}
                icon={<Trash />}
              />
            </Box>
          </Flex>
        </Td>
      </>
    )
  }

  /* Field Dialog */
  const toggleFieldDialog = (value: boolean) => {
    setFieldDialog(value)
  }

  const deleteFieldHandler = () => {
    setFormContent((prevState: FormAttributes) => {
      if (!prevState) return prevState

      const updatedFields = prevState.allFields.filter((field) => field.id !== fieldId)

      return {
        ...prevState,
        allFields: updatedFields,
      }
    })
    toggleFieldDialog(false)
  }

  /* Form Dialog */
  const toggleFormDialog = (value: boolean) => {
    setFormDialog(value)
  }

  const deleteFormHandler = async () => {
    setLoading(true)
    const success = await deleteForm(formId)
    if (success) {
      history.push(FormURLs.LISTING_WITH_QUERY())
    }
    setLoading(false)
  }

  if (loading) return <LoadingIndicatorPage />

  return (
    <>
      {formContent && (
        <Box padding={10} paddingTop="0px">
          <Grid
            gap={{
              desktop: 5,
              tablet: 2,
              mobile: 1,
            }}
          >
            <GridItem col={9} s={12}>
              <Box paddingBottom={5}>
                <Typography
                  fontWeight="bold"
                  style={{ fontSize: '12px', display: 'inline-block', paddingBottom: '4px' }}
                >
                  {formatMessage('Components.FormEdit.Name', 'Name')}
                </Typography>
                <TextInput
                  placeholder={formatMessage('FormEdit.Name.Placeholder', 'Your form name')}
                  aria-label={formatMessage('Form.NamePlaceholder', 'Form Name')}
                  name={formatMessage('Form.NamePlaceholder', 'Form Name')}
                  error={validation?.name ? formatMessage('FormEdit.NameRequired', 'Name is required') : undefined}
                  onChange={(e: any) => handleFormContentChange(e.target.value, 'name')}
                  value={formContent.name}
                />
              </Box>
              <Box paddingBottom={3}>
                <Typography variant="beta" fontWeight="bold">
                  {formatMessage('FormEdit.EmailSettings.Title', 'Confirmation Email Settings')}
                </Typography>
              </Box>
              {/* toggle */}
              <Box paddingBottom={3}>
                <ToggleInput
                  checked={formContent.confirmationEmail.isConfirmationEmail}
                  label={formatMessage(
                    'FormField.SubmissionConfiemEmail.ToggleLabel',
                    'Do you want send confirmation email on submission?'
                  )}
                  offLabel={formatMessage('SettingsPage.ToggleOffLabel', 'Disable')}
                  onLabel={formatMessage('SettingsPage.ToggleOnLabel', 'Enable')}

                  name={`${pluginId}__confirmation_submission_form`}
                  onChange={(e: any) => handleFormContentChange(e.target.checked, 'isConfirmationEmail')}
                />
              </Box>
              {formContent.confirmationEmail.isConfirmationEmail && <>
                <Box
                  paddingBottom={3}
                  paddingLeft={1}
                  title="The subject of the email that will be sent after the form is saved"
                >
                  <Typography
                    fontWeight="bold"
                    style={{ fontSize: '12px', display: 'inline-block', paddingBottom: '4px' }}
                  >
                    {formatMessage('FormEdit.Email.Subject', 'Subject')}
                  </Typography>
                  <TextInput
                    placeholder={formatMessage('FormEdit.EmailSettings.Placeholder', 'Your subject name')}
                    aria-label={formatMessage('FormEdit.EmailSettings.Label', 'Email Confirmation Email Subject')}
                    name={formatMessage('FormEdit.EmailSettings.Label', 'Email Confirmation Email Subject')}
                    onChange={(e: any) => handleFormContentChange(e.target.value, 'subject')}
                    value={formContent.confirmationEmail.subject}
                  />
                </Box>
                <Box paddingBottom={3} paddingLeft={1}>
                  <Typography
                    fontWeight="bold"
                    style={{ fontSize: '12px', display: 'inline-block', paddingBottom: '4px' }}
                  >
                    {formatMessage('FormEdit.Email.Body', 'Body')}
                  </Typography>
                  <QuillEditor
                    value={formContent.confirmationEmail.content}
                    onChange={(content) => handleFormContentChange(content, 'content')}
                  />
                </Box>
              </>}
              <Box paddingLeft={1}>
                <Typography
                  fontWeight="bold"
                  style={{ fontSize: '12px', display: 'inline-block', paddingBottom: '4px' }}
                >
                  {formatMessage('FormEdit.SubmitButton.Label', 'Submit Button Text')}
                </Typography>
                <TextInput
                  placeholder={formatMessage('FormEdit.SubmitButton.Placeholder', 'Enter text for submit button label')}
                  aria-label={formatMessage('FormEdit.SubmitButton.Label', 'Submit Button Text')}
                  name={formatMessage('FormEdit.SubmitButton.Label', 'Submit Button Text')}
                  error={
                    validation.submit
                      ? formatMessage('FormEdit.SubmitButton.Error', 'Submit button text is required')
                      : undefined
                  }
                  onChange={(e: any) => handleFormContentChange(e.target.value, 'submit')}
                  value={formContent.submit}
                />
              </Box>
            </GridItem>
            <GridItem padding={1} col={3} s={12}>
              <SidebarDetails
                page="forms"
                isPublished={published}
                infoDetails={infoDetails}
                onConfirm={() => setFormDialog(true)}
              ></SidebarDetails>
            </GridItem>
          </Grid>
        </Box>
      )}
      <Box padding={10} paddingBottom={2} paddingTop={2}>
        <Box paddingBottom={1}>
          <Typography variant="beta" fontWeight="bold">
            {formatMessage('FormEdit.Fields.Title', 'Form Fields')}
          </Typography>
        </Box>
        <Box background="neutral100">
          <DataTable
            data={formContent?.allFields || []}
            renderRow={(field: FieldData, index: number) => (
              <DraggableRow
                key={field.id}
                index={index}
                onDropHandler={onDropHandler}
                draggableContent={draggableRowData(field)}
              />
            )}
            headers={[
              {
                field: 'name',
                label: formatMessage('FormEdit.Fields.Name', 'Field Name'),
                sortable: false,
              },
              {
                field: 'type',
                label: formatMessage('FormEdit.Fields.Type', 'Field Type'),
                sortable: false,
              },
            ]}
            emptyMessage={formatMessage('FormEdit.Fields.EmptyMessage', 'No Fields')}
            footer={
              <TFooter
                icon={<Plus />}
                onClick={() => {
                  setEditVisible(true)
                  setNewFormField(true)
                  setField({
                    id: '',
                    label: '',
                    type: 'text',
                    options: [],
                    isRequired: false,
                    placeholder: '',
                    numberOfDecimals: 0,
                  })
                }}
              >
                {formatMessage('FormEdit.Fields.Add', 'Add field to the form')}
              </TFooter>
            }
          />
        </Box>
      </Box>

      {/* Delete field dialog */}
      <ConfirmationDialog
        isOpen={isFieldDialogOpen}
        onClose={() => toggleFieldDialog(false)}
        onConfirm={deleteFieldHandler}
      >
        {formatMessage(
          'ConfirmationDialog.Title',
          'Are you sure you want to change the type of the Field? If you do, any submitted content associated with this field will also be permanently lost.'
        )}
      </ConfirmationDialog>
      {/* Delete form dialog */}
      <ConfirmationDialog
        isOpen={isFormDialogOpen}
        onClose={() => toggleFormDialog(false)}
        onConfirm={deleteFormHandler}
      >
        <FormDelete submissionCount={submissionCount} formId={formId} />
      </ConfirmationDialog>

      {editvisible && (
        <CustomizeFieldModal
          field={field}
          onModalVisible={() => {
            setEditVisible(false)
            setNewFormField(false)
          }}
          onUpdatedField={(field: FieldData) => updateFormFields(field)}
          formType={newFormField ? 'newForm' : 'editForm'}
        />
      )}
    </>
  )
}

export default FormEdit
