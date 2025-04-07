/*
 * Submissions Page
 */

import React, { useState } from 'react'
import { Link } from '@strapi/design-system'
import { ArrowLeft } from '@strapi/icons'
import { getEntriesMessage, getURLQuery } from '../../utils/helpers'
import Page, { HeaderActions, PageNames } from '../Page'
import Submissions from '../../components/Submissions/Submissions'
import FormURLs from '../../utils/urls'
import { useFormatMessage } from '../../hooks/useFormatMessage'

const SubmissionsPage: React.FC = () => {
  const formatMessage = useFormatMessage()
  const [submissionsCount, setSubmissionsCount] = useState(0)
  const fullQueryParams = getURLQuery()
  const formIdParams = fullQueryParams.get('formId')
  const handleSubmissionCount = (count: number) => {
    setSubmissionsCount(count)
  }

  const getFormSubs = () => {
    if (!formIdParams) {
      return formatMessage('SubmissionsPage.DefaultTitle', 'Submissions')
    }
    return `${formatMessage('SubmissionsPage.FormTitle', 'Submission(s) from Form ID')} ${formIdParams}`
  }

  const pageName: PageNames = {
    title: getFormSubs(),
    subtitle: getEntriesMessage(
      submissionsCount,
      formatMessage('SubmissionsPage.SingleEntryLabel', '1 entry found'),
      formatMessage('SubmissionsPage.MultipleEntriesLabel', 'entries found'),
      formatMessage('SubmissionsPage.NoEntriesLabel', 'No Entries Found')
    ),
  }
  const headerActions: HeaderActions = {
    navigation: (
      <Link startIcon={<ArrowLeft />} to={FormURLs.LISTING_WITH_QUERY()}>
        {formatMessage('SubmissionsPage.Navigation', 'Back to All Forms')}
      </Link>
    ),
  }

  return (
    <Page
      pageName={pageName}
      pageComponent={<Submissions onSubmissionsCount={handleSubmissionCount} />}
      headerActions={headerActions}
    />
  )
}

export default SubmissionsPage
