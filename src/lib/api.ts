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
} as const
