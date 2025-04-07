import { useFetchClient, useNotification, useAPIErrorHandler } from '@strapi/helper-plugin'
import { stringify as qs_stringify } from 'qs'
import { ResponseInterface, Params } from '../types'
import FormAPIUrls from '../utils/FormAPIUrls'
import getTrad from '../utils/getTrad'

export const useSubmissionsApi = () => {
  const client = useFetchClient()
  const toggleNotification = useNotification()
  const { formatAPIError } = useAPIErrorHandler(getTrad)

  const getAllSubmissions = async (params: Params) => {
    const query = qs_stringify(params)
    try {
      const res: { data: ResponseInterface } = await client.get(`${FormAPIUrls.SUBMISSIONS}?${query}`)
      return res.data
    } catch (error: any) {
      toggleNotification({
        type: 'warning',
        title: 'Error fetching form submissions',
        message: formatAPIError(error),
      })
    }
  }

  const getSingleSubmission = async (id: number, params: Partial<Params>) => {
    try {
      const res: { data: ResponseInterface } = await client.get(
        `${FormAPIUrls.SUBMISSIONS}/${id}?${qs_stringify(params)}`
      )
      return res.data
    } catch (error: any) {
      toggleNotification({
        type: 'warning',
        title: 'Error fetching form submissions',
        message: formatAPIError(error),
      })
    }
  }

  const deleteSubmission = async (id: number) => {
    try {
      const res = await client.del(`${FormAPIUrls.SUBMISSIONS}/${id}`)
      if (res.data) {
        toggleNotification({
          type: 'success',
          title: 'Submission deleted',
          message: `Submission ${id} deleted!`,
        })
      }
      return res.data
    } catch (error: any) {
      toggleNotification({
        type: 'warning',
        title: 'Error deleting form submissions',
        message: formatAPIError(error),
      })
      return null
    }
  }

  return {
    getAllSubmissions,
    deleteSubmission,
    getSingleSubmission,
  }
}
