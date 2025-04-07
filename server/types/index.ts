export enum FBContentTypes {
  FB_FORMS = 'plugin::form-builder.form',
  FB_SUBMISSIONS = 'plugin::form-builder.submission',
}

export type FBEntityResponse = Record<string, any> | Record<string, any>[]
