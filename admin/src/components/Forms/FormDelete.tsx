import { Link, Typography } from '@strapi/design-system'
import { NavLink } from 'react-router-dom'
import FormURLs from '../../utils/urls'
import { useFormatMessage } from '../../hooks/useFormatMessage'

interface Props {
  formId: number | undefined
  submissionCount: number
}

const FormDelete = ({ submissionCount, formId }: Props) => {
  const formatMessage = useFormatMessage()
  const hasSubmissions = submissionCount > 0
  const message = formatMessage(
    'Forms.DeleteBody',
    `Are you sure you want to delete this form? ${
      hasSubmissions ? ` ${submissionCount} submitted entries will also be deleted. Go to ` : ''
    }`
  )

  return (
    <>
      {message}
      {hasSubmissions && (
        <Link as={NavLink} to={FormURLs.SUBMISSIONS_WITH_FORM_ID(formId)} style={{ textDecoration: 'none' }}>
          Submissions
        </Link>
      )}
      {hasSubmissions && <Typography> {formatMessage('FormDelete.WarningMessage', 'Proceed with deletion? This action cannot be undone!')}</Typography>}
    </>
  )
}

export default FormDelete
