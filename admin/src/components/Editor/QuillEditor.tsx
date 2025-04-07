import React, { useEffect } from 'react'
import { useQuill } from 'react-quilljs'
import 'quill/dist/quill.snow.css'
import styled from 'styled-components'
import { Box, Typography } from '@strapi/design-system'
import { useFormatMessage } from '../../hooks/useFormatMessage'

interface QuillProps {
  value: string
  onChange: (content: string) => void
  error?: string
}

const QuillContainer = styled(Typography)`
  .ql-toolbar {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    border: 1px solid rgb(220, 220, 228) !important;
    @media (prefers-color-scheme: dark) {
      border: 1px solid rgb(74, 74, 106) !important;
    }
    .ql-stroke {
      @media (prefers-color-scheme: dark) {
        fill: none;
        stroke: #fff;
      }
    }
    .ql-fill {
      @media (prefers-color-scheme: dark) {
        fill: #fff;
        stroke: none;
      }
    }
    .ql-picker {
      @media (prefers-color-scheme: dark) {
        color: #fff;
      }
    }
  }
  .ql-container {
    min-height: 10rem;
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    background: #fff;
    border: 1px solid rgb(220, 220, 228) !important;
    border-top: 0 !important;
    @media (prefers-color-scheme: dark) {
      border: 1px solid rgb(74, 74, 106) !important;
      border-top: 0 !important;
    }
    @media (prefers-color-scheme: dark) {
      background: rgb(33, 33, 52);
    }
  }
  .ql-editor {
    height: 100%;
    flex: 1;
    overflow-y: auto;
    width: 100%;
    color: #000;
    @media (prefers-color-scheme: dark) {
      color: #fff !important;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      font-weight: bold;
    }

    strong {
      font-weight: bold;
    }
    em {
      font-style: italic;
    }
  }

  .ql-editor.ql-blank::before {
    color: unset;
  }
`

const ErrorBox = styled(Box)`
  color: #d02b20;
  font-size: 0.75rem;
  margin-top: 0.313rem;
`

const QuillEditor: React.FC<QuillProps> = ({ value, onChange, error }) => {
  const formatMessage = useFormatMessage()
  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    //according to quill docs false = normal
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
    ['clean'],
  ]

  const formats = [
    'bold',
    'italic',
    'underline',
    'strike',
    'align',
    'list',
    'indent',
    'size',
    'header',
    'link',
    'image',
    'video',
    'color',
    'background',
    'font',
  ]

  const { quill, quillRef, Quill } = useQuill({
    theme: 'snow',
    placeholder: formatMessage('QuillEditor.Placeholder', 'Enter text here...'),
    modules: {
      toolbar: toolbarOptions,
      clipboard: {
        matchVisual: true,
      },
    },
    formats,
    bounds: '#quill-container',
  })

  // Make sure fonts are added as inline style
  if (Quill && !quill) {
    const directionClass = Quill.import('attributors/style/direction')
    const fontClass = Quill.import('attributors/style/font')
    const alignClass = Quill.import('attributors/style/align')

    fontClass.whitelist = [
      'sans-serif',
      'monospace',
      'serif',
      'Georgia',
      'palatino-linotype',
      'times-new-roman',
      'Arial',
      'Helvetica',
      'arial-black',
      'comic-sans-ms',
      'Charcoal',
      'Impact',
      'lucida-sans-unicode',
      'lucida-grande',
      'Tahoma',
      'Geneva',
      'trebuchet-ms',
      'Verdana',
      'courier-new',
      'lucida-console',
      'Mirza',
      'Roboto',
    ]

    Quill.register(fontClass, true)
    Quill.register(alignClass, true)
    Quill.register(directionClass, true)
  }

  useEffect(() => {
    if (quill) {
      if (value !== quill.root.innerHTML) {
        const delta = quill.clipboard.convert({ html: value })
        quill.setContents(delta)
      }

      const handleTextChange = () => {
        const content = quill.root.innerHTML
        onChange(content)
      }

      quill.on('text-change', handleTextChange)

      return () => {
        quill.off('text-change', handleTextChange)
      }
    }
  }, [quill, value, onChange])

  return (
    <>
      <QuillContainer id="quill-container">
        <Typography ref={quillRef} />
      </QuillContainer>
      {error && <ErrorBox>{error}</ErrorBox>}
    </>
  )
}

export default QuillEditor
