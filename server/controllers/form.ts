import { factories, Strapi } from '@strapi/strapi'
import { sanitizeOutput, validateAndSanitizeInput, validateAndSanitizeQuery } from './helpers'
import { FBContentTypes } from '../types'

const contentTypeUID = FBContentTypes.FB_FORMS
export default factories.createCoreController(contentTypeUID, ({ strapi }: { strapi: Strapi }) => ({
  async create(ctx) {
    const sanitizedInput = await validateAndSanitizeInput(ctx, contentTypeUID)
    const newForm = await strapi.plugin('form-builder').service('form').create({
      data: sanitizedInput,
    })
    const sanitizedOutput = await sanitizeOutput(ctx, contentTypeUID, newForm)
    return await this.transformResponse(sanitizedOutput)
  },
  async find(ctx) {
    const sanitizedQuery = await validateAndSanitizeQuery(ctx, contentTypeUID)
    // Returns only published forms by default
    const { results, pagination } = await strapi.plugin('form-builder').service('form').find(sanitizedQuery)
    const sanitizedResults = await sanitizeOutput(ctx, contentTypeUID, results)
    return await this.transformResponse(sanitizedResults, { pagination })
  },
  async findOne(ctx) {
    const { id } = ctx.params
    const sanitizedQuery = await validateAndSanitizeQuery(ctx, contentTypeUID)
    const form = await strapi.plugin('form-builder').service('form').findOne(id, sanitizedQuery)
    const sanitizedOutput = await sanitizeOutput(ctx, contentTypeUID, form)
    return await this.transformResponse(sanitizedOutput)
  },
  async update(ctx) {
    const { id } = ctx.params
    const sanitizedQuery = await validateAndSanitizeQuery(ctx, contentTypeUID)
    const sanitizedInput = await validateAndSanitizeInput(ctx, contentTypeUID)
    const updatedForm = await strapi
      .plugin('form-builder')
      .service('form')
      .update(id, {
        ...sanitizedQuery,
        data: sanitizedInput,
      })
    const sanitizedOutput = await sanitizeOutput(ctx, contentTypeUID, updatedForm)
    return await this.transformResponse(sanitizedOutput)
  },
  async delete(ctx) {
    const { id } = ctx.params
    const deletedForm = await strapi.plugin('form-builder').service('form').delete(id)
    const sanitizedOutput = await sanitizeOutput(ctx, contentTypeUID, deletedForm)
    return await this.transformResponse(sanitizedOutput)
  },
}))
