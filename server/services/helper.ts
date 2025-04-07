import { Strapi } from '@strapi/strapi'
import { ConfirmationEmail, FieldData } from '../../types'
import * as yup from 'yup'
import { handleYupError, validateYupSchemaSync, errors } from '@strapi/utils'
const { ApplicationError } = errors

const getPluginStore = (strapi: Strapi) => {
  return strapi.store
    ? strapi.store({
      environment: '',
      type: 'plugin',
      name: 'form-builder',
    })
    : null
}

const createDefaultConfig = async (strapi: Strapi) => {
  const pluginStore = getPluginStore(strapi)
  const value = {
    confirmation: {
      active: true,
      email: {
        address: '',
        subject: '',
        content: '',
      },
    },
  }
  await pluginStore?.set({ key: 'settings', value })
  return pluginStore?.get({ key: 'settings' })
}

const validateFieldsOnSubmission = async (form, submittedData) => {
  if (form?.allFields && submittedData) {
    const allFields: any = form.allFields

    // Build validator schema for fields using Yup
    const fieldValidator = {}
    allFields.map((field: FieldData) => {
      let fieldValidation
      const { label, isRequired, id: fieldId } = field

      switch (field.type) {
        case 'number':
          fieldValidation = yup.number()
          fieldValidation = addNumberFieldValidations(field, fieldValidation)
          break
        case 'email':
          fieldValidation = yup.string().email()
          break
        case 'checkbox':
          fieldValidation = yup.array().of(yup.string())
          break
        case 'date':
          fieldValidation = yup.date().typeError(`${label} must be a valid ISO 8601 date`)
          break
        case 'text':
        case 'textarea':
          fieldValidation = addTextFieldValidations(field, yup.string())
          break
        default:
          fieldValidation = yup.string()
          break
      }

      if (isRequired) {
        fieldValidation = fieldValidation.required(`${label} must be defined`)
      }

      fieldValidator[fieldId] = fieldValidation
    })
    const fieldSchema = yup.object().shape(fieldValidator)

    try {
      // Run validator
      await fieldSchema.validate(submittedData, {
        strict: true,
        abortEarly: false,
      })
    } catch (e) {
      strapi.log.info(`${JSON.stringify(e)}`);


      if (e instanceof yup.ValidationError) {
        // Modify to include correct field paths & handle the using Strapi default handler
        handleYupError({
          ...e,
          inner: e.inner.map(({ path, params, ...err1 }) => ({
            ...err1,
            path: `submittedData.${path}`,
            params: {
              ...params,
              path: `submittedData.${params?.path}`,
            },
          })),
        })
      } else {
        throw new ApplicationError('An error occurred in validating submitted data!')
      }
    }
  }
}

const validateSubmissionSchema = (data) => {
  // Validate if the form & submission data is provided first
  const submissionSchema = yup.object({
    form: yup.number().required('form must be defined.'),
    submittedData: yup.object().required('submittedData must be defined.'),
  })
  validateYupSchemaSync(submissionSchema)(data)
}

const convertInputDataTypes = (formFields: FieldData[], submittedData: Record<string, any>) => {
  const convertedData: Record<string, any> = {}

  formFields.forEach((field) => {
    const fieldValue = submittedData[field.id]

    // Only process fields with defined values
    if (fieldValue !== undefined) {
      let convertedValue = fieldValue

      if (field.type == 'number') {
        convertedValue = fieldValue !== '' ? Number(fieldValue) : null
      }

      // Convert date string to object required for validation
      if (field.type == 'date') {
        convertedValue = fieldValue !== '' ? new Date(fieldValue) : null
      }

      // Only add fields to convertedData if they have a valid value
      if (convertedValue !== null && convertedValue !== undefined) {
        convertedData[field.id] = convertedValue
      }
    }
  })

  return convertedData
}

const sendConfirmationEmail = async (
  toEmails: string[],
  emailTemplateStatic: {
    subject: string;
    text: string;
    html: any;
  }
) => {
  const fromEmail = process.env.FROM_EMAIL || '' // set as Global
  if (toEmails?.length > 0 && fromEmail) {
    await Promise.all(toEmails.map(async (recipient) => {
      try {
        await strapi.plugins['email'].services.email.sendTemplatedEmail(
          { to: recipient },
          emailTemplateStatic
        );
      } catch (error) {
        strapi.log.error(`Failed to send email to: ${recipient}`);
        throw new Error(error);
      }
    }));
  } else {
    throw new Error('Missing To/From email addresses!');
  }
};


const addNumberFieldValidations = (field: FieldData, validationSchema) => {
  const { numberOfDecimals = 0, numberRange, label } = field

  // Add decimal digits validations
  if (numberOfDecimals === 0) {
    validationSchema = validationSchema.integer()
  }
  if (numberOfDecimals > 0) {
    const decimalValidationRegex = new RegExp(`^\\-?\\d+(\\.\\d{1,${numberOfDecimals}})?$`, 'gm')
    validationSchema = validationSchema.test(
      'maxDigitsAfterDecimal',
      `${label} must have ${numberOfDecimals} digits after decimal or less`,
      (number: number) => {
        if (number) {
          return decimalValidationRegex.test(number.toString())
        }
        // Skip validation if number value is not defined or null
        return true
      }
    )
  }

  // Add number range validations if defined
  if (numberRange?.max !== undefined) {
    validationSchema = validationSchema.max(numberRange.max)
  }
  if (numberRange?.min !== undefined) {
    validationSchema = validationSchema.min(numberRange.min)
  }

  return validationSchema
}

const addTextFieldValidations = (field: FieldData, validationSchema: yup.StringSchema) => {
  const { textConstraints } = field

  // Add string length validations if defined
  if (textConstraints?.maxLength !== undefined) {
    validationSchema = validationSchema.max(textConstraints.maxLength)
  }
  if (textConstraints?.minLength !== undefined) {
    validationSchema = validationSchema.min(textConstraints.minLength)
  }

  return validationSchema
}

export {
  getPluginStore,
  createDefaultConfig,
  validateFieldsOnSubmission,
  validateSubmissionSchema,
  convertInputDataTypes,
  sendConfirmationEmail,
}
