// URL base de la API
export const API_BASE_URL = 'http://localhost:3001'

// Endpoints de autenticación
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  VALIDATE: `${API_BASE_URL}/auth/validate`,
} as const

// Endpoints de habitaciones
export const HABITACION_ENDPOINTS = {
  GET_ALL: (limit: number, page: number) => `${API_BASE_URL}/habitaciones?limit=${limit}&page=${page}`,
  GET_BY_ID: (id: number) => `${API_BASE_URL}/habitaciones/${id}`,
  GET_BY_NUMBER: (number: string) => `${API_BASE_URL}/habitaciones/numero_habitacion/${number}`,
  CREATE: `${API_BASE_URL}/habitaciones`,
  UPDATE: (id: number) => `${API_BASE_URL}/habitaciones/${id}`,
  DELETE: (id: number) => `${API_BASE_URL}/habitaciones/${id}`,
  POST_ALL_AVAILABLE_BY_DATE_RANGE: `${API_BASE_URL}/habitaciones/disponibles`,
} as const

// Endpoints de reservas
export const RESERVA_ENDPOINTS = {
  GET_ALL: (limit: number, page: number) => `${API_BASE_URL}/reservas?limit=${limit}&page=${page}`,
  GET_BY_ID: (id: number) => `${API_BASE_URL}/reservas/${id}`,
  CREATE: `${API_BASE_URL}/reservas`,
  UPDATE: (id: number) => `${API_BASE_URL}/reservas/${id}`,
  DELETE: (id: number) => `${API_BASE_URL}/reservas/${id}`,
} as const

// Endpoints de huespedes
export const HUESPED_ENDPOINTS = {
  GET_ALL: (limit: number, page: number) => `${API_BASE_URL}/huespedes?limit=${limit}&page=${page}`,
  GET_BY_ID: (id: number) => `${API_BASE_URL}/huespedes/${id}`,
  GET_BY_DOCUMENT: (document: string) => `${API_BASE_URL}/huespedes/documento/${document}`,
  CREATE: `${API_BASE_URL}/huespedes`,
  UPDATE: (id: number) => `${API_BASE_URL}/huespedes/${id}`,
  DELETE: (id: number) => `${API_BASE_URL}/huespedes/${id}`,
} as const

export const FORMULARIO_ENDPOINTS = {
  GET_ALL: (limit: number, page: number) => `${API_BASE_URL}/formularios?limit=${limit}&page=${page}`,
  GET_BY_ID: (id: number) => `${API_BASE_URL}/formularios/${id}`,
  UPDATE: (id: number) => `${API_BASE_URL}/formularios/${id}`,
  DELETE: (id: number) => `${API_BASE_URL}/formularios/${id}`,
} as const

export const LINK_FORMULARIO_ENDPOINTS = {
  GET_ALL: (limit: number, page: number) => `${API_BASE_URL}/link-formulario?limit=${limit}&page=${page}`,
  GET_BY_ID: (id: number) => `${API_BASE_URL}/link-formulario/${id}`,
  CREATE: `${API_BASE_URL}/link-formulario`,
  UPDATE: (id: number) => `${API_BASE_URL}/link-formulario/${id}`,
  DELETE: (id: number) => `${API_BASE_URL}/link-formulario/${id}`,
  REGENERATE: (id: number) => `${API_BASE_URL}/link-formulario/${id}/regenerate`,
} as const
