import React from 'react'
import Page, { HeaderActions, PageNames } from '../Page'
import { Plus } from '@strapi/icons'
import { Button } from '@strapi/design-system'
import Forms from '../../components/Forms/Forms'
import { getEntriesMessage } from '../../utils/helpers'
import useAddFormStore from '../../stores/addFormStore'
import { useFormatMessage } from '../../hooks/useFormatMessage'

const FormsPage: React.FC = () => {
  const formatMessage = useFormatMessage()
  const { setShowModal } = useAddFormStore()
  const [formCount, setFormCount] = React.useState(0)

  const pageName: PageNames = {
    title: formatMessage("FormsPage.Title", "Manage Forms"),
    subtitle: getEntriesMessage(formCount, '1 entry found', 'entries found', 'No Entries Found'),
  }

  const headerActions: HeaderActions = {
    primary: (
      <Button startIcon={<Plus />} size="M" onClick={() => setShowModal(true)}>
        {formatMessage('FormsPage.CreateButton', 'Create')}
      </Button>
    ),
  }

  return (
    <>
      <Page pageName={pageName} pageComponent={<Forms setFormsCount={setFormCount} />} headerActions={headerActions} />
    </>
  )
}

export default FormsPage
