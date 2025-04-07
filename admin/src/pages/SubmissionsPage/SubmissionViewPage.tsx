import React, { useState } from 'react'
import { Link } from '@strapi/design-system'
import { ArrowLeft } from '@strapi/icons'
import { LoadingIndicatorPage } from '@strapi/helper-plugin'
import { useParams } from 'react-router-dom'
import Page, { HeaderActions, PageNames } from '../Page'
import SubmissionsView from '../../components/Submissions/SubmissionsView'
import FormURLs from '../../utils/urls'
import { useFormatMessage } from '../../hooks/useFormatMessage'

const SubmissionsViewPage: React.FC = () => {
  const formatMessage = useFormatMessage()
  const { id } = useParams<{ id: string }>()
  const [submissionSlug, setSubmissionSlug] = useState<string>('')
  const [formId, setFormId] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [formName, setFormName] = useState<string>('')

  const handleSetSubmissionSlug = (slug: string) => {
    setSubmissionSlug(slug)
  }

  const pageName: PageNames = {
    title: formName,
    subtitle: `${formatMessage('SubmissionsView.Slug', 'Slug')}: ${submissionSlug}`,
  }

  const headerActions: HeaderActions = {
    navigation: (
      <Link startIcon={<ArrowLeft />} to={FormURLs.SUBMISSIONS_LISTING_WITH_QUERY()}>
        {formatMessage('SubmissionsView.Navigation', 'Back to All Submissions')}
      </Link>
    ),
  }

  if (loading) return <LoadingIndicatorPage />

  return (
    <Page
      pageName={pageName}
      pageComponent={
        <SubmissionsView
          id={parseInt(id)}
          setSubmissionSlug={handleSetSubmissionSlug}
          setFormId={setFormId}
          formName={formName}
          setFormName={setFormName}
        />
      }
      headerActions={headerActions}
    />
  )
}

export default SubmissionsViewPage
