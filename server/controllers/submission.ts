import { factories, Strapi } from '@strapi/strapi'
import { sanitizeOutput, validateAndSanitizeInput, validateAndSanitizeQuery } from './helpers'
import { FBContentTypes } from '../types'

const contentTypeUID = FBContentTypes.FB_SUBMISSIONS
export default factories.createCoreController(contentTypeUID, ({ strapi }: { strapi: Strapi }) => ({
  async create(ctx) {
    const sanitizedInput = await validateAndSanitizeInput(ctx, contentTypeUID)
    const { results, e } = await strapi.plugin('form-builder').service('submission').create({
      data: sanitizedInput,
    })
    const sanitizedOutput = await sanitizeOutput(ctx, contentTypeUID, results)
    const sanitizedResults: any = await this.transformResponse(sanitizedOutput)
    // If error is returned, set response status and add error as part of response
    if (e) {
      sanitizedResults.error = e
      ctx.status = 207
    }
    return sanitizedResults
  },
  async find(ctx) {
    const sanitizedQuery = await validateAndSanitizeQuery(ctx, contentTypeUID)
    const { results, pagination } = await strapi.plugin('form-builder').service('submission').find(sanitizedQuery)
    const sanitizedResults = await sanitizeOutput(ctx, contentTypeUID, results)
    return await this.transformResponse(sanitizedResults, { pagination })
  },
  async findOne(ctx) {
    const { id } = ctx.params
    const sanitizedQuery = await validateAndSanitizeQuery(ctx, contentTypeUID)
    const submission = await strapi.plugin('form-builder').service('submission').findOne(id, sanitizedQuery)
    const sanitizedOutput = await sanitizeOutput(ctx, contentTypeUID, submission)
    return await this.transformResponse(sanitizedOutput)
  },
  async delete(ctx) {
    const { id } = ctx.params
    const deletedSubmission = await strapi.plugin('form-builder').service('submission').delete(id)
    const sanitizedOutput = await sanitizeOutput(ctx, contentTypeUID, deletedSubmission)
    return await this.transformResponse(sanitizedOutput)
  },
}))
