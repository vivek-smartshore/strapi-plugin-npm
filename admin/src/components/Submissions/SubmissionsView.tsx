import React, { useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { LoadingIndicatorPage } from '@strapi/helper-plugin'
import ConfirmationDialog from '../UI/ConfirmationDialog'
import { Box, Flex, Grid, GridItem, Td, Tr, Typography } from '@strapi/design-system'
import styled from 'styled-components'
import { findIndex } from 'lodash'
import { formatDate } from '../../utils/helpers'
import { FieldData, FieldOption, Submission } from '../../../../types'
import { useSubmissionsApi } from '../../hooks/useSubmissionsAPI'
import HTMLMarkDown from '../HTMLMarkDown'
import DataTable from '../UI/DataTable'
import { InfoDetailsOptional, Params } from '../../types'
import SidebarDetails from '../Sidebar/Details'
import PrintableContent from '../PrintableContent'
import FormURLs from '../../utils/urls'
import { useFormatMessage } from '../../hooks/useFormatMessage'
import { useIntl } from 'react-intl'

const PrintHeader = styled.div`
  @media print {
    width: 100%;
    background: #f0f0f0;
    padding: 10px;
    text-align: center;
    font-size: 14px;
    font-weight: bold;
    z-index: 1000;
    display: block;
    margin-bottom: 20px;
  }

  @media screen {
    display: none;
  }
`
interface SubmissionsViewProps {
  id: number
  setSubmissionSlug: (slug: string) => void
  setFormId: (formId: number) => void
  formName?: string
  setFormName: (formName: string) => void
}

const SubmissionsView: React.FC<SubmissionsViewProps> = ({
  id,
  setSubmissionSlug,
  setFormId,
  formName,
  setFormName,
}) => {
  const { locale } = useIntl();
  const formatMessage = useFormatMessage()
  const [loading, setLoading] = useState(false)
  const [submission, setSubmission] = useState<Submission | null>(null)
  const history = useHistory()
  const componentRef = useRef<HTMLDivElement>(null)
  const [isDialogOpen, setDialog] = useState<boolean>(false)
  const { getSingleSubmission, deleteSubmission } = useSubmissionsApi()

  const infoDetails: InfoDetailsOptional = {
    'Submitted on': submission?.attributes.createdAt,
    Form: submission?.attributes.form?.data.id,
  }

  const deleteConfirmationMessage = formatMessage(
    'SubmissionsView.Confirmation.Delete',
    'Are you certain you want to delete this submission? Once deleted, the data cannot be retrieved.'
  )

  useEffect(() => {
    setLoading(true)
    getSub(id)
    setLoading(false)
  }, [])

  const params: Partial<Params> = {
    populate: {
      form: {
        fields: ['name', 'allFields'],
      },
    },
  }

  const getSub = async (id: number) => {
    setLoading(true)
    const response = await getSingleSubmission(id, params)
    setSubmission(response?.data)
    setSubmissionSlug(response?.data.attributes.slug)
    setFormId(response?.data.attributes.form?.data.id || 0)
    setFormName(response?.data?.attributes.form?.data?.attributes.name)
    setLoading(false)
  }

  /* Delete submission dialogs */
  const toggleDialog = (value: boolean) => {
    setDialog(value)
  }

  const deleteSubmissionHandler = async () => {
    setLoading(true)
    await deleteSubmission(id)
    setSubmission(null)
    history.push(FormURLs.SUBMISSIONS_LISTING_WITH_QUERY())
    
    setLoading(false)
    toggleDialog(false)
  }

  const sanitizeFormName = (name: any) => {
    return name
      .replace(/[^a-zA-Z0-9 ]/g, '-')
      .replace(/\s+/g, '-')
      .slice(0, 150)
  }

  const data = submission?.attributes.submittedData
  const fields = submission?.attributes.form?.data.attributes.allFields || []

  const getOptionLabel = (optionsList: FieldOption[], value: string) => {
    const index = findIndex(optionsList, ['value', value])
    return index >= 0 ? optionsList[index].label : 'N/A'
  }

  const getCheckboxOptionsValues = (optionsList: FieldOption[], values: string[]) => {
    if (!Array.isArray(values) || values.length === 0) return 'N/A'
    return values.map((val) => getOptionLabel(optionsList, val)).join(', ')
  }

  const headers = [
    {
      field: 'label',
      label: formatMessage('TableHeader.Name', 'Name'),
      sortable: false,
    },
    {
      field: 'value',
      label: formatMessage('TableHeader.Value', 'Value'),
      sortable: false,
    },
  ]

  const renderRow = (field: FieldData) => {
    const value =
      field.options && field.type === 'radio'
        ? getOptionLabel(field.options, data?.[field.id] || '')
        : field.options && field.type === 'checkbox'
        ? getCheckboxOptionsValues(field.options, data?.[field.id] || [])
        : data?.[field.id] || 'N/A'

    return (
      <Tr key={field.id}>
        <Td style={{ wordWrap: 'break-word', whiteSpace: 'normal', width: '50%' }}>
          <Typography textColor="neutral800">{field.label}</Typography>
        </Td>
        <Td style={{ wordWrap: 'break-word', whiteSpace: 'normal', width: '50%' }}>
          <Typography textColor="neutral800">
            {field.type === 'textarea' || field.type === 'text' ? <HTMLMarkDown>{value}</HTMLMarkDown> : value}
          </Typography>
        </Td>
      </Tr>
    )
  }

  if (loading) return <LoadingIndicatorPage />
  return (
    <>
      {submission ? (
        <Box width="100%" padding={10}>
          <Grid>
            <PrintableContent
              documentTitle={`${formName ? sanitizeFormName(formName) : ''}_#${submission?.id}_${
                submission?.attributes.createdAt ? formatDate(new Date(submission.attributes.createdAt), 'dateOnly', locale) : 'dateOnly'
              }`}
              headerTitle={formatMessage('SubmissionsView.Title', 'Submission Data')}
            >
              <Box>
                <PrintHeader>
                  <Box>
                    {formatMessage('PrintHeader.Title', 'Form')} {formName}
                  </Box>
                  <Flex paddingTop={2} gap={6} justifyContent="center">
                    <Typography>
                      {formatMessage('PrintHeader.SubmissionID', 'Submission ID')}{' '}
                      {submission.id}
                    </Typography>
                    <Typography>
                      {formatMessage('PrintHeader.SubmittedOn', 'Submitted on')}{' '}
                      {formatDate(new Date(submission.attributes.createdAt), 'dateOnly', locale)}
                    </Typography>
                  </Flex>
                </PrintHeader>
                {data ? (
                  <DataTable
                    data={fields}
                    renderRow={renderRow}
                    headers={headers}
                    emptyMessage={formatMessage('SubmissionsView.NoUserData', 'No user data')}
                  />
                ) : (
                  <Typography>
                    {formatMessage('SubmissionsView.DataNotFound', 'Submission data not found')}
                  </Typography>
                )}
              </Box>
            </PrintableContent>
            <GridItem padding={1} col={4} s={12}>
              <SidebarDetails
                page="submissions"
                infoDetails={infoDetails}
                onConfirm={() => setDialog(true)}
              ></SidebarDetails>
            </GridItem>
          </Grid>
          {/* Delete submission dialog */}
          <ConfirmationDialog
            isOpen={isDialogOpen}
            onClose={() => toggleDialog(false)}
            onConfirm={deleteSubmissionHandler}
          >
            {deleteConfirmationMessage}
          </ConfirmationDialog>
        </Box>
      ) : (
        <Flex>
          <Typography>{`Submission ${id} not found`}</Typography>
        </Flex>
      )}
    </>
  )
}

export default SubmissionsView
