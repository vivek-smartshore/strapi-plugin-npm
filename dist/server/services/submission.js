"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
const helper_1 = require("./helper");
const utils_1 = require("@strapi/utils");
const types_1 = require("../types");
const { ApplicationError } = utils_1.errors;
const contentTypeUID = types_1.FBContentTypes.FB_SUBMISSIONS;
exports.default = strapi_1.factories.createCoreService(contentTypeUID, ({ strapi }) => ({
    async create(submissionData) {
        var _a, _b, _c;
        // First validate the required fields
        (0, helper_1.validateSubmissionSchema)(submissionData.data);
        // Get the related form for which submission is to be made
        const relatedForm = await strapi.plugin('form-builder').service('form').findOne(submissionData.data.form);
        // Accept submissions for only published forms
        if ((relatedForm === null || relatedForm === void 0 ? void 0 : relatedForm.publishedAt) === null) {
            throw new ApplicationError('Submissions are only accepted for published forms.', {
                form: { id: submissionData.data.form },
            });
        }
        // Clean and convert the submitted data types based on the form field definitions
        const cleanedData = (0, helper_1.convertInputDataTypes)(relatedForm === null || relatedForm === void 0 ? void 0 : relatedForm.allFields, submissionData.data.submittedData);
        // Validate the cleaned and converted data against the form field definitions
        await (0, helper_1.validateFieldsOnSubmission)(relatedForm, cleanedData);
        // Assign the cleaned data back to the submission object
        submissionData.data.submittedData = cleanedData;
        // Generate submission slug
        const uuid = await strapi.plugins['content-manager'].services.uid.generateUIDField({
            contentTypeUID,
            field: 'slug',
            data: submissionData,
        });
        submissionData.data.slug = uuid;
        const newSubmission = await ((_a = strapi.entityService) === null || _a === void 0 ? void 0 : _a.create(contentTypeUID, submissionData));
        const settings = await strapi.plugin('form-builder').service('settings').getSettings();
        const confirmationSettings = settings.confirmation;
        try {
            const emailsToSend = [];
            // if form have form submission confirmation for user
            if (relatedForm.confirmationEmail.isConfirmationEmail) {
                // Extract email fields that get submission confirmation
                const toEmails = relatedForm.allFields
                    .filter(field => field.type === 'email' && field.sendEmailConfirm)
                    .map(field => newSubmission === null || newSubmission === void 0 ? void 0 : newSubmission.submittedData[field.id])
                    .filter(Boolean); // Filter out undefined/null values
                emailsToSend.push(...toEmails);
                const emailTemplateStaticUser = {
                    subject: relatedForm.confirmationEmail.subject,
                    text: '',
                    html: relatedForm.confirmationEmail.content,
                };
                await (0, helper_1.sendConfirmationEmail)(emailsToSend, emailTemplateStaticUser);
            }
            // for admin form submission confirmation
            if (confirmationSettings.active && ((_b = confirmationSettings.email) === null || _b === void 0 ? void 0 : _b.address)) {
                const emailTemplateStaticAdmin = {
                    subject: confirmationSettings.email.subject,
                    text: '',
                    html: confirmationSettings.email.content,
                };
                const adminEmail = [(_c = confirmationSettings.email) === null || _c === void 0 ? void 0 : _c.address];
                await (0, helper_1.sendConfirmationEmail)(adminEmail, emailTemplateStaticAdmin);
            }
        }
        catch (error) {
            strapi.log.error(`Error sending confirmation email: ${JSON.stringify(error.message)}`);
            const errorMessage = 'Submission created. Email could not be sent.';
            const appError = new ApplicationError(errorMessage, error.message);
            return {
                results: newSubmission,
                e: appError,
            };
        }
        return { results: newSubmission };
    },
    async find(query) {
        return super.find(query);
    },
    async findOne(id, query) {
        return await super.findOne(id, query);
    },
    async delete(id) {
        var _a, _b;
        // Return only ID field after delete
        const deleteSubmission = await super.delete(id, {
            fields: ['id'],
            populate: ['form'],
        });
        // Update Submission count for particular form after deleting submissions
        const formId = deleteSubmission.form.id;
        const submissionsCount = await ((_a = strapi.entityService) === null || _a === void 0 ? void 0 : _a.count('plugin::form-builder.submission', {
            filters: {
                form: formId,
            },
        }));
        const data = {
            submissionsCount,
        };
        await ((_b = strapi.entityService) === null || _b === void 0 ? void 0 : _b.update('plugin::form-builder.form', formId, {
            data,
        }));
        return deleteSubmission;
    },
}));
