import pluginId from '../pluginId';

// Base URL for API
const BACKEND_BASE_API_URL = `/${pluginId}`;

// API endpoints for the forms plugin
const FormAPIUrls = {
  BASE: BACKEND_BASE_API_URL,
  FORMS: `${BACKEND_BASE_API_URL}/forms`,
  FORMS_WITH_QUERY: (params: Record<string, any>) => `${BACKEND_BASE_API_URL}/forms?${new URLSearchParams(params).toString()}`,
  SINGLE_FORM: (id: number) => `${BACKEND_BASE_API_URL}/forms/${id}`,
  SETTINGS: `${BACKEND_BASE_API_URL}/settings`,
  SUBMISSIONS: `${BACKEND_BASE_API_URL}/submissions`,
};


export default FormAPIUrls;
