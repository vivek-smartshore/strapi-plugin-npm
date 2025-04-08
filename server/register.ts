import { Strapi } from '@strapi/strapi'
import { FBContentTypes } from './types'
import { disableAdminOnlyFieldsGraphQL } from './utils'

export default ({ strapi }: { strapi: Strapi }) => {
  // 1. Verify GraphQL plugin is installed and enabled
  if (!strapi.plugin('graphql')) {
    strapi.log.warn('GraphQL plugin not found - some Form Builder features may not work')
    return
  }

  try {
    const extensionService = strapi.plugin('graphql').service('extension')
    if (!extensionService) {
      throw new Error('GraphQL extension service not found')
    }

    // 2. Register custom field first (less likely to depend on other services)
    strapi.customFields.register({
      name: 'form-relation-id',
      plugin: 'form-builder',
      type: 'integer',
    })

    // 3. Disable admin only fields
    disableAdminOnlyFieldsGraphQL(extensionService, FBContentTypes.FB_FORMS)
    disableAdminOnlyFieldsGraphQL(extensionService, FBContentTypes.FB_SUBMISSIONS)

    // 4. Extend GraphQL schema
    extensionService.use({
      typeDefs: `
        type Mutation {
          createFormBuilderSubmission(data: CreateSubmissionInput!): FormBuilderSubmissionEntityResponse
        }

        input FormFieldInput {
          id: String!
          value: JSON
        }

        input CreateSubmissionInput {
          submittedData: [FormFieldInput!]!
          form: ID!
        }
      `,
      resolvers: {
        Mutation: {
          createFormBuilderSubmission: {
            resolve: async (
              _: any,
              args: {
                data: {
                  submittedData: { id: string; value: any }[]
                  form: string | number
                }
              }
            ) => {
              // Verify form-builder services are available
              const submissionService = strapi.plugin('form-builder').service('submission')
              if (!submissionService) {
                throw new Error('Form Builder submission service not found')
              }

              const graphqlFormatService = strapi.service('plugin::graphql.format')
              if (!graphqlFormatService) {
                throw new Error('GraphQL format service not found')
              }

              const filteredSubmittedData = args.data.submittedData.filter(
                (field) => field.value !== undefined && field.value !== null
              )

              const submittedData = filteredSubmittedData.reduce((acc, field) => {
                acc[field.id] = field.value
                return acc
              }, {} as Record<string, any>)

              const formId = typeof args.data.form === 'string' ? parseInt(args.data.form, 10) : args.data.form

              const submission = await submissionService.create({
                data: {
                  submittedData,
                  form: formId,
                },
              })

              const { toEntityResponse } = graphqlFormatService.returnTypes
              return toEntityResponse(submission.results)
            },
          },
        },
      },
    })
  } catch (error) {
    strapi.log.error('Error registering Form Builder plugin:')
    strapi.log.error(error)
  }
}
