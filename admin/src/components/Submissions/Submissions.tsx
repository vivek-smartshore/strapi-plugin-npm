import React, { useEffect, useState } from 'react'
import { Box, Flex, Tr, Td, IconButton, Link } from '@strapi/design-system'
import { LoadingIndicatorPage, useQueryParams, FilterData } from '@strapi/helper-plugin'
import { Eye, Trash } from '@strapi/icons'
import { NavLink, useRouteMatch } from 'react-router-dom'
import { formatDate,getURLQuery } from '../../utils/helpers'
import { handleSort } from '../../utils/sortHandler'
import { ResponseInterface, SortOrders, Params } from '../../types'
import { Submission } from '../../../../types'
import ListingPagination from '../Pagination/ListingPagination'
import PageSizeSelector from '../Pagination/PageSizeSelector'
import Filters from '../Filters'
import { useSubmissionsApi } from '../../hooks/useSubmissionsAPI'
import DataTable from '../UI/DataTable'
import NeutralText from '../UI/NeutralText'
import { defaultPagination } from '../../config'
import ConfirmationDialog from '../UI/ConfirmationDialog'
import FormURLs from '../../utils/urls'
import { useFormatMessage } from '../../hooks/useFormatMessage'
import { useIntl } from 'react-intl'

interface SubmissionsProps {
  onSubmissionsCount: (count: number) => void
}

const Submissions: React.FC<SubmissionsProps> = ({ onSubmissionsCount }) => {
  const { locale } = useIntl();
  const formatMessage = useFormatMessage()
  const [loading, setLoading] = useState(false)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [pageCount, setPageCount] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [isDialogOpen, setDialog] = useState(false)
  const [submissionId, setSubmissionId] = useState<number | undefined>(undefined)
  const [entriesPerPage, setEntriesPerPage] = useState<number>(10)
  const fullQueryParams = getURLQuery()
  const pageQueryParams = fullQueryParams.get('page')
  const formIdParams = fullQueryParams.get('formId')
  const { getAllSubmissions, deleteSubmission } = useSubmissionsApi()
  const [{ query }, setQuery] = useQueryParams()
  const match = useRouteMatch()
  const urlPath = match.url
  const [sortOrder, setSortOrder] = useState<SortOrders>(query?.sort?.split(':')[1] || 'ASC')


  const deleteConfirmationMessage = formatMessage(
    'Submissions.Confirmation.Delete',
    'Are you certain you want to delete this submission? Once deleted, the data cannot be retrieved.'
  )
  
  const transformFormFilter = (filters: any) => {
    if (!filters) return filters

    const transformedFilters = { ...filters }

    if (transformedFilters.$and) {
      transformedFilters.$and = transformedFilters.$and.map((filter: any) => {
        if (filter.form) {
          if (filter.form.$eq) {
            return { '[form][id]': { $eq: filter.form.$eq } }
          }
          if (filter.form.$ne) {
            return { '[form][id]': { $ne: filter.form.$ne } }
          }
        }
        return filter
      })
    }
    return transformedFilters
  }

  const params: Params = {
    pagination: {
      limit: entriesPerPage,
      start: 0,
    },
    sort: query?.sort || defaultPagination.sort,
    populate: {
      form: {
        fields: ['id'],
      },
    },
    filters: transformFormFilter(query?.filters),
    fields: ['id', 'slug', 'createdAt'],
  }

  if (formIdParams) {
    params.filters = transformFormFilter({
      form: {
        id: {
          $eq: formIdParams,
        },
      },
    })
  }

  const [activeSort, setActiveSort] = useState<string>('')
  const sortData = () => {
    const sortValue = query?.sort
    const sortOrder = typeof sortValue === 'string' ? sortValue.split(':')[1] : 'ASC'
    setSortOrder(sortOrder === 'DESC' ? 'DESC' : 'ASC')
    const sortVal = typeof sortValue === 'string' ? sortValue.split(':')[0] : ''
    setActiveSort(sortVal)
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        if (pageQueryParams) {
          setCurrentPage(+pageQueryParams)
        } else {
          setCurrentPage(1)
        }

        if (currentPage > 1) {
          params.pagination.start = params.pagination.limit * (currentPage - 1)
        }
        if (pageQueryParams && +pageQueryParams == currentPage) {
          const response = (await getAllSubmissions(params)) as ResponseInterface
          if (response) {
            if (response.data) {
              setSubmissions(response.data)
            }
            if (response.meta) {
              const total = response.meta?.pagination?.total || 0
              setPageCount(Math.ceil(total / params.pagination.limit))
              onSubmissionsCount(total)
            }
          }
          sortData()
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [pageQueryParams, currentPage, query])

   /* Submission dialog */
  const toggleDialog = (value: boolean) => {
    setDialog(value)
  }
  const deleteSubmissionHandler = async () => {
    try {
      // @Todo need to mention the type after backend changes
      if (!submissionId) return
      const res: any = await deleteSubmission(submissionId)
      if (res) {
        setQuery({
          ...query,
          delete: submissionId,
        })
      }
    } finally {
      setSubmissionId(undefined)
      toggleDialog(false)
    }
  }

  const filtersSchema: (typeof FilterData)[] = [
    {
      name: 'id',
      fieldSchema: {
        type: 'integer',
      },
      metadatas: {
        label: formatMessage('FiltersLabel.Id', 'id'),
      },
    },
    {
      name: 'slug',
      fieldSchema: {
        type: 'string',
      },
      metadatas: {
        label: formatMessage('SubmissionsView.Slug', 'slug'),
      },
    },
    {
      name: 'form',
      fieldSchema: {
        type: 'string',
      },
      metadatas: {
        label: formatMessage('FiltersLabel.Form', 'form'),
        customOperators: [
          {
            value: '$eq',
            intlLabel: {
              id: 'filters.eq',
              defaultMessage: 'is',
            },
          },
          {
            value: '$ne',
            intlLabel: {
              id: 'filters.ne',
              defaultMessage: 'is not',
            },
          },
        ],
      },
    },
    {
      name: 'createdAt',
      fieldSchema: {
        type: 'datetime',
      },
      metadatas: {
        label: formatMessage('FiltersLabel.CreatedAt', 'createdAt'),
      },
    },
  ]

  const tableHeaders = [
    { field: 'id', label: formatMessage('TableHeader.Id', 'ID'), sortable: true },
    { field: 'slug', label: formatMessage('SubmissionsView.Slug', 'Slug'), sortable: false },
    { field: 'formId', label: formatMessage('TableHeader.Form', 'Form'), sortable: false }, // Assuming this maps to the form's ID
    {
      field: 'createdAt',
      label: formatMessage('TableHeader.CreatedAt', 'CreatedAt'),
      sortable: true,
    },
  ]

  const renderRow = (submission: Submission, setSubmissionId: (id: number) => void) => {
    const { id, attributes } = submission
    return (
      <Tr key={id}>
        <Td>
          <NeutralText>{id}</NeutralText>
        </Td>
        <Td>
          <NeutralText>{attributes.slug}</NeutralText>
        </Td>
        <Td>
          {attributes.form?.data?.id ? (
            <Link
              as={NavLink}
              to={FormURLs.EDIT(attributes.form.data.id)}
              style={{ textDecoration: 'none' }}
            >
              <NeutralText>{attributes.form.data.id}</NeutralText>
            </Link>
          ) : (
            formatMessage('Submissions.FormNotFound', 'Form Not Found')
          )}
        </Td>
        <Td>
          <NeutralText>{formatDate(attributes.createdAt,'default', locale)}</NeutralText>
        </Td>
        <Td>
          <Flex justifyContent="flex-end">
            <Link to={`${match.url}/${id}`}>
              <IconButton
                label={formatMessage('Submissions.ActionButton.View', 'View')}
                noBorder
                icon={<Eye />}
              />
            </Link>
            <Box paddingLeft={1}>
              <IconButton
                onClick={() => {
                  toggleDialog(true)
                  setSubmissionId(id)
                }}
                label={formatMessage('Submissions.ActionButton.Delete', 'Delete')}
                noBorder
                icon={<Trash />}
              />
            </Box>
          </Flex>
        </Td>
      </Tr>
    )
  }

  const handleFiltersChange = (newFilters: any) => {
    setQuery({ filters: newFilters })
  }

  if (loading) return <LoadingIndicatorPage />
  return (
    <>
      <Filters filtersSchema={filtersSchema} onChange={handleFiltersChange} />
      <Box width="100%" paddingLeft={10} paddingRight={10}>
        <DataTable
          data={submissions}
          renderRow={(submission: any) => renderRow(submission, setSubmissionId)}
          headers={tableHeaders}
          sortConfig={{
            handleSort,
            sortOrder,
            activeSort,
            setSortOrder,
            setQuery,
          }}
          emptyMessage={formatMessage('Submissions.EmptyMessage', 'No Submissions')}
        />

        <Flex paddingTop={8} justifyContent="space-between">
          <PageSizeSelector entriesPerPage={entriesPerPage} setEntriesPerPage={setEntriesPerPage} />
          <ListingPagination
            currentPage={currentPage}
            pageCount={pageCount}
            urlPath={urlPath}
            filters={query?.filters}
            sort={query?.sort}
          />
        </Flex>
      </Box>

      {/* Delete submission dialog */}
      <ConfirmationDialog isOpen={isDialogOpen} onClose={() => toggleDialog(false)} onConfirm={deleteSubmissionHandler}>
        {deleteConfirmationMessage}
      </ConfirmationDialog>
    </>
  )
}

export default Submissions