import React, { useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import { Dots, NextLink, PageLink, Pagination, PreviousLink } from '@strapi/design-system/v2'
import { stringify as qs_stringify } from 'qs'
import { FilterData } from '@strapi/helper-plugin'
import { defaultPagination } from '../../config'
import { useFormatMessage } from '../../hooks/useFormatMessage'

interface ListingPaginationProps {
  pageCount: number
  urlPath: string
  currentPage: number
  filters: (typeof FilterData)[]
  sort: string
}

const ListingPagination: React.FC<ListingPaginationProps> = ({
  // TODO: this pageCount will be updated with separate pagination object values
  pageCount,
  urlPath,
  currentPage,
  filters,
  sort,
}) => {
  const formatMessage = useFormatMessage()
  const searchParams = new URLSearchParams(window.location.search)
  const pageSize = isNaN(Number(searchParams.get('pageSize')))
  ? defaultPagination.pageSize
  : searchParams.get('pageSize')

  const prevPage = currentPage > 1 ? currentPage - 1 : 1
  const nextPage = currentPage < pageCount ? currentPage + 1 : pageCount
  
  const queryString = useMemo(() => qs_stringify({ filters, sort }, { encode: false }),
    [filters, sort]
  );

  const getPageUrl = (page: number) =>
    `${urlPath}?pageSize=${pageSize}&page=${page}${queryString ? `&${queryString}` : ''}`

  const showDots = (condition: boolean, key: string, text: string) => (condition ? <Dots key={key}>{text}</Dots> : null)

  const paginationItems = [
    
    <PreviousLink key="prevButton" as={NavLink} to={getPageUrl(prevPage)}>
      {formatMessage('Pagination.Previous', 'Previous')}
    </PreviousLink>,

    <PageLink key="firstPage" number={1} as={NavLink} to={getPageUrl(1)}>
      1
    </PageLink>,

    showDots(pageCount > 3 && currentPage > 3, 'dotsBefore', `And ${pageCount - 3} other pages`),

    prevPage > 1 ? (
      <PageLink key="prevPage" number={prevPage} as={NavLink} to={getPageUrl(prevPage)}>
        {prevPage}
      </PageLink>
    ) : null,

    currentPage > 1 && currentPage < pageCount ? (
      <PageLink key="currentPage" number={currentPage} as={NavLink} to={getPageUrl(currentPage)}>
        {currentPage}
      </PageLink>
    ) : null,

    nextPage < pageCount ? (
      <PageLink key="nextPage" number={nextPage} as={NavLink} to={getPageUrl(nextPage)}>
        {nextPage}
      </PageLink>
    ) : null,

    showDots(pageCount > 3 && currentPage < pageCount - 2, 'dotsAfter', `And other next links`),

    pageCount > 1 ? (
      <PageLink key="pageCount" number={pageCount} as={NavLink} to={getPageUrl(pageCount)}>
        {pageCount}
      </PageLink>
    ) : null,

    <NextLink key="nextButton" as={NavLink} to={getPageUrl(nextPage)}>
      {formatMessage('Pagination.Next', 'Next page')}
    </NextLink>,
  ].filter(Boolean)

  return (
    <Pagination activePage={currentPage} pageCount={pageCount}>
      {paginationItems}
    </Pagination>
  )
}

export default ListingPagination
