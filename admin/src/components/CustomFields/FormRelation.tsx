import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { SingleSelect, SingleSelectOption, Typography, Box } from '@strapi/design-system'
import styled from 'styled-components'
import { useFormsApi } from '../../hooks/useFormsAPI'
import { Form } from '../../../../types'
import { useFormatMessage } from '../../hooks/useFormatMessage'

interface InputProps {
  attribute: {
    type: 'select-one' | 'select-multiple'
  }
  disabled: boolean
  intlLabel: any
  name: string
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
  required: boolean
  value: number
}
const CustomBox = styled(Box)`
  div[role='combobox'] {
    z-index: 9999 !important;
    cursor: pointer;
  }
`
const Input: React.ForwardRefRenderFunction<HTMLSelectElement, InputProps> = (props, ref) => {
  const formatMessage = useFormatMessage()
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props
  const [val, setVal] = useState<number | undefined>(value < 1 ? undefined : value)
  const [forms, setForms] = useState<Form[]>([])
  const { getAllForms } = useFormsApi()

  const handleChange = (e: number) => {
    setVal(e)
    onChange({
      target: { name, type: attribute.type, value: e },
    })
  }

  const handleClear = (e: number | undefined) => {
    setVal(undefined)
    onChange({
      target: { name, type: attribute.type, value: 0 },
    })
  }

  const getAllFormsHandler = async () => {
    const formParams = { fields: ['name', 'id'] }
    const response = await getAllForms(formParams)
    if (response) {
      setForms(response?.data)
    }
  }

  useEffect(() => {
    getAllFormsHandler()
  }, [])

  return (
    <CustomBox style={{ width: 'fit-content', minWidth: '300px' }}>
      <SingleSelect
        label={formatMessage(intlLabel, 'Select Form')}
        placeholder={formatMessage('Select.Placeholder', 'Select Form')}
        onClear={handleClear}
        value={val}
        ref={ref}
        name={name}
        disabled={disabled}
        required={required}
        onChange={handleChange}
      >
        {forms?.length ? (
          forms.map((form) => (
            <SingleSelectOption
              key={form.id}
              value={form.id}
              style={{
                display: 'block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '300px',
              }}
            >
              <Typography
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '200px',
                  width: '100%',
                  zIndex: -1,
                }}
              >
                {form.id}: {form.attributes.name}
              </Typography>
            </SingleSelectOption>
          ))
        ) : (
          <Typography
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '200px',
              width: '100%',
              padding: '10px',
            }}
          >
            {formatMessage('CustomField.NoForms', 'No published forms found')}
          </Typography>
        )}
      </SingleSelect>
    </CustomBox>
  )
}

export default React.forwardRef(Input)
