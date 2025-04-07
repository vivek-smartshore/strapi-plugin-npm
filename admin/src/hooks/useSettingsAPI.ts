import { useAPIErrorHandler, useFetchClient, useNotification } from '@strapi/helper-plugin'
import { Settings } from '../../../types'
import axios, { CancelToken } from 'axios'
import FormAPIUrls from '../utils/FormAPIUrls'
import getTrad from '../utils/getTrad'

export const useSettingsApi = () => {
  const client = useFetchClient()
  const toggleNotification = useNotification()
  const { formatAPIError } = useAPIErrorHandler(getTrad)

  const getPluginSettings = async (cancelToken: CancelToken) => {
    try {
      const res = await client.get(FormAPIUrls.SETTINGS, { cancelToken })
      return res.data
    } catch (error: any) {
      if (!axios.isCancel(error)) {
        strapi.log.error(`Error fetching settings : ${JSON.stringify(error)}`);
      }
      formatAPIError(error)
      toggleNotification({
        type: 'warning',
        title: 'Error fetching plugin settings',
        message: formatAPIError(error),
      })
      return null
    }
  }

  const setPluginSettings = async (data: Settings) => {
    try {
      const res = await client.post(FormAPIUrls.SETTINGS, data)
      return res.data
    } catch (error: any) {
      strapi.log.error(`Error saving settings : ${JSON.stringify(error)}`);
      toggleNotification({
        type: 'warning',
        title: 'Error saving settings',
        message: formatAPIError(error),
      })
      return null
    }
  }

  return {
    getPluginSettings,
    setPluginSettings,
  }
}
