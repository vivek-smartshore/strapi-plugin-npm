import { Strapi } from '@strapi/strapi'
import { FBContentTypes } from './types'
import { disableAdminOnlyFieldsGraphQL } from './utils'

export default ({ strapi }: { strapi: Strapi }) => {
  const graphqlPlugin = strapi.plugin('graphql')
  if (!graphqlPlugin) return

  const extensionService = graphqlPlugin.service('extension')

  // Disable admin only fields for Forms
  disableAdminOnlyFieldsGraphQL(extensionService, FBContentTypes.FB_FORMS)

  // Disable admin only fields for Submissions
  disableAdminOnlyFieldsGraphQL(extensionService, FBContentTypes.FB_SUBMISSIONS)

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
            const filteredSubmittedData = args.data.submittedData.filter(
              (field) => field.value !== undefined && field.value !== null
            )

            const submittedData = filteredSubmittedData.reduce((acc, field) => {
              acc[field.id] = field.value
              return acc
            }, {} as Record<string, any>)

            const formId = typeof args.data.form === 'string' ? parseInt(args.data.form, 10) : args.data.form

            const submission = await strapi
              .plugin('form-builder')
              .service('submission')
              .create({
                data: {
                  submittedData,
                  form: formId,
                },
              })

            const { toEntityResponse } = strapi.service('plugin::graphql.format').returnTypes
            return toEntityResponse(submission.results)
          },
        },
      },
    },
  })

  strapi.customFields.register({
    name: 'form-relation-id',
    plugin: 'form-builder',
    type: 'integer',
  })
}
