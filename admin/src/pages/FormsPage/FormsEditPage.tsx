/*
 * Form Edit Page
 */

import React, { useEffect, useState } from 'react'
import { Link, Box, Flex, Button } from '@strapi/design-system'
import { ArrowLeft, Check } from '@strapi/icons'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { useNotification, LoadingIndicatorPage } from '@strapi/helper-plugin'
import Page, { HeaderActions, PageNames } from '../Page'
import FormEdit from '../../components/Forms/FormEdit'
import ConfirmationDialog from '../../components/UI/ConfirmationDialog'
import { FormAttributes } from '../../../../types'
import { FormValidation } from '../../types/forms'
import { useFormsApi } from '../../hooks/useFormsAPI'
import FormURLs from '../../utils/urls'
import { useFormatMessage } from '../../hooks/useFormatMessage'

interface LocationState {
  submissionsCount: number
}

const initialValidation = {
  name: false,
  submit: false,
}
const FormsEditPage: React.FC = () => {
  const formatMessage = useFormatMessage()
  const location = useLocation<LocationState>()
  const { formId } = useParams<{ formId: string }>()
  const [formName, setFormName] = useState<string>('')
  const [uniqueId, setUniqueId] = useState<number>(0)
  const [published, setPublished] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [formContent, setFormContent] = useState<FormAttributes | undefined>(undefined)
  const [initialFormContent, setInitialFormContent] = useState<FormAttributes | undefined>(formContent)
  const history = useHistory()
  const toggleNotification = useNotification()
  const [isDialogOpen, setDialog] = useState<boolean>(false)
  const [saveDisable, setSaveDisable] = useState<boolean>(true)
  const [validation, setValidation] = useState<FormValidation>(initialValidation)
  const [formNameChanged, setFormNameChanged] = useState<boolean>(false)
  const [isReorderEnabled, setIsReorderEnabled] = useState<boolean>(false)
  const { getSingleForm, updateForm } = useFormsApi()
  const unpublishSuccessMessage = formatMessage('FormsEditPage.UnpublishSuccess', 'Unpublished!')
  const publishSuccessMessage = formatMessage('FormsEditPage.PublishSuccess', 'Published!')
  const formUpdatedMessage = formatMessage('FormsEditPage.FormUpdated', 'Form updated')

  const handleInfoChange = (num: number) => {
    setUniqueId(num)
  }

  useEffect(() => {
    if (formContent === initialFormContent) {
      setSaveDisable(true)
    } else {
      setSaveDisable(false)
    }
  }, [formContent, initialFormContent])

  const fetchForm = async (id: number) => {
    try {
        setLoading(true);
        const data = await getSingleForm(id);
        if (data) {
            const { attributes } = data.data;
            setFormContent(attributes);
            setInitialFormContent(attributes);
            setPublished(!!attributes.publishedAt);
            setFormName(attributes.name);
            handleInfoChange(attributes.uid);
        } else {
            history.push(FormURLs.LISTING);
        }
    } catch (error) {
        strapi.log.error(`An error occurred while fetching the form : ${JSON.stringify(error)}`);
    } finally {
        setLoading(false);
    }
};


  const updateFormHandler = async (formContent: FormAttributes | undefined) => {
    if (!formContent) {
      return
    }
    const publishedStatus = formContent.publishedAt !== initialFormContent?.publishedAt
    const newValidation = {
      name: !formContent?.name,
      submit: !formContent?.submit,
    } as FormValidation
    if (Object.values(newValidation).some((value) => value)) {
      setValidation(newValidation)
      return
    }

    setLoading(true)
    const formData = cleanFormData(formContent)
    const res = await updateForm(+formId, formData)
    if (res) {
      const data = res.data
      setFormContent(data.attributes)
      setInitialFormContent(data.attributes)
      setPublished(!!data.attributes.publishedAt)
      toggleNotification({
        type: 'success',
        title: publishedStatus
          ? `Form ${published ? unpublishSuccessMessage : publishSuccessMessage}`
          : formUpdatedMessage,
        message: publishedStatus ? '' : `Form ${data.id} updated!`,
      })
      setFormNameChanged(true)
    }
    setLoading(false)
    setValidation(initialValidation)
    setIsReorderEnabled(false)
  }

  const cleanFormData = (formData: FormAttributes) => {
    const { allFields, ...rest } = formData
    const extractedFields =
      allFields?.map(({ id, isNew, ...field }: any) => {
        if (!['radio', 'checkbox', 'dropdown'].includes(field.type)) {
          delete field.options
        }
        return isNew ? field : { id, ...field }
      }) ?? []
    return { ...rest, allFields: extractedFields }
  }

  /* Publis/Unpublish Dialog */
  const toggleDialog = (value: boolean) => {
    setDialog(value)
  }
  const publishHandler = () => {
    setPublished((prevPublished) => !prevPublished)
    const currentDate = new Date(Date.now()).toISOString()
    setFormContent((prevState: any) => {
      if (!prevState) return prevState
      const updatedFormContent: FormAttributes = {
        ...prevState,
        publishedAt: prevState.publishedAt ? null : currentDate,
      }
      updateFormHandler(updatedFormContent)
      toggleDialog(false)
      return updatedFormContent
    })
  }


  useEffect(() => {
    fetchForm(+formId);
  }, [formId]);

  const { submissionsCount } = location.state || { submissionsCount: 0 }
  const pageName: PageNames = {
    title: formName,
    subtitle: `UID: ${uniqueId}`,
  }
  const headerActions: HeaderActions = {
    navigation: (
      <Link
        startIcon={<ArrowLeft />}
        to={FormURLs.LISTING_WITH_QUERY()}
      >
        {formatMessage('FormsEditPage.Navigation', 'Return to Forms List')}
      </Link>
    ),
    primary: (
      <>
        <Box>
          <Flex justifyContent="flex-end">
            <Button
              size="M"
              startIcon={published ? '' : <Check />}
              onClick={() => toggleDialog(true)}
              variant={published ? 'secondary' : 'primary'}
              marginRight={2}
            >
              {published
                ? formatMessage('FormsEditPage.UnpublishButton', 'Unpublish')
                : formatMessage('FormsEditPage.PublishButton', 'Publish')}
            </Button>
            <Button size="M" disabled={saveDisable} onClick={() => updateFormHandler(formContent)}>
              {formatMessage('SaveButtonLabel', 'Save')}
            </Button>
          </Flex>

          {/* Publis/Unpublish Dialog */}
          <ConfirmationDialog
            isOpen={isDialogOpen}
            onClose={() => toggleDialog(false)}
            onConfirm={publishHandler}
            endIcon={<Check />}
            >
            {formatMessage(
              'FormsEditPage.Confirmation.Title',
              'Are you sure you want to change the Publish Status?'
            )}
          </ConfirmationDialog>
        </Box>
      </>
    ),
  }

  if (loading) return <LoadingIndicatorPage />

  return (
    <Page
      pageName={pageName}
      pageComponent={
        formContent && (
          <FormEdit
            formId={+formId}
            submissionCount={submissionsCount}
            formContent={formContent}
            setFormContent={setFormContent}
            getSingleForm={fetchForm}
            published={published}
            setFormNameChanged={setFormNameChanged}
            formNameChanged={formNameChanged}
            validation={validation}
          />
        )
      }
      headerActions={headerActions}
    />
  )
}

export default FormsEditPage
