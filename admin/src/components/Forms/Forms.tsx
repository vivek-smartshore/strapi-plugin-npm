import React, { useEffect, useState } from 'react'
import { Box, Flex, Tr, Td, IconButton, Badge, Typography, Link } from '@strapi/design-system'
import { LoadingIndicatorPage, useQueryParams, FilterData } from '@strapi/helper-plugin'
import { Trash, Pencil } from '@strapi/icons'
import { NavLink, useRouteMatch, useHistory } from 'react-router-dom'
import { formatDate, getURLQuery } from '../../utils/helpers'
import { handleSort } from '../../utils/sortHandler'
import { useFormsApi } from '../../hooks/useFormsAPI'
import { Params, SortOrders } from '../../types'
import { Form } from '../../../../types'
import ListingPagination from '../Pagination/ListingPagination'
import PageSizeSelector from '../Pagination/PageSizeSelector'
import Filters from '../Filters'
import FormDelete from './FormDelete'
import DataTable from '../UI/DataTable'
import NeutralText from '../UI/NeutralText'
import { defaultPagination } from '../../config'
import ConfirmationDialog from '../UI/ConfirmationDialog'
import FormURLs from '../../utils/urls'
import useAddFormStore from '../../stores/addFormStore'
import { useFormatMessage } from '../../hooks/useFormatMessage'
import { useIntl } from 'react-intl'

interface Props {
  setFormsCount?: (count: number) => void
}

const Forms: React.FC<Props> = ({ setFormsCount }: Props) => {
  const { locale } = useIntl()
  const formatMessage = useFormatMessage()
  const { setShowModal } = useAddFormStore()
  const [loading, setLoading] = useState<boolean>(false)
  const [forms, setForms] = useState<Form[]>([])
  const [pageCount, setPageCount] = useState<number>(defaultPagination.page)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [entriesPerPage, setEntriesPerPage] = useState<number>(defaultPagination.pageSize)
  const [formId, setFormId] = useState<number | undefined>(undefined)
  const [isDialogOpen, setDialog] = useState<boolean>(false)
  const [urlPath, setUrlPath] = useState<string>('')
  const history = useHistory()
  const fullQueryParams = getURLQuery()
  const pageQueryParams = fullQueryParams.get('page') ?? defaultPagination.page
  const match = useRouteMatch()
  const [submissionsCount, setSubmissionsCount] = useState<number>(0)
  const { getAllForms, deleteForm } = useFormsApi()
  const [deletingFormId, setDeletingFormId] = useState<number | undefined>(undefined)

  const [{ query }, setQuery] = useQueryParams()
  const [sortOrder, setSortOrder] = useState<SortOrders>('ASC')

  const formParams: Params = {
    pagination: {
      limit: entriesPerPage,
      start: 0,
    },
    sort: query?.sort || defaultPagination.sort,
    filters: query?.filters,
    publicationState: 'preview',
    fields: ['name', 'uid', 'submissionsCount', 'createdAt', 'publishedAt'],
  }

  useEffect(() => {
    setUrlPath(`${match.path}`)
    setLoading(true)
    pagination()
    if (pageQueryParams && +pageQueryParams == currentPage) {
      getForms()
      sortData()
    }
    setLoading(false)
  }, [pageQueryParams, currentPage, entriesPerPage, query])

  const pagination = () => {
    if (pageQueryParams) {
      setCurrentPage(+pageQueryParams)
    } else {
      setCurrentPage(1)
    }
    if (currentPage > 1) {
      updateformParamsStart('currentPage')
    }
  }

  const updateformParamsStart = (start: 'currentPage' | 'prevPage') => {
    if (start === 'currentPage') {
      formParams.pagination.start = formParams.pagination.limit * (currentPage - 1)
    } else {
      formParams.pagination.start = formParams.pagination.start - formParams.pagination.limit
    }
  }
  const getForms = async () => {
    const forms = await getAllForms(formParams)
    if (forms) {
      const { data, meta } = forms
      setPageCount(Math.ceil(meta.pagination.total / formParams.pagination.limit))
      setFormsCount && setFormsCount(meta.pagination.total)

      if (data.length > 0) {
        setForms(data)
      } else {
        if (currentPage === 1) {
          setForms(data)
        } else {
          history.push(`${urlPath}?page=${currentPage - 1}`)
        }
      }
    }
  }

  const editHandler = (formId: number, submissionsCount: number) => {
    history.push({
      pathname: `${match.url}/edit/${formId}`,
      state: { submissionsCount },
    })
  }

  const getBadgeStyles = (isPublished: string | null) => {
    return isPublished
      ? {
          textColor: 'success600',
          backgroundColor: 'success200',
        }
      : {
          textColor: 'secondary600',
          backgroundColor: 'secondary200',
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
      name: 'uid',
      fieldSchema: {
        type: 'string',
      },
      metadatas: { label: formatMessage('FiltersLabel.UID', 'UID') },
    },
    {
      name: 'name',
      fieldSchema: {
        type: 'string',
      },
      metadatas: { label: formatMessage('FiltersLabel.Name', 'Name') },
    },
    {
      name: 'createdAt',
      fieldSchema: {
        type: 'datetime',
      },
      metadatas: { label: formatMessage('FiltersLabel.CreatedAt', 'CreatedAt') },
    },
  ]

  const tableHeaders = [
    { field: 'id', label: formatMessage('TableHeader.Id', 'ID'), sortable: true },
    { field: 'uid', label: formatMessage('TableHeader.UID', 'UID'), sortable: false },
    { field: 'name', label: formatMessage('TableHeader.Name', 'Name'), sortable: false },
    {
      field: 'submissionsCount',
      label: formatMessage('SubmissionsPage.DefaultTitle', 'Submissions'),
      sortable: true,
    },
    {
      field: 'createdAt',
      label: formatMessage('TableHeader.CreatedAt', 'CreatedAt'),
      sortable: true,
    },
    { field: 'status', label: formatMessage('TableHeader.Status', 'Status'), sortable: false },
  ]

  const generateSubmissionsLink = (id: number) => {
    const baseUrl = FormURLs.SUBMISSIONS
    const queryParams = `?pageSize=${defaultPagination.pageSize}&page=${defaultPagination.page}&sort=${defaultPagination.sort}&filters[$and][0][form][$eq]=${id}`
    return `${baseUrl}${queryParams}`
  }

  const truncationStyles = {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    maxWidth: '225px',
  }

  const handleDeleteClick = (id: number) => {
    setDeletingFormId(id)
    setDialog(true)
  }

  const renderRow = (form: Form, editHandler: (id: number, submissionsCount: number) => void) => {
    const { id, attributes } = form
    return (
      <Tr key={id}>
        <Td>
          <NeutralText>{id}</NeutralText>
        </Td>
        <Td style={{ ...truncationStyles }}>
          <NeutralText>{attributes?.uid}</NeutralText>
        </Td>
        <Td style={{ ...truncationStyles }}>
          <NeutralText>{attributes?.name}</NeutralText>
        </Td>
        <Td>
          {attributes.submissionsCount && attributes.submissionsCount > 0 ? (
            <Link as={NavLink} to={generateSubmissionsLink(id)} style={{ textDecoration: 'none' }}>
              <Typography>{attributes.submissionsCount}</Typography>
            </Link>
          ) : (
            <NeutralText>0</NeutralText>
          )}
        </Td>
        <Td>
          <NeutralText>{formatDate(attributes.createdAt, 'default', locale)}</NeutralText>
        </Td>
        <Td>
          <Badge {...getBadgeStyles(attributes.publishedAt)}>
            {attributes.publishedAt
              ? formatMessage('Badge.Published', 'Published')
              : formatMessage('Badge.Draft', 'Draft')}
          </Badge>
        </Td>
        <Td>
          <Flex justifyContent="flex-end">
            <IconButton
              onClick={() => editHandler(form.id, attributes.submissionsCount ?? 0)}
              label="Edit"
              noBorder
              color="neutral500"
              icon={<Pencil />}
            />
            <IconButton
              onClick={() => {
                handleDeleteClick(form.id)
                setSubmissionsCount(attributes.submissionsCount ?? 0)
              }}
              label="Delete"
              noBorder
              color="neutral500"
              icon={<Trash />}
            />
          </Flex>
        </Td>
      </Tr>
    )
  }

  const handleFiltersChange = (newFilters: typeof FilterData) => {
    setQuery({ filters: newFilters })
  }
  const [activeSort, setActiveSort] = useState('')
  const sortData = () => {
    const sortValue = query?.sort
    const sortOrder = typeof sortValue === 'string' ? sortValue.split(':')[1] : 'ASC'
    setSortOrder(sortOrder === 'DESC' ? 'DESC' : 'ASC')
    const sortVal = typeof sortValue === 'string' ? sortValue.split(':')[0] : ''
    setActiveSort(sortVal)
  }

  /* Form Dialog */
  const handleDialogeClose = (value: boolean) => {
    setDialog(value)
    setDeletingFormId(undefined)
  }

  const deleteFormHandler = async () => {
    if (!deletingFormId) return
    setLoading(true)
    const success = await deleteForm(deletingFormId)
    if (success) {
      updateformParamsStart('currentPage')
      await getForms()
    }
    setLoading(false)
    handleDialogeClose(false)
  }

  if (loading) return <LoadingIndicatorPage />

  return (
    <>
      <Filters filtersSchema={filtersSchema} onChange={handleFiltersChange} />
      <Box width="100%" paddingLeft={10} paddingRight={10}>
        <DataTable
          data={forms}
          renderRow={(form: any) => renderRow(form, editHandler)}
          headers={tableHeaders}
          sortConfig={{
            handleSort,
            sortOrder,
            activeSort,
            setSortOrder,
            setQuery,
          }}
          emptyMessage={formatMessage('FormsListing.EmptyMessage', 'No Forms Created')}
          onAddItem={() => setShowModal(true)}
        />
        <Flex paddingTop={6} flexDirection="row" justifyContent="space-between">
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

      {/* Delete form dialog */}
      {deletingFormId && (
        <ConfirmationDialog
          isOpen={isDialogOpen}
          onClose={() => handleDialogeClose(false)}
          onConfirm={deleteFormHandler}
        >
          <FormDelete submissionCount={submissionsCount} formId={deletingFormId} />
        </ConfirmationDialog>
      )}
    </>
  )
}

export default Forms
