"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const utils_1 = require("./utils");
exports.default = ({ strapi }) => {
    const extensionService = strapi.plugin('graphql').service('extension');
    // Disable admin only fields for Forms
    (0, utils_1.disableAdminOnlyFieldsGraphQL)(extensionService, types_1.FBContentTypes.FB_FORMS);
    // Disable admin only fields for Submissions
    (0, utils_1.disableAdminOnlyFieldsGraphQL)(extensionService, types_1.FBContentTypes.FB_SUBMISSIONS);
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
                    resolve: async (_, args) => {
                        // Filter out any FormFieldInput objects where the value is undefined or null
                        const filteredSubmittedData = args.data.submittedData.filter((field) => field.value !== undefined && field.value !== null);
                        const submittedData = filteredSubmittedData.reduce((acc, field) => {
                            acc[field.id] = field.value;
                            return acc;
                        }, {});
                        const formId = typeof args.data.form === 'string' ? parseInt(args.data.form, 10) : args.data.form;
                        const submission = await strapi
                            .plugin('form-builder')
                            .service('submission')
                            .create({
                            data: {
                                submittedData,
                                form: formId,
                            },
                        });
                        const { toEntityResponse } = strapi.service('plugin::graphql.format').returnTypes;
                        const response = toEntityResponse(submission.results);
                        return response;
                    },
                },
            },
        },
    });
    strapi.customFields.register({
        name: 'form-relation-id',
        plugin: 'form-builder',
        type: 'integer',
    });
};
