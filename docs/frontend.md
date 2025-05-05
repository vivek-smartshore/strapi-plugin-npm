
# 🌐 Frontend Integration Guide

This guide explains how to fetch forms and submit form data using REST and GraphQL.

---

## 📥 Field Reference

- **`form`**: This is the numeric ID of the form you want to submit data to. You can fetch it using the “Get All Forms” or “Get Single Form” endpoints.
- **`field-id`**: Each form field has a unique ID (UUID format). You can find these in the form schema returned by the `GET /forms/:formId` endpoint.

---

## 🔍 Get All Forms (REST)

**Endpoint:**

```
GET {{STRAPI_BASE_URL}}/api/form-builder/forms
```

---

## 🔍 Get Single Form (REST)

**Endpoint:**

```
GET {{STRAPI_BASE_URL}}/api/form-builder/forms/:formId
```

---

## 📤 Create Submission (REST)

**Endpoint:**

```
POST {{STRAPI_BASE_URL}}/api/form-builder/submissions
Content-Type: application/json
```

**Body:**

```json
{
  "data": {
    "submittedData": {
      "6140c5b7-e997-4d82-9fe7-43dba9147666": "John Doe",
      "af4f1a0f-ba7b-4899-8761-977d4e5253aa": "john@example.com"
    },
    "form": 44
  }
}
```

**Description:**  
This endpoint creates a submission for a given form (`form`) with the submitted data using the `field-id`s and the corresponding values.

---

## 📤 Create Submission (GraphQL)

**Endpoint:**

```
POST {{STRAPI_BASE_URL}}/graphql
Content-Type: application/json
```

**Mutation:**

```graphql
mutation createSubs($submissionData: CreateSubmissionInput!) {
  createFormBuilderSubmission(data: $submissionData) {
    data {
      id
      attributes {
        slug
        submittedData
        form {
          data {
            id
            attributes {
              name
            }
          }
        }
      }
    }
  }
}
```

**Variables:**

```json
{
  "submissionData": {
    "form": 1,
    "submittedData": [
      { "id": "6140c5b7-e997-4d82-9fe7-43dba9147666", "value": "Developer" },
      { "id": "af4f1a0f-ba7b-4899-8761-977d4e5253aa", "value": "developer@smartshore.nl" }
    ]
  }
}
```

**Description:**  
This GraphQL mutation allows you to create a form submission by passing the form ID and corresponding field data. Replace `field-id` with the actual IDs from the form schema.


This is the complete guide for interacting with the Form Builder plugin from the frontend using both REST and GraphQL. You can now integrate form submission functionality into your frontend, whether you're working with REST APIs or using GraphQL.
