import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Flex } from '@strapi/design-system'
import { LoadingIndicatorPage } from '@strapi/helper-plugin'
import { useFormsApi } from '../../hooks/useFormsAPI'
import AddFormModal from '../Modals/AddFormModal'
import FormURLs from '../../utils/urls'
import useAddFormStore from '../../stores/addFormStore'

const FormCreate: React.FC = () => {
  const { showModal, setShowModal } = useAddFormStore()
  const [loading, setLoading] = useState(false)
  const navigate = useHistory()
  const { addForm } = useFormsApi()

  const handleAddForm = async (name: string) => {
    setLoading(true)
    const formData = await addForm(name)
    if (formData?.data) {
      navigate.push(FormURLs.EDIT(formData.data.id))
      setShowModal(false)
    }
    setLoading(false)
  }

  if (loading) return <LoadingIndicatorPage />

  return (
    <Flex direction="column">
      <AddFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onFormSubmit={(value: string) => handleAddForm(value)}
      />
    </Flex>
  )
}

export default FormCreate
