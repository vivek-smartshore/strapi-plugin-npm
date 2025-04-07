import React, { useEffect, useState } from 'react'
import { LoadingIndicatorPage, useNotification } from '@strapi/helper-plugin'
import {
  Box,
  Stack,
  Button,
  Grid,
  GridItem,
  HeaderLayout,
  ContentLayout,
  Typography,
  ToggleInput,
  TextInput,
} from '@strapi/design-system'
import { Check } from '@strapi/icons'
import axios from 'axios'
import pluginId from '../../pluginId'
import pluginName from '../../utils/pluginName'
import styled from 'styled-components'
import QuillEditor from '../../components/Editor/QuillEditor'
import { useSettingsApi } from '../../hooks/useSettingsAPI'
import { ConfirmationSettings, Settings } from '../../../../types'
import { useFormatMessage } from '../../hooks/useFormatMessage'

const QuillEditorTitle = styled(Typography)`
  display: flex;
  font-size: 0.75rem;
  font-weight: 600;
  padding-bottom: 4px;
  &::after {
    line-height: 16px;
    content: '*';
    color: rgb(238, 94, 82);
    font-size: 0.875rem;
  }
`

const SettingsPage: React.FC = () => {
  const formatMessage = useFormatMessage()
  const [settings, setSettings] = useState<Settings>({
    confirmation: {
      active: false,
      email: {
        address: '',
        subject: '',
        content: '',
      },
    },
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [validationError, setValidationError] = useState({
    email: {
      address: '',
      subject: '',
      content: '',
    },
  })
  const toggleNotification = useNotification()
  const [initialValue, setInitialValue] = useState<Settings>()
  const { getPluginSettings, setPluginSettings } = useSettingsApi()

  const setPluginSettingsHandler = async (data: Settings) => {
    const res = await setPluginSettings(data)
    if (res) {
      const updatedConfirmation = {
        ...data.confirmation,
        email: res?.confirmation?.email,
      }

      setSettings((prevSettings) => ({
        ...prevSettings,
        confirmation: updatedConfirmation,
      }))
      setInitialValue((prevSettings) => ({
        ...prevSettings,
        confirmation: updatedConfirmation,
      }))
    }
  }

  useEffect(() => {
    const cancelSource = axios.CancelToken.source()

    const fetchGlobalSettings = async () => {
      const res = await getPluginSettings(cancelSource.token)
      if (res) {
        setSettings(res)
        setInitialValue(res)
      }
      setIsLoading(false)
    }

    fetchGlobalSettings()

    return () => {
      cancelSource.cancel('Component unmounted or new request initiated')
    }
  }, [])

  const validate = () => {
    const errors = {
      email: {
        address: '',
        subject: '',
        content: '',
      },
    }
    if (!settings.confirmation.email.address) {
      errors.email.address = 'Email is required'
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(settings.confirmation.email.address)) {
      errors.email.address = 'Invalid email address'
    }

    if (!settings.confirmation.email.subject) {
      errors.email.subject = 'Email subject is required'
    }
    const trimmedContent = settings.confirmation.email.content.replace(/<[^>]+>/g, '').trim()
    if (!settings.confirmation.email.content || !trimmedContent) {
      errors.email.content = 'Email content is required'
    }
    setValidationError(errors)
    return !errors.email.address && !errors.email.subject && !errors.email.content
  }
  const handleSubmit = async () => {
    setIsSaving(true)

    if (!settings.confirmation.active && initialValue) {
      await setPluginSettingsHandler({
        confirmation: {
          active: false,
          email: initialValue.confirmation.email,
        },
      })
    } else {
      if (validate()) {
        await setPluginSettingsHandler(settings)
      } else {
        return
      }
    }

    toggleNotification({
      type: 'success',
      message: 'Settings successfully updated',
    })

    // Remove validation error
    setValidationError({ email: { address: '', subject: '', content: '' } })
    setIsSaving(false)
  }

  const handleInputChange = (field: keyof ConfirmationSettings['email'], value: string) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      confirmation: {
        ...prevSettings.confirmation,
        email: {
          ...prevSettings.confirmation.email,
          [field]: value,
        },
      },
    }))
  }

  const pageName = `${pluginName} Settings Page`
  useEffect(() => {
    document.title = pageName
  }, [])

  return (
    <>
      <HeaderLayout
        id="title"
        title={formatMessage('SettingsPage.Title', 'Forms Research General Settings')}
        subtitle={formatMessage(
          'SettingsPage.Subtitle',
          'Manage the settings and behavior of your Forms plugin'
        )}
        primaryAction={
          isLoading ? null : (
            <Button
              onClick={handleSubmit}
              startIcon={<Check />}
              size="L"
              disabled={isSaving || JSON.stringify(settings) === JSON.stringify(initialValue)}
              loading={isSaving}
            >
              {formatMessage('SaveButtonLabel', 'Save')}
            </Button>
          )
        }
      ></HeaderLayout>
      {isLoading ? (
        <LoadingIndicatorPage />
      ) : (
        <ContentLayout>
          <Box
            background="neutral0"
            hasRadius
            shadow="filterShadow"
            paddingTop={6}
            paddingBottom={6}
            paddingLeft={7}
            paddingRight={7}
          >
            <Stack spacing={3}>
              <Typography>
                {formatMessage('FormEdit.EmailSettings.Title', 'Confirmation Email Settings')}
              </Typography>
              <Grid gap={6}>
                <GridItem col={12} s={12}>
                  <ToggleInput
                    checked={settings.confirmation.active}
                    label={formatMessage(
                      'SettingsPage.ToggleLabel',
                      'Enable OR Disable Confirmation Emails'
                    )}
                    offLabel={formatMessage('SettingsPage.ToggleOffLabel', 'Disable')}
                    onLabel={formatMessage('SettingsPage.ToggleOnLabel', 'Enable')}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setSettings((prevSettings) => ({
                        ...prevSettings,
                        confirmation: {
                          ...prevSettings.confirmation,
                          active: e.target.checked,
                        },
                      }))
                    }}
                    name={`${pluginId}__confirmation_email_active`}
                  />
                </GridItem>
                <GridItem col={12} s={12}>
                  {settings.confirmation.active && (
                    <Box>
                      <Grid gap={6}>
                        <GridItem col={12} s={12}>
                          <TextInput
                            label="Email"
                            name={`${pluginId}__confirmation_email_address`}
                            value={settings.confirmation.email.address}
                            required
                            type="email"
                            error={validationError.email.address}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleInputChange('address', e.target.value)
                            }
                          />
                        </GridItem>
                        <GridItem col={12} s={12}>
                          <TextInput
                            label="Email Subject"
                            name={`${pluginId}__confirmation_email_subject`}
                            value={settings.confirmation.email.subject}
                            required
                            error={validationError.email.subject}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleInputChange('subject', e.target.value)
                            }
                          />
                        </GridItem>
                        <GridItem col={12} s={12}>
                          <Box width="100%">
                            <QuillEditorTitle>
                              {formatMessage('SettingsPage.EmailContent', 'Email Content')}
                            </QuillEditorTitle>
                            <QuillEditor
                              value={settings.confirmation.email.content}
                              onChange={(content: string) => handleInputChange('content', content)}
                              error={validationError.email.content}
                            />
                          </Box>
                        </GridItem>
                      </Grid>
                    </Box>
                  )}
                </GridItem>
              </Grid>
            </Stack>
          </Box>
        </ContentLayout>
      )}
    </>
  )
}

export default SettingsPage
