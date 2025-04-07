import React from 'react'
import { escapeHtml } from '../utils/sanitize'

interface HTMLMarkDownProps {
  children: string | number
}

const HTMLMarkDown: React.FC<HTMLMarkDownProps> = ({ children }) => {
  let content: string

  if (typeof children === 'string') {
    const escapedString = escapeHtml(children)
    // Convert newline characters to <br /> tags
    content = escapedString.replace(/\n/g, '<br />')
  } else {
    // Directly use the number as string without modification
    content = children.toString()
  }

  return <span dangerouslySetInnerHTML={{ __html: content }} />
}

export default HTMLMarkDown
