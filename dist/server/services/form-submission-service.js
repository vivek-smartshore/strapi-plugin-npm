"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("./helper");
const utils_1 = require("@strapi/utils");
const { ApplicationError } = utils_1.errors;
exports.default = ({ strapi }) => ({
    create: async (subData) => {
        var _a, _b, _c, _d;
        // First validate the required fields
        (0, helper_1.validateSubmissionSchema)(subData === null || subData === void 0 ? void 0 : subData.data);
        // Get the related form for which submission is to be made
        const relatedForm = await ((_a = strapi.entityService) === null || _a === void 0 ? void 0 : _a.findOne('plugin::form-builder.form', subData.data.form));
        // Accept submissions for only published forms
        if ((relatedForm === null || relatedForm === void 0 ? void 0 : relatedForm.publishedAt) === null) {
            throw new ApplicationError('Submissions are only accepted for published forms.', {
                form_id: subData.data.form
            });
        }
        const submittedFormData = (_b = subData === null || subData === void 0 ? void 0 : subData.data) === null || _b === void 0 ? void 0 : _b.submitted_data;
        // Validate form builder fields
        await (0, helper_1.validateFieldsOnSubmission)(relatedForm, submittedFormData);
        // Generate submission slug
        const uuid = await strapi.plugins['content-manager'].services.uid.generateUIDField({
            contentTypeUID: 'plugin::form-builder.form-submission',
            field: 'slug',
            data: subData,
        });
        subData.data.slug = uuid;
        const newSub = await ((_c = strapi.entityService) === null || _c === void 0 ? void 0 : _c.create('plugin::form-builder.form-submission', subData));
        // Send submission confirmation email, if applicable
        const settings = await ((_d = (0, helper_1.getPluginStore)(strapi)) === null || _d === void 0 ? void 0 : _d.get({ key: 'settings' }));
        const confirmationSettings = settings.confirmation;
        if (confirmationSettings.active) {
            try {
                const formConfirmationSettings = relatedForm === null || relatedForm === void 0 ? void 0 : relatedForm.confirmationEmail;
                // Confirmation email settings from Form have higher precedence than General Settings
                const emailTemplateStatic = {
                    subject: formConfirmationSettings.subject ? formConfirmationSettings.subject : confirmationSettings.email.subject,
                    text: '',
                    html: formConfirmationSettings.content ? formConfirmationSettings.content : confirmationSettings.email.content,
                };
                const fromEmail = process.env.FROM_EMAIL || ''; // set as Global
                const toEmail = formConfirmationSettings.toEmail
                    ? formConfirmationSettings.toEmail
                    : (confirmationSettings.email.address
                        ? confirmationSettings.email.address
                        : (process.env.TO_EMAIL || ''));
                console.log(`Confirmation Email TO BE sent to ${toEmail} from ${fromEmail}`);
                if (toEmail && fromEmail) {
                    await strapi.plugins['email'].services.email.sendTemplatedEmail({
                        to: toEmail,
                    }, emailTemplateStatic);
                    console.log(`Confirmation Email sent to ${toEmail} from ${fromEmail}`);
                }
                else {
                    throw new Error("To or/and From email addresses are not set!");
                }
            }
            catch (error) {
                console.log("Submission created. Email could not be sent.", error);
                // TODO: Standardise the response & error format
                return {
                    error: {
                        message: error.message
                    },
                    newSub
                };
            }
        }
        return newSub;
    },
    find: async (query) => {
        var _a, _b;
        const allSubs = await ((_a = strapi.entityService) === null || _a === void 0 ? void 0 : _a.findMany('plugin::form-builder.form-submission', query));
        const totalCount = await ((_b = strapi.entityService) === null || _b === void 0 ? void 0 : _b.count('plugin::form-builder.form-submission'));
        return {
            results: allSubs,
            count: totalCount,
        };
    },
    findOne: async (subId, query) => {
        var _a;
        const singleSub = await ((_a = strapi.entityService) === null || _a === void 0 ? void 0 : _a.findOne('plugin::form-builder.form-submission', subId, query));
        return singleSub;
    },
    delete: async (subId) => {
        var _a;
        await ((_a = strapi.entityService) === null || _a === void 0 ? void 0 : _a.delete('plugin::form-builder.form-submission', subId));
        return { id: subId };
    },
});
