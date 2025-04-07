import React, { useRef } from 'react'
import { Box, Flex, Button, GridItem, Typography } from '@strapi/design-system'
import { useReactToPrint } from 'react-to-print'
import styled from 'styled-components'
import { fieldIconGenerator } from './FieldIcon'

interface PrintableContentProps {
  children: React.ReactNode
  documentTitle: string
  headerTitle?: string
}

const PrintContent = styled(Box)`
  @media print {
    position: fixed;
    top: 0;
    width: 100%;
    padding: 0;
    margin: 0;
    @page {
      size: portrait;
      margin: 5mm;
    }
  }
`

const PrintableContent: React.FC<PrintableContentProps> = ({ documentTitle, headerTitle, children }) => {
  const componentRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle,
    removeAfterPrint: true,
  })

  return (
    <>
      <GridItem col={12}>
        <Flex paddingBottom={4} display="flex" justifyContent="space-between" alignItems="start">
          {headerTitle && (
            <Typography variant="beta" fontWeight="bold">
              {headerTitle}
            </Typography>
          )}
          <Button size="M" onClick={handlePrint} variant="tertiary" startIcon={fieldIconGenerator('print')}>
            Print
          </Button>
        </Flex>
      </GridItem>
      <GridItem col={8} paddingRight={5}>
        <PrintContent ref={componentRef}>{children}</PrintContent>
      </GridItem>
    </>
  )
}

export default PrintableContent
