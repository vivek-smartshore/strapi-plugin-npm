import React, { useEffect, ReactNode } from 'react'
import { BaseHeaderLayout, Box, Flex } from '@strapi/design-system'

export interface HeaderActions {
  navigation?: React.ReactNode
  primary?: React.ReactNode
  secondary?: React.ReactNode
}

export interface PageNames {
  title: string
  subtitle?: string
}

interface PageProps {
  pageName: PageNames
  pageComponent: ReactNode
  headerActions?: HeaderActions
}

const Page: React.FC<PageProps> = ({ pageName, pageComponent, headerActions }) => {
  useEffect(() => {
    document.title = pageName.title
  }, [pageName.title])

  return (
    <Flex direction="column" alignItems="flex-start" width="100%">
      <Box width="100%">
        <BaseHeaderLayout
          title={pageName.title}
          subtitle={pageName.subtitle}
          as="h2"
          navigationAction={headerActions?.navigation}
          primaryAction={headerActions?.primary}
          secondaryAction={headerActions?.secondary}
        />
      </Box>
      <Box width="100%">{pageComponent}</Box>
    </Flex>
  )
}

export default Page
