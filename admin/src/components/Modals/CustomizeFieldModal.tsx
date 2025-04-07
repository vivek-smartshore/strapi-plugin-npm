import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Checkbox,
  Flex,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalLayout,
  NumberInput,
  Tab,
  TabGroup,
  TabPanel,
  TabPanels,
  Tabs,
  TextInput,
  Textarea,
  Typography,
} from '@strapi/design-system'
import { FieldData, FieldOption } from '../../../../types'
import { Check } from '@strapi/icons'
import RadioGroupComponent from '../RadioGroup'
import ConfirmationDialog from '../UI/ConfirmationDialog'
import { useFormatMessage } from '../../hooks/useFormatMessage'

interface FieldProps {
  field: FieldData
  onModalVisible: (isVisible: boolean) => void
  onUpdatedField: (updatedField: FieldData) => void
  formType?: 'newForm' | 'editForm'
  formUID?: string
}

interface Validation {
  label: boolean
  decimal: boolean
  maxLength: boolean
  minLength: boolean
}

const CustomizeFieldModal: React.FC<FieldProps> = ({ field, onModalVisible, onUpdatedField, formType, formUID }) => {
  const formatMessage = useFormatMessage()
  const [currentField, setCurrentField] = useState<FieldData>(field)
  const [isRequired, setIsRequired] = useState<boolean>(field.isRequired)
  const [options, setOptions] = useState<FieldOption[]>(field.options || [])
  const [optionsAsString, setOptionsAsString] = useState<string>('')
  const [optionToggle, setOptionToggle] = useState<boolean>(false)
  const [isDialogOpen, setDialog] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState<string>('')
  const [modalTitle, setModalTitle] = useState<string>('')
  const [validations, setValidations] = useState<Validation>({
    label: false,
    decimal: false,
    maxLength: false,
    minLength: false,
  })
  const editTitle = formatMessage('CustomizeFieldModal.Title.EditField', 'Edit Field')
  useEffect(() => {
    initializeOptionsAsString()
    if (['radio', 'checkbox', 'dropdown'].includes(field.type)) {
      setOptionToggle(true)
    }

    if (formType === 'newForm') {
      setCurrentField((prev) => ({
        ...prev,
        label: '',
      }))
      setOptionToggle(false)
      setOptions([])
    }

    setModalTitle(formType === 'newForm' ? 'Add Field' : formUID || editTitle)
  }, [])

  useEffect(() => {
    updateOptionsFromTextarea()
  }, [optionsAsString])

  const initializeOptionsAsString = () => {
    const optionsString = options.map((option) => option.label).join('\n')
    setOptionsAsString(optionsString)
  }

  const updateCurrentField = (options: FieldOption[]) => {
    setCurrentField((prev) => ({
      ...prev,
      options: options,
    }))
  }

  const updateOptionsFromTextarea = () => {
    // if there are no options, update the field with an empty array
    if (!optionsAsString) {
      updateCurrentField([])
      return
    }
    const lines = optionsAsString.split('\n')

    const newOptions: FieldOption[] = lines
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => ({
        label: line,
        value: line.toLowerCase().replace(/[^a-zA-Z0-9-]/g, '-'),
      }))
    updateCurrentField(newOptions)
  }

  const inputTypes = [
    {
      type: 'text',
      label: formatMessage('FormField.Text', 'Text'),
      description: formatMessage(
        'FormField.TextDescription',
        'Allows users to input and edit alphanumeric text within a single-line text field.'
      ),
    },
    {
      type: 'number',
      label: formatMessage('FormField.Number', 'Number'),
      description: formatMessage(
        'FormField.NumberDescription',
        'Allows users to input and edit numeric values within a text field.'
      ),
    },
    {
      type: 'email',
      label: formatMessage('FormField.Email', 'Email'),
      description: formatMessage(
        'FormField.EmailDescription',
        'Allows users to input and edit email addresses with validation for correct email format.'
      ),
    },
    {
      type: 'radio',
      label: formatMessage('FormField.Radio', 'Radio'),
      description: formatMessage(
        'FormField.RadioDescription',
        'Presents a set of options where users can select only one choice from multiple options.'
      ),
    },
    {
      type: 'checkbox',
      label: formatMessage('FormField.Checkbox', 'Checkbox'),
      description: formatMessage(
        'FormField.CheckboxDescription',
        'Presents a set of options where users can select one or more choices from multiple options.'
      ),
    },
    {
      type: 'textarea',
      label: formatMessage('FormField.Textarea', 'Textarea'),
      description: formatMessage(
        'FormField.TextareaDescription',
        'Allows users to input and edit multiline text, typically for longer messages or descriptions.'
      ),
    },
    {
      type: 'date',
      label: formatMessage('FormField.Date', 'Date'),
      description: formatMessage(
        'FormField.DateDescription',
        'Allows users to input and edit dates with validation for correct date format.'
      ),
    },
    {
      type: 'dropdown',
      label: formatMessage('FormField.Dropdown', 'Dropdown'),
      description: formatMessage(
        'FormField.DropdownDescription',
        'Allows users to select one of a predefined set of options from a dropdown menu.'
      ),
    },
  ]

  type OptionType = 'label' | 'type' | 'isRequired' | 'placeholder' | 'min' | 'max' | 'maxLength' | 'minLength' | 'sendEmailConfirm'

  const updateFieldHandler = (value: string | boolean, optionType: OptionType) => {
    if (optionType === 'isRequired') setIsRequired(!isRequired)

    if (optionType === 'min' || optionType === 'max') {
      setCurrentField((prev) => {
        const { [optionType]: _, ...updatedNumberRange } = prev.numberRange || {}
        const removeNumberRange = Object.keys(updatedNumberRange).length === 0
        return {
          ...prev,
          numberRange: value
            ? {
                ...updatedNumberRange,
                [optionType]: prev.numberRange?.[optionType] ?? 0,
              }
            : removeNumberRange
            ? undefined
            : updatedNumberRange,
        }
      })
      return
    }
    if (optionType === 'minLength' || optionType === 'maxLength') {
      setCurrentField((prev) => {
        const { [optionType]: _, ...updatedTextConstraints } = prev.textConstraints || {}
        const removeTextConstraints = Object.keys(updatedTextConstraints).length === 0
        return {
          ...prev,
          textConstraints: value
            ? {
                ...updatedTextConstraints,
                [optionType]: prev.textConstraints?.[optionType] ?? 0,
              }
            : removeTextConstraints
            ? undefined
            : updatedTextConstraints,
        }
      })
      return
    }

    setCurrentField((prev) => {
      let updatedField = {
        ...prev,
        [optionType]: value,
      }

      if (
        optionType === 'type' &&
        ['text', 'textarea', 'dropdown'].includes(value as string) &&
        !updatedField.placeholder
      ) {
        updatedField.placeholder = ''
      }

      if (optionType === 'type') {
        if (value === 'number') {
          updatedField.numberOfDecimals = 0
        } else if (!['radio', 'checkbox', 'dropdown'].includes(value as string)) {
          const { options, ...rest } = updatedField
          updatedField = rest as FieldData
        }
      }

      return updatedField
    })

    if (optionType === 'type') {
      const isValidOption = ['radio', 'checkbox', 'dropdown'].includes(value as string)
      setOptionToggle(isValidOption)

      if (!isValidOption) {
        setOptions([])
      }
    }
  }

  const submitHandler = () => {
    const isTextOrTextarea = ['text', 'textarea'].includes(currentField.type)
    const validate = {
      label: !currentField.label.trim(),
      decimal:
        currentField.type === 'number' &&
        (currentField.numberOfDecimals === null ||
          currentField.numberOfDecimals === undefined ||
          currentField.numberOfDecimals < 0),
      maxLength:
        isTextOrTextarea &&
        currentField.textConstraints?.maxLength !== undefined &&
        currentField.textConstraints?.maxLength < 0,

      minLength:
        isTextOrTextarea &&
        currentField.textConstraints?.minLength !== undefined &&
        currentField.textConstraints?.minLength < 0,
    }

    setValidations(validate)

    const hasErrors = Object.values(validate).some(Boolean)
    if (hasErrors) return

    onUpdatedField(currentField)
    onModalVisible(false)
  }

  const handleFieldTypeChange = (type: string) => {
    if (formType === 'editForm') {
      // Show the confirmation dialog if in edit mode
      setInputValue(type)
      toggleDialog(true)
    } else {
      // Directly update the field type for new forms
      updateFieldHandler(type, 'type')
    }
  }

  const changeFieldTypeHandler = () => {
    updateFieldHandler(inputValue, 'type')
    toggleDialog(false)
  }

  const toggleDialog = (value: boolean) => {
    setDialog(value)
  }

  return (
    <ModalLayout onClose={() => onModalVisible(false)} labelledBy="title">
      <ModalHeader>
        <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
          {modalTitle}
        </Typography>
      </ModalHeader>

      <TabGroup label="Form Field Settings" id="tabs" variant="simple" initialSelectedTabIndex={0}>
        {field && (
          <ModalBody>
            <Flex justifyContent="space-between">
              <Box>
                <Box paddingBottom={1}>
                  <Typography variant="beta">
                    {formType === 'newForm' ? 'Select type of a field' : editTitle}
                  </Typography>
                </Box>
                <Box paddingBottom={4}>
                  {formType === 'editForm' && (
                    <Typography textColor="neutral600" style={{ fontSize: '12px' }}>
                      {formatMessage(
                        'CustomizeFieldModal.EditField.SubText',
                        'Edit the name or the type of the field below.'
                      )}
                    </Typography>
                  )}
                </Box>
              </Box>
              <Box>
                <Tabs>
                  <Tab>{formatMessage('CustomizeFieldModal.Tabs.BasicSettings', 'BASIC SETTINGS')}</Tab>
                  <Tab>{formatMessage('CustomizeFieldModal.Tabs.AdvancedSettings', 'ADVANCED SETTINGS')}</Tab>
                </Tabs>
              </Box>
            </Flex>
            <TabPanels>
              <TabPanel>
                <Box color="neutral800" background="neutral0" paddingTop={4} paddingBottom={4}>
                  <Box paddingBottom={1}>
                    <Typography fontWeight="bold" style={{ fontSize: '12px' }}>
                      {formatMessage('FieldSettings.Label', 'Label')}
                    </Typography>
                  </Box>
                  <Box width="50%" paddingBottom={4}>
                    <TextInput
                      placeholder={formatMessage('FieldSettings.Placeholder', 'Your label')}
                      aria-label={formatMessage('FieldSettings.Label', 'Label')}
                      name={formatMessage('FieldSettings.Label', 'Label')}
                      value={currentField?.label}
                      error={validations?.label && formatMessage('ValidationErrors.Label', 'Label is required')}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFieldHandler(e.target.value, 'label')}
                    />
                  </Box>
                  <Box paddingBottom={1}>
                    <Typography fontWeight="bold" style={{ fontSize: '12px' }}>
                      {formatMessage('FieldSettings.Type', 'Type')}
                    </Typography>
                  </Box>
                  <RadioGroupComponent
                    inputTypes={inputTypes}
                    currentFieldType={currentField?.type}
                    onChange={handleFieldTypeChange}
                    newFormLabel={formType === 'newForm'}
                    formType={formType}
                    setNewFormLabel={() => {}}
                    handleNewFormNext={handleFieldTypeChange}
                  />
                  {optionToggle && (
                    <Box paddingTop={4}>
                      <Textarea
                        placeholder={formatMessage('ValidationErrors.Placeholder', 'Ex: Morning\nNoon\nEvening')}
                        label={formatMessage('FieldSettings.TextareaLabel', 'Values (one line per value)')}
                        name="content"
                        value={optionsAsString}
                        hint={formatMessage(
                          'ValidationErrors.Hint',
                          'Each item per line will be the options for your radio, checkbox or dropdown.'
                        )}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setOptionsAsString(e.target.value)}
                      />
                    </Box>
                  )}
                </Box>
              </TabPanel>
              <TabPanel>
                {currentField?.type === 'number' && (
                  <>
                    <Box paddingBottom={1} paddingTop={4}>
                      <Typography fontWeight="bold" style={{ fontSize: '12px' }}>
                        {formatMessage('NumberSettings.TitleDecimals', 'Number of decimals')}
                      </Typography>
                    </Box>
                    <Box width="50%">
                      <NumberInput
                        id="decimals"
                        placeholder={formatMessage('Decimals.Placeholder', 'Enter number of decimals')}
                        onValueChange={(val: number) => {
                          setCurrentField((prev) => ({
                            ...prev,
                            numberOfDecimals: val,
                          }))
                        }}
                        value={currentField?.numberOfDecimals}
                        error={
                          validations.decimal &&
                          formatMessage('Decimal.Error', 'Number of decimals must be a non-negative number')
                        }
                      />
                    </Box>
                    <Flex alignItems="start" paddingBottom={1} paddingTop={4}>
                      <Box flex="1">
                        <Checkbox
                          id="maximum"
                          name="maximum"
                          value={currentField.numberRange && 'max' in currentField?.numberRange}
                          onValueChange={(toggle: boolean) => updateFieldHandler(toggle, 'max')}
                        >
                          <Typography>{formatMessage('NumberSettings.TitleMaxValue', 'Maximum value')}</Typography>
                        </Checkbox>
                        {currentField?.numberRange && 'max' in currentField?.numberRange && (
                          <Box width="50%" paddingTop={2} paddingLeft={6}>
                            <NumberInput
                              id="maximum"
                              placeholder={formatMessage('MaxValue.Placeholder', 'Enter maximum value')}
                              onValueChange={(val: number) => {
                                setCurrentField((prev) => ({
                                  ...prev,
                                  numberRange: {
                                    ...prev.numberRange,
                                    max: val,
                                  },
                                }))
                              }}
                              value={currentField?.numberRange?.max}
                            />
                          </Box>
                        )}
                      </Box>
                      <Box flex="1">
                        <Checkbox
                          id="minimum"
                          name="minimum"
                          value={currentField.numberRange && 'min' in currentField?.numberRange}
                          onValueChange={(toggle: boolean) => updateFieldHandler(toggle, 'min')}
                        >
                          <Typography>{formatMessage('NumberSettings.TitleMinValue', 'Minimum value')}</Typography>
                        </Checkbox>
                        {currentField?.numberRange && 'min' in currentField?.numberRange && (
                          <Box width="50%" paddingTop={2} paddingLeft={6}>
                            <NumberInput
                              id="minimum"
                              placeholder={formatMessage('MinValue.Placeholder', 'Enter minimum value')}
                              onValueChange={(val: number) => {
                                setCurrentField((prev) => ({
                                  ...prev,
                                  numberRange: {
                                    ...prev.numberRange,
                                    min: val,
                                  },
                                }))
                              }}
                              value={currentField?.numberRange?.min}
                            />
                          </Box>
                        )}
                      </Box>
                    </Flex>
                  </>
                )}

                {['text', 'textarea', 'dropdown'].includes(currentField?.type) && (
                  <>
                    <Box paddingBottom={1} paddingTop={4}>
                      <Typography fontWeight="bold" style={{ fontSize: '12px' }}>
                        {formatMessage('Placeholder.Label', 'Placeholder')}
                      </Typography>
                    </Box>
                    <Box width="50%">
                      <TextInput
                        aria-label="Placeholder"
                        name="placeholder"
                        value={currentField?.placeholder}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          updateFieldHandler(e.target.value, 'placeholder')
                        }
                      />
                    </Box>
                    <Box paddingTop={1}>
                      <Typography variant="pi" textColor="neutral600">
                        {formatMessage(
                          'Placeholder.Hint',
                          'This is the placeholder text that will be used for the field.'
                        )}
                      </Typography>
                    </Box>
                  </>
                )}

                {['text', 'textarea'].includes(currentField?.type) && (
                  <>
                    <Flex alignItems="start" paddingBottom={1} paddingTop={4}>
                      <Box flex="1">
                        <Checkbox
                          id="maximumLength"
                          name="maximumLength"
                          value={currentField.textConstraints && 'maxLength' in currentField?.textConstraints}
                          onValueChange={(toggle: boolean) => updateFieldHandler(toggle, 'maxLength')}
                        >
                          <Typography>{formatMessage('MaxLength.Label', 'Maximum length')}</Typography>
                        </Checkbox>
                        {currentField?.textConstraints && 'maxLength' in currentField?.textConstraints && (
                          <Box width="50%" paddingTop={2} paddingLeft={6}>
                            <NumberInput
                              id="maximumLength"
                              placeholder={formatMessage('MaxLength.Placeholder', 'Enter maximum length')}
                              onValueChange={(val: number) => {
                                setCurrentField((prev) => ({
                                  ...prev,
                                  textConstraints: {
                                    ...prev.textConstraints,
                                    maxLength: val,
                                  },
                                }))
                              }}
                              value={currentField?.textConstraints?.maxLength}
                              error={
                                validations?.maxLength &&
                                formatMessage('MaxLength.Error', 'Maximum length must be a non-negative number')
                              }
                            />
                          </Box>
                        )}
                      </Box>

                      <Box flex="1">
                        <Checkbox
                          id="minimumLength"
                          name="minimumLength"
                          value={currentField.textConstraints && 'minLength' in currentField?.textConstraints}
                          onValueChange={(toggle: boolean) => updateFieldHandler(toggle, 'minLength')}
                        >
                          <Typography>{formatMessage('MinLength.Label', 'Minimum length')}</Typography>
                        </Checkbox>
                        {currentField?.textConstraints && 'minLength' in currentField?.textConstraints && (
                          <Box width="50%" paddingTop={2} paddingLeft={6}>
                            <NumberInput
                              id="minimumLength"
                              placeholder={formatMessage('MinLength.Placeholder', 'Enter minimum length')}
                              onValueChange={(val: number) => {
                                setCurrentField((prev) => ({
                                  ...prev,
                                  textConstraints: {
                                    ...prev.textConstraints,
                                    minLength: val,
                                  },
                                }))
                              }}
                              value={currentField?.textConstraints?.minLength}
                              error={
                                validations?.minLength &&
                                formatMessage('MinLength.Error', 'Minimum length must be a non-negative number')
                              }
                            />
                          </Box>
                        )}
                      </Box>
                    </Flex>
                  </>
                )}

                {currentField?.type === 'email' && (
                  <Box flex="1">
                    <Checkbox
                      id="sendEmailConfirm"
                      name="sendEmailConfirm"
                      value={currentField.sendEmailConfirm}
                      onValueChange={(toggle: boolean) => updateFieldHandler(toggle, 'sendEmailConfirm')}
                    >
                      <Typography>{formatMessage('CustomizeFieldModal.EmailSendConfirm', 'Send Email to This Address?')}</Typography>
                    </Checkbox>
                </Box>
                )}

                <Box paddingBottom={1} paddingTop={4}>
                  <Checkbox
                    id="required"
                    name="required"
                    value={isRequired}
                    onValueChange={(toggle: boolean) => updateFieldHandler(toggle, 'isRequired')}
                  >
                    <Typography>{formatMessage('GeneralOptions.Required', 'Required?')}</Typography>
                  </Checkbox>
                </Box>
              </TabPanel>
            </TabPanels>
          </ModalBody>
        )}
      </TabGroup>

      <ModalFooter
        startActions={
          <Button onClick={() => onModalVisible(false)} variant="tertiary">
            {formatMessage('Button.Cancel', 'Cancel')}
          </Button>
        }
        endActions={<Button onClick={submitHandler}>{formatMessage('Button.Finish', 'Finish')}</Button>}
      />

      {/* Change field type confirmation dialog */}
      <ConfirmationDialog
        isOpen={isDialogOpen}
        onClose={() => toggleDialog(false)}
        onConfirm={changeFieldTypeHandler}
        endIcon={<Check />}
      >
        {formatMessage(
          'ConfirmationDialog.Title',
          'Are you sure you want to change the type of the Field? If you do, any submitted content associated with this field will also be permanently lost.'
        )}
      </ConfirmationDialog>
    </ModalLayout>
  )
}

export default CustomizeFieldModal
