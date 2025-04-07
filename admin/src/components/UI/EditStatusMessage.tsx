import React from 'react'
import styled from 'styled-components'
import { Typography } from '@strapi/design-system'
import { useFormatMessage } from '../../hooks/useFormatMessage'

interface MessageProps {
  type: 'success' | 'draft'
}

const MessageWrapper = styled.div<{ backgroundColor: string; borderColor: string }>`
  border-radius: 4px;
  background-color: ${({ backgroundColor }) => backgroundColor};
  padding: 10px;
  border: 1px solid ${({ borderColor }) => borderColor};
  strong {
    font-weight: 700;
  }
`
const StyledTypography = styled(Typography)`
  display: inline-block;
  position: relative;
  padding-left: 20px;

  :before {
    content: '';
    display: inline-block;
    position: absolute;
    left: 5px;
    top: 50%;
    transform: translateY(-50%);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: currentColor;
  }
`
const styles = {
  success: {
    backgroundColor: '#eafbe7',
    borderColor: '#c6f0c2',
    textColor: 'success700',
  },
  draft: {
    backgroundColor: '#eaf5ff',
    borderColor: '#b8e1ff',
    textColor: 'secondary700',
  },
}


const EditStatusMessage: React.FC<MessageProps> = ({ type }) => {
  const formatMessage = useFormatMessage()
  const { backgroundColor, borderColor, textColor } = styles[type]
  const messageContent = {
    success: (
      <>
        {formatMessage('MessageContent.EditingText','Editing')} <strong>{formatMessage('MessageContent.Success','published version')}</strong>
      </>
    ),
    draft: (
      <>
        {formatMessage('MessageContent.EditingText','Editing')} <strong>{formatMessage('MessageContent.Draft','draft version')}</strong>
      </>
    ),
  }
  
  const getMessageContent = (type: 'success' | 'draft') => messageContent[type]
  const message = getMessageContent(type)
  return (
    <MessageWrapper backgroundColor={backgroundColor} borderColor={borderColor}>
      <StyledTypography textColor={textColor}>{message}</StyledTypography>
    </MessageWrapper>
  )
}

export default EditStatusMessage
