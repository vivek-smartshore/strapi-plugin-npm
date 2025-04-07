export default {
  kind: 'collectionType',
  collectionName: 'submissions',
  info: {
    singularName: 'submission',
    pluralName: 'submissions',
    displayName: 'Form Submission (Form Builder)',
    description: '',
  },
  options: {
    draftAndPublish: false,
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
    form: {
      type: 'relation',
      relation: 'manyToOne',
      target: 'plugin::form-builder.form',
      inversedBy: 'submissions',
      required: true,
    },
    slug: {
      type: 'uid',
      required: true,
    },
    submittedData: {
      type: 'json',
      required: true,
    },
  },
}
