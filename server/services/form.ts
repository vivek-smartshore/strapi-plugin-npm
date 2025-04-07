import { factories, Strapi } from '@strapi/strapi'
import { FieldData } from '../../types'
import { v4 as uuidv4 } from 'uuid'
import { FBContentTypes } from '../types'

const contentTypeUID = FBContentTypes.FB_FORMS
export default factories.createCoreService(contentTypeUID, ({ strapi }: { strapi: Strapi }) => ({
  async create(params) {
    const { data } = params
    const uuid = await strapi.plugins['content-manager'].services.uid.generateUIDField({
      contentTypeUID,
      field: 'uid',
      data,
    })
    data.uid = uuid

    if (data.allFields) {
      data.allFields = data.allFields.map((field: FieldData) => {
        field.id = uuidv4()
        return field
      })
    }

    // Return only ID field after create
    return await strapi.entityService?.create(contentTypeUID, {
      ...params,
      data,
      fields: ['id'],
    })
  },
  async find(query) {
    return super.find(query)
  },
  async findOne(id, query) {
    return super.findOne(id, query)
  },
  async update(id, data) {
    if (data.data?.allFields) {
      data.data.allFields = data.data.allFields.map((field: FieldData) => {
        if (!field.id) {
          field.id = uuidv4()
        }
        return field
      })
    }

    const updatedForm = await strapi.entityService?.update(contentTypeUID, id, data)
    return updatedForm
  },
  async delete(id) {
    // Return only ID field after delete
    return super.delete(id, {
      fields: ['id'],
    })
  },
}))
