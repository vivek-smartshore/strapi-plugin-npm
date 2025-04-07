import { factories, Strapi } from '@strapi/strapi'
import {
  convertInputDataTypes,
  sendConfirmationEmail,
  validateFieldsOnSubmission,
  validateSubmissionSchema,
} from './helper'
import { errors } from '@strapi/utils'
import { FieldData } from '../../types'
import { FBContentTypes } from '../types'
const { ApplicationError } = errors

const contentTypeUID = FBContentTypes.FB_SUBMISSIONS
export default factories.createCoreService(contentTypeUID, ({ strapi }: { strapi: Strapi }) => ({
  async create(submissionData) {
    // First validate the required fields
    validateSubmissionSchema(submissionData.data)

    // Get the related form for which submission is to be made
    const relatedForm = await strapi.plugin('form-builder').service('form').findOne(submissionData.data.form)

    // Accept submissions for only published forms
    if (relatedForm?.publishedAt === null) {
      throw new ApplicationError('Submissions are only accepted for published forms.', {
        form: { id: submissionData.data.form },
      })
    }

    // Clean and convert the submitted data types based on the form field definitions
    const cleanedData = convertInputDataTypes(relatedForm?.allFields as FieldData[], submissionData.data.submittedData)

    // Validate the cleaned and converted data against the form field definitions
    await validateFieldsOnSubmission(relatedForm, cleanedData)

    // Assign the cleaned data back to the submission object
    submissionData.data.submittedData = cleanedData

    // Generate submission slug
    const uuid = await strapi.plugins['content-manager'].services.uid.generateUIDField({
      contentTypeUID,
      field: 'slug',
      data: submissionData,
    })
    submissionData.data.slug = uuid

    const newSubmission = await strapi.entityService?.create(contentTypeUID, submissionData)

    const settings = await strapi.plugin('form-builder').service('settings').getSettings();
    const confirmationSettings = settings.confirmation;

    try {

      const emailsToSend: string[] = [];
      // if form have form submission confirmation for user
      if (relatedForm.confirmationEmail.isConfirmationEmail) {
        // Extract email fields that get submission confirmation
        const toEmails = relatedForm.allFields
          .filter(field => field.type === 'email' && field.sendEmailConfirm)
          .map(field => newSubmission?.submittedData[field.id])
          .filter(Boolean); // Filter out undefined/null values

        emailsToSend.push(...toEmails);

        const emailTemplateStaticUser = {
          subject: relatedForm.confirmationEmail.subject,
          text: '',
          html: relatedForm.confirmationEmail.content,
        };
        await sendConfirmationEmail(emailsToSend, emailTemplateStaticUser);
      }

      // for admin form submission confirmation
      if (confirmationSettings.active && confirmationSettings.email?.address) {
        const emailTemplateStaticAdmin = {
          subject: confirmationSettings.email.subject,
          text: '',
          html: confirmationSettings.email.content,
        };

        const adminEmail = [confirmationSettings.email?.address]
        await sendConfirmationEmail(adminEmail, emailTemplateStaticAdmin);
      }
    } catch (error) {
      strapi.log.error(`Error sending confirmation email: ${JSON.stringify(error.message)}`);
      const errorMessage = 'Submission created. Email could not be sent.';
      const appError =new ApplicationError(errorMessage, error.message);
      return {
        results: newSubmission,
        e: appError,
      }
    }
    return { results: newSubmission }
  },
  async find(query) {
    return super.find(query)
  },
  async findOne(id, query) {
    return await super.findOne(id, query)
  },
  async delete(id) {
    // Return only ID field after delete
    const deleteSubmission = await super.delete(id, {
      fields: ['id'],
      populate: ['form'],
    })

    // Update Submission count for particular form after deleting submissions
    const formId = deleteSubmission.form.id
    const submissionsCount = await strapi.entityService?.count('plugin::form-builder.submission', {
      filters: {
        form: formId,
      },
    })

    const data: any = {
      submissionsCount,
    }
    await strapi.entityService?.update('plugin::form-builder.form', formId, {
      data,
    })

    return deleteSubmission
  },
}))
