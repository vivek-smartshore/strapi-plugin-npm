"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendConfirmationEmail = exports.convertInputDataTypes = exports.validateSubmissionSchema = exports.validateFieldsOnSubmission = exports.createDefaultConfig = exports.getPluginStore = void 0;
const yup = __importStar(require("yup"));
const utils_1 = require("@strapi/utils");
const { ApplicationError } = utils_1.errors;
const getPluginStore = (strapi) => {
    return strapi.store
        ? strapi.store({
            environment: '',
            type: 'plugin',
            name: 'form-builder',
        })
        : null;
};
exports.getPluginStore = getPluginStore;
const createDefaultConfig = async (strapi) => {
    const pluginStore = getPluginStore(strapi);
    const value = {
        confirmation: {
            active: true,
            email: {
                address: '',
                subject: '',
                content: '',
            },
        },
    };
    await (pluginStore === null || pluginStore === void 0 ? void 0 : pluginStore.set({ key: 'settings', value }));
    return pluginStore === null || pluginStore === void 0 ? void 0 : pluginStore.get({ key: 'settings' });
};
exports.createDefaultConfig = createDefaultConfig;
const validateFieldsOnSubmission = async (form, submittedData) => {
    if ((form === null || form === void 0 ? void 0 : form.allFields) && submittedData) {
        const allFields = form.allFields;
        // Build validator schema for fields using Yup
        const fieldValidator = {};
        allFields.map((field) => {
            let fieldValidation;
            const { label, isRequired, id: fieldId } = field;
            switch (field.type) {
                case 'number':
                    fieldValidation = yup.number();
                    fieldValidation = addNumberFieldValidations(field, fieldValidation);
                    break;
                case 'email':
                    fieldValidation = yup.string().email();
                    break;
                case 'checkbox':
                    fieldValidation = yup.array().of(yup.string());
                    break;
                case 'date':
                    fieldValidation = yup.date().typeError(`${label} must be a valid ISO 8601 date`);
                    break;
                case 'text':
                case 'textarea':
                    fieldValidation = addTextFieldValidations(field, yup.string());
                    break;
                default:
                    fieldValidation = yup.string();
                    break;
            }
            if (isRequired) {
                fieldValidation = fieldValidation.required(`${label} must be defined`);
            }
            fieldValidator[fieldId] = fieldValidation;
        });
        const fieldSchema = yup.object().shape(fieldValidator);
        try {
            // Run validator
            await fieldSchema.validate(submittedData, {
                strict: true,
                abortEarly: false,
            });
        }
        catch (e) {
            strapi.log.info(`${JSON.stringify(e)}`);
            if (e instanceof yup.ValidationError) {
                // Modify to include correct field paths & handle the using Strapi default handler
                (0, utils_1.handleYupError)({
                    ...e,
                    inner: e.inner.map(({ path, params, ...err1 }) => ({
                        ...err1,
                        path: `submittedData.${path}`,
                        params: {
                            ...params,
                            path: `submittedData.${params === null || params === void 0 ? void 0 : params.path}`,
                        },
                    })),
                });
            }
            else {
                throw new ApplicationError('An error occurred in validating submitted data!');
            }
        }
    }
};
exports.validateFieldsOnSubmission = validateFieldsOnSubmission;
const validateSubmissionSchema = (data) => {
    // Validate if the form & submission data is provided first
    const submissionSchema = yup.object({
        form: yup.number().required('form must be defined.'),
        submittedData: yup.object().required('submittedData must be defined.'),
    });
    (0, utils_1.validateYupSchemaSync)(submissionSchema)(data);
};
exports.validateSubmissionSchema = validateSubmissionSchema;
const convertInputDataTypes = (formFields, submittedData) => {
    const convertedData = {};
    formFields.forEach((field) => {
        const fieldValue = submittedData[field.id];
        // Only process fields with defined values
        if (fieldValue !== undefined) {
            let convertedValue = fieldValue;
            if (field.type == 'number') {
                convertedValue = fieldValue !== '' ? Number(fieldValue) : null;
            }
            // Convert date string to object required for validation
            if (field.type == 'date') {
                convertedValue = fieldValue !== '' ? new Date(fieldValue) : null;
            }
            // Only add fields to convertedData if they have a valid value
            if (convertedValue !== null && convertedValue !== undefined) {
                convertedData[field.id] = convertedValue;
            }
        }
    });
    return convertedData;
};
exports.convertInputDataTypes = convertInputDataTypes;
const sendConfirmationEmail = async (toEmails, emailTemplateStatic) => {
    const fromEmail = process.env.FROM_EMAIL || ''; // set as Global
    if ((toEmails === null || toEmails === void 0 ? void 0 : toEmails.length) > 0 && fromEmail) {
        await Promise.all(toEmails.map(async (recipient) => {
            try {
                await strapi.plugins['email'].services.email.sendTemplatedEmail({ to: recipient }, emailTemplateStatic);
            }
            catch (error) {
                strapi.log.error(`Failed to send email to: ${recipient}`);
                throw new Error(error);
            }
        }));
    }
    else {
        throw new Error('Missing To/From email addresses!');
    }
};
exports.sendConfirmationEmail = sendConfirmationEmail;
const addNumberFieldValidations = (field, validationSchema) => {
    const { numberOfDecimals = 0, numberRange, label } = field;
    // Add decimal digits validations
    if (numberOfDecimals === 0) {
        validationSchema = validationSchema.integer();
    }
    if (numberOfDecimals > 0) {
        const decimalValidationRegex = new RegExp(`^\\-?\\d+(\\.\\d{1,${numberOfDecimals}})?$`, 'gm');
        validationSchema = validationSchema.test('maxDigitsAfterDecimal', `${label} must have ${numberOfDecimals} digits after decimal or less`, (number) => {
            if (number) {
                return decimalValidationRegex.test(number.toString());
            }
            // Skip validation if number value is not defined or null
            return true;
        });
    }
    // Add number range validations if defined
    if ((numberRange === null || numberRange === void 0 ? void 0 : numberRange.max) !== undefined) {
        validationSchema = validationSchema.max(numberRange.max);
    }
    if ((numberRange === null || numberRange === void 0 ? void 0 : numberRange.min) !== undefined) {
        validationSchema = validationSchema.min(numberRange.min);
    }
    return validationSchema;
};
const addTextFieldValidations = (field, validationSchema) => {
    const { textConstraints } = field;
    // Add string length validations if defined
    if ((textConstraints === null || textConstraints === void 0 ? void 0 : textConstraints.maxLength) !== undefined) {
        validationSchema = validationSchema.max(textConstraints.maxLength);
    }
    if ((textConstraints === null || textConstraints === void 0 ? void 0 : textConstraints.minLength) !== undefined) {
        validationSchema = validationSchema.min(textConstraints.minLength);
    }
    return validationSchema;
};
