/* FORM */
export type Form = {
  id: number
  attributes: FormAttributes
}

export type TextConstraints = {
  minLength?: number
  maxLength?: number
}

export type FieldOption = {
  label: string
  value: string
}

export type NumberRange = {
  min?: number
  max?: number
}

export type FieldData = {
  id: string
  type: string
  label: string
  isRequired: boolean
  sendEmailConfirm?:boolean
  options?: FieldOption[]
  placeholder?: string
  numberOfDecimals?: number
  numberRange?: NumberRange
  textConstraints?: TextConstraints
}

export type ConfirmationEmail = {
  subject: string
  content: string
  isConfirmationEmail : boolean
}

export type FormAttributes = {
  name: string
  uid: number
  allFields: FieldData[]
  confirmationEmail: ConfirmationEmail
  submissionsCount?: number
  submit: string
  createdAt: string
  updatedAt: string
  publishedAt: string | null
}

/* Submission */
export type Submission = {
  id: number
  attributes: SubmissionsAttributes
}
export type SubmissionsAttributes = {
  slug: string
  createdAt: string
  updatedAt: string
  submittedData: Record<string, any>
  form?: {
    data: Form
  }
}
/* Settings */
export type Settings = {
  confirmation: ConfirmationSettings
}

export type ConfirmationSettings = {
  active: boolean
  email: ConfirmationEmailSettings
}
export type ConfirmationEmailSettings = {
  address: string
  subject: string
  content: string
}
