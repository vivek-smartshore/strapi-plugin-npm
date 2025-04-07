/*
Took reference from Strapi's /core/content-type-builder/admin/src/components/CustomRadioGroup/CustomRadioGroup.tsx
*/

import React from 'react'
import { RadioGroup, Box, Typography, Grid, GridItem, Flex } from '@strapi/design-system'
import styled from 'styled-components'

interface RadioGroupComponentProps {
  inputTypes: { type: string; label: string; description: string }[]
  currentFieldType: string
  onChange: (value: string) => void
  newFormLabel: boolean
  formType?: 'newForm' | 'editForm'
  setNewFormLabel: (value: boolean) => void
  handleNewFormNext: (type: string) => void
}

const Wrapper = styled(Flex)`
  position: relative;
  align-items: stretch;

  label {
    border-radius: 4px;
    max-width: 50%;
    cursor: pointer;
    user-select: none;
    flex: 1;
  }

  input {
    position: absolute;
    opacity: 0;
  }

  .option {
    height: 100%;
    border-radius: 4px;
    border: 1px solid ${({ theme }) => theme.colors.neutral200};
    will-change: transform, opacity;
    cursor: pointer;

    .checkmark {
      position: relative;
      display: block;
      will-change: transform;
      background: #fff;
      width: 20px;
      height: 20px;
      border: solid 1px #c0c0cf;
      border-radius: 50%;
      @media (prefers-color-scheme: dark) {
        background: ${({ theme }) => theme.colors.neutral0};
      }

      &:before,
      &:after {
        content: '';
        display: block;
        border-radius: 50%;
        width: 12px;
        height: 12px;
        position: absolute;
        top: 3px;
        left: 3px;
      }

      &:after {
        transform: scale(0);
        transition: inherit;
        will-change: transform;
      }
    }
  }

  input:checked ~ div {
    background: #f0f0ff;
    @media (prefers-color-scheme: dark) {
      background: ${({ theme }) => theme.colors.neutral100};
    }
    ${Typography} {
      color: #4945ff;
      @media (prefers-color-scheme: dark) {
        color: ${({ theme }) => theme.colors.primary600};
      }
    }
    border: 1px solid ${({ theme }) => theme.colors.primary600};
    .checkmark {
      border: solid 1px #4945ff;

      @media (prefers-color-scheme: dark) {
        border: solid 1px ${({ theme }) => theme.colors.primary600};
        background: ${({ theme }) => theme.colors.neutral100};
      }
      &::after {
        background: #4945ff;
        @media (prefers-color-scheme: dark) {
          background: ${({ theme }) => theme.colors.primary600};
        }
        transform: scale(1);
      }
    }
    .option {
      border: 1px solid red;
    }
  }
`

const RadioGroupComponent: React.FC<RadioGroupComponentProps> = ({
  inputTypes,
  currentFieldType,
  onChange,
  formType,
  setNewFormLabel,
  handleNewFormNext,
}) => {
  const handleTypeChange = (value: string) => {
    if (formType === 'editForm') {
      // Trigger confirmation dialog first in edit mode
      setNewFormLabel(true)
      onChange(value)
    } else {
      // Directly change type in new form
      handleNewFormNext(value)
    }
  }

  return (
    <RadioGroup labelledBy="type" value={currentFieldType} name="type">
      <Wrapper>
        <Grid gap={{ desktop: 2, tablet: 2, mobile: 1 }} alignItems="stretch">
          {inputTypes.map((inputType, index) => (
            <GridItem padding={1} col={6} key={index}>
              <input
                name={inputType.type}
                className="option-input"
                checked={inputType.type === currentFieldType}
                value={inputType.type}
                type="radio"
                onChange={(e) => handleTypeChange(e.target.value)}
              />
              <Flex
                className="option"
                padding={4}
                onClick={() => handleTypeChange(inputType.type)} // Clicking the box triggers the change
              >
                <Box paddingRight={4}>
                  <span className="checkmark"></span>
                </Box>
                <Box>
                  <Box marginBottom={2}>
                    <Typography
                      textColor="neutral800"
                      paddingBottom={2}
                      lineHeight="1.43"
                      fontSize="0.875rem"
                      fontWeight="bold"
                    >
                      {inputType.label}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography textColor="neutral600" fontSize="0.75" lineHeight="1.33">
                      {inputType.description}
                    </Typography>
                  </Box>
                </Box>
              </Flex>
            </GridItem>
          ))}
        </Grid>
      </Wrapper>
    </RadioGroup>
  )
}

export default RadioGroupComponent
