// URL base de la API
export const API_BASE_URL = 'http://localhost:3001'

// Endpoints de autenticación
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  VALIDATE: `${API_BASE_URL}/auth/validate`,
} as const

// Endpoints de usuarios
export const USER_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/users`,
  GET_BY_ID: (id: number) => `${API_BASE_URL}/users/${id}`,
  CREATE: `${API_BASE_URL}/users`,
  UPDATE: (id: number) => `${API_BASE_URL}/users/${id}`,
  DELETE: (id: number) => `${API_BASE_URL}/users/${id}`,
} as const

// Endpoints de habitaciones
export const ROOM_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/rooms`,
  GET_BY_ID: (id: number) => `${API_BASE_URL}/rooms/${id}`,
  CREATE: `${API_BASE_URL}/rooms`,
  UPDATE: (id: number) => `${API_BASE_URL}/rooms/${id}`,
  DELETE: (id: number) => `${API_BASE_URL}/rooms/${id}`,
} as const

// Endpoints de reservas
export const RESERVATION_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/reservations`,
  GET_BY_ID: (id: number) => `${API_BASE_URL}/reservations/${id}`,
  CREATE: `${API_BASE_URL}/reservations`,
  UPDATE: (id: number) => `${API_BASE_URL}/reservations/${id}`,
  DELETE: (id: number) => `${API_BASE_URL}/reservations/${id}`,
} as const 