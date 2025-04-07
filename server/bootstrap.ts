import { Strapi } from '@strapi/strapi'

const RBAC_ACTIONS = [
  {
    section: 'plugins',
    subCategory: 'Forms',
    displayName: 'Create',
    uid: 'forms.create',
    pluginName: 'form-builder',
  },
  {
    section: 'plugins',
    subCategory: 'Forms',
    displayName: 'Read',
    uid: 'forms.read',
    pluginName: 'form-builder',
  },
  {
    section: 'plugins',
    subCategory: 'Forms',
    displayName: 'Update',
    uid: 'forms.update',
    pluginName: 'form-builder',
  },
  {
    section: 'plugins',
    subCategory: 'Forms',
    displayName: 'Delete',
    uid: 'forms.delete',
    pluginName: 'form-builder',
  },
  {
    section: 'plugins',
    subCategory: 'Form Submissions',
    displayName: 'Create',
    uid: 'submissions.create',
    pluginName: 'form-builder',
  },
  {
    section: 'plugins',
    subCategory: 'Form Submissions',
    displayName: 'Read',
    uid: 'submissions.read',
    pluginName: 'form-builder',
  },
  {
    section: 'plugins',
    subCategory: 'Form Submissions',
    displayName: 'Update',
    uid: 'submissions.update',
    pluginName: 'form-builder',
  },
  {
    section: 'plugins',
    subCategory: 'Form Submissions',
    displayName: 'Delete',
    uid: 'submissions.delete',
    pluginName: 'form-builder',
  },
]

export default async ({ strapi }: { strapi: Strapi }) => {
  await strapi.admin?.services.permission.actionProvider.registerMany(RBAC_ACTIONS)

  // Cascade delete workaround. Delete related submissions before deleting forms.
  strapi.db?.lifecycles.subscribe({
    models: ['plugin::form-builder.form'],

    async beforeDelete(event) {
      const { params } = event
      const formId = params.where.id

      const relatedSubs = await strapi.entityService?.findMany('plugin::form-builder.submission', {
        filters: {
          form: formId,
        },
        fields: ['id'],
      })

      if (relatedSubs) {
        const subsToDelete: any | unknown = relatedSubs
        const subIds = subsToDelete.map((sub) => sub.id)
        await strapi.db?.query('plugin::form-builder.submission').deleteMany({
          where: {
            id: {
              $in: subIds,
            },
          },
        })
        strapi.log.info(`Deleted submissions: ${JSON.stringify(subIds)}`); 
      }
    },
  })

  // Update form submissions count on submission creation
  strapi.db?.lifecycles.subscribe({
    models: ['plugin::form-builder.submission'],

    async afterCreate(event: any) {
      const { params } = event
      const formId = params.data.form

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
    },
  })
}
