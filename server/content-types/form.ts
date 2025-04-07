const toEmail = `${process.env.TO_EMAIL}`

export default {
  kind: 'collectionType',
  collectionName: 'forms',
  info: {
    singularName: 'form',
    pluralName: 'forms',
    displayName: 'Form (Form Builder)',
    description: '',
  },
  options: {
    draftAndPublish: true,
  },
  pluginOptions: {
    'content-manager': {
      visible: false,
    },
    'content-type-builder': {
      visible: false,
    },
  },
  attributes: {
    name: {
      type: 'string',
      required: true,
    },
    uid: {
      type: 'uid',
      required: true,
      targetField: 'name',
    },
    allFields: {
      type: 'json',
    },
    submissions: {
      type: 'relation',
      relation: 'oneToMany',
      target: 'plugin::form-builder.submission',
      mappedBy: 'form',
    },
    confirmationEmail: {
      type: 'json',
      default: {
        subject: 'Form submission notification',
        content: '<h1>Hi!</h1><p>Your Form has been submitted.</p>',
        toEmail: toEmail,
      },
      pluginOptions: {
        'form-builder': {
          adminOnly: true,
        },
      },
    },
    submit: {
      type: 'string',
      required: true,
      default: 'Submit',
    },
    submissionsCount: {
      type: 'integer',
      default: 0,
      pluginOptions: {
        'form-builder': {
          adminOnly: true,
        },
      },
    },
  },
}
