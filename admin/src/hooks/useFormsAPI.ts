import { useFetchClient, useNotification, useAPIErrorHandler } from '@strapi/helper-plugin'
import { stringify as qs_stringify } from 'qs'
import { FormAttributes } from '../../../types'
import { ResponseInterface, Params } from '../types'
import FormAPIUrls from '../utils/FormAPIUrls'
import getTrad from '../utils/getTrad'

export const useFormsApi = () => {
  const client = useFetchClient()
  const toggleNotification = useNotification()
  const { formatAPIError } = useAPIErrorHandler(getTrad)

  const getAllForms = async (params: Partial<Params>) => {
    const query = qs_stringify(params)
    try {
      const res: { data: ResponseInterface } = await client.get(`${FormAPIUrls.FORMS}?${query}`)
      return res.data
    } catch (error: any) {
      strapi.log.error(`Error : ${JSON.stringify(error)}`);
      toggleNotification({
        type: 'warning',
        title: 'Error fetching forms',
        message: formatAPIError(error),
      })
      return null
    }
  }

  const getSingleForm = async (id: number) => {
    try {
      const res: { data: ResponseInterface } = await client.get(FormAPIUrls.SINGLE_FORM(id))
      return res.data
    } catch (error: any) {
      strapi.log.error(`Error : ${JSON.stringify(error)}`);
      toggleNotification({
        type: 'warning',
        title: error.response?.status === 404 ? `Form with ID: ${id} doesn't exist` : `Error in fetching form ${id}`,
        message: formatAPIError(error),
      })
      return null
    }
  }

  const updateForm = async (id: number, formDetails: FormAttributes) => {
    try {
      const res: { data: ResponseInterface } = await client.put(FormAPIUrls.SINGLE_FORM(id), { data: formDetails })
      return res.data
    } catch (error: any) {
      strapi.log.error(`Error : ${JSON.stringify(error)}`);
      toggleNotification({
        type: 'warning',
        title: 'Error updating form',
        message: formatAPIError(error),
      })
      return null
    }
  }

  const deleteForm = async (id: number) => {
    try {
      const res = await client.del(FormAPIUrls.SINGLE_FORM(id))
      if (res.data) {
        toggleNotification({
          type: 'success',
          title: 'Form deleted',
          message: `Form ${id} deleted!`,
        })
        return true
      }
    } catch (error: any) {
      strapi.log.error(`Error : ${JSON.stringify(error)}`);
      toggleNotification({
        type: 'warning',
        title: error.toString(),
        message: formatAPIError(error),
      })
      return false
    }
  }

  const addForm = async (name: string) => {
    try {
      const res: { data: ResponseInterface } = await client.post(FormAPIUrls.FORMS, {
        data: { name },
      })
      if (res.data) {
        const {
          data: { id },
        } = res.data
        toggleNotification({
          type: 'success',
          title: 'Form added',
          message: `Form added with ID ${id}`,
        })
      }
      return res.data
    } catch (error: any) {
      strapi.log.error(`Error : ${JSON.stringify(error)}`);
      toggleNotification({
        type: 'warning',
        title: 'Error adding form',
        message: formatAPIError(error),
      })
      return null
    }
  }

  return {
    getAllForms,
    getSingleForm,
    updateForm,
    deleteForm,
    addForm,
  }
}
