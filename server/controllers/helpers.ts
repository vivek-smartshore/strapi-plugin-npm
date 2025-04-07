import { isObject, isPlainObject, isArray, has, cloneDeep } from 'lodash'
import { sanitize, validate, errors } from '@strapi/utils'
import { FBContentTypes, FBEntityResponse } from '../types'
import { getAdminOnlyAttributes } from '../utils'

const validateAndSanitizeQuery = async (ctx: any, contentTypeUID: FBContentTypes) => {
  const contentType = strapi.contentType(contentTypeUID)
  await validate.contentAPI.query(ctx.query, contentType, {
    auth: ctx.state.auth,
  })
  return await sanitize.contentAPI.query(ctx.query, contentType, {
    auth: ctx.state.auth,
  })
}

const validateAndSanitizeInput = async (ctx: any, contentTypeUID: FBContentTypes) => {
  const contentType = strapi.contentType(contentTypeUID)
  const body: any = ctx.request.body || {}
  if (!isObject(body.data)) {
    throw new errors.ValidationError('Missing "data" payload in the request body')
  }
  return await sanitize.contentAPI.input(body.data, contentType, { auth: ctx.state.auth })
}

const sanitizeOutput = async (ctx: any, contentTypeUID: FBContentTypes, data: FBEntityResponse) => {
  const contentType = strapi.contentType(contentTypeUID)
  const sanitizedEntity: any = await sanitize.contentAPI.output(data, contentType, {
    auth: ctx.state.auth,
  })
  return filterAdminOnlyAttributes(ctx, contentTypeUID, sanitizedEntity)
}

const filterAdminOnlyAttributes = (ctx: any, contentTypeUID: FBContentTypes, data: FBEntityResponse) => {
  const isContentAPIRequest = ctx.state.auth.strategy.name === 'users-permissions'
  if (isContentAPIRequest) {
    removeAdminOnlyAttributes(contentTypeUID, data)
  }

  return data
}

const removeAdminOnlyAttributes = (
  contentTypeUID: FBContentTypes,
  data: FBEntityResponse,
  parseRelations?: boolean
) => {
  const contentType = strapi.getModel(contentTypeUID)
  const adminOnlyAttributes = getAdminOnlyAttributes(contentType)
  // There is only one relational attribute in each model schema created by the plugin
  const relationalAttribute = contentTypeUID === FBContentTypes.FB_FORMS ? 'submissions' : 'form'

  const processAdminAndRelationalAttributes = (entity: FBEntityResponse) => {
    if (adminOnlyAttributes.length > 0) {
      adminOnlyAttributes.forEach((val) => {
        if (has(entity, val)) delete entity[val]
      })
    }

    // If relations are populated, filter fields in the relations data too.
    if (relationalAttribute && entity[relationalAttribute] && parseRelations !== false) {
      // Set parseRelations as false - we check only one-level nesting
      removeAdminOnlyAttributes(
        contentType.attributes[relationalAttribute]['target'],
        entity[relationalAttribute],
        false
      )
    }
  }

  if (isPlainObject(data)) {
    processAdminAndRelationalAttributes(data)
  } else if (isArray(data)) {
    data.map((entity: FBEntityResponse) => {
      processAdminAndRelationalAttributes(entity)
    })
  }
}

export { validateAndSanitizeQuery, validateAndSanitizeInput, sanitizeOutput }
