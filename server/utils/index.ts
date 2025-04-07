import { FBContentTypes } from '../types'

const getAdminOnlyAttributes = (contentType: Record<string, any>) => {
  return Object.keys(contentType.attributes).filter(
    (attrName) => contentType.attributes[attrName]?.pluginOptions?.['form-builder']?.adminOnly === true
  )
}

const disableAdminOnlyFieldsGraphQL = (extensionService: any, contentTypeUID: FBContentTypes) => {
  const adminOnlyFields = getAdminOnlyAttributes(strapi.getModel(contentTypeUID))
  if (adminOnlyFields.length > 0) {
    adminOnlyFields.forEach((attrName) => extensionService.shadowCRUD(contentTypeUID).field(attrName).disable())
  }
}

export { getAdminOnlyAttributes, disableAdminOnlyFieldsGraphQL }
