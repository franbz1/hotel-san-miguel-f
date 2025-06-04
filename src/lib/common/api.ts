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
  VALIDATE: (token: string) => `${API_BASE_URL}/link-formulario/validate-token/${token}`,
  REGENERATE: (id: number) => `${API_BASE_URL}/link-formulario/${id}/regenerate`,
  GET_ALL_BY_HABITACION: (numeroHabitacion: number, limit: number, page: number) => `${API_BASE_URL}/link-formulario/habitacion/${numeroHabitacion}?limit=${limit}&page=${page}`,
} as const

export const REGISTRO_FORMULARIO_ENDPOINTS = {
  CREATE: (token: string) => `${API_BASE_URL}/registro-formulario/${token}`,
  UPLOAD_TRA: (token: string) => `${API_BASE_URL}/registro-formulario/tra/${token}`,
  TRY_UPLOAD_TRA: (id: number) => `${API_BASE_URL}/registro-formulario/tra/formulario/${id}`,
} as const

export const BOOKING_ENDPOINTS = {
  DELETE: (id: number) => `${API_BASE_URL}/eliminar-booking/${id}`,
} as const

export const SSE_ENDPOINTS = {
  HABITACIONES_CAMBIOS: `${API_BASE_URL}/sse/habitaciones-cambios`,
} as const

// Endpoints de huespedes secundarios
export const HUESPED_SECUNDARIO_ENDPOINTS = {
  GET_ALL: (limit: number, page: number) => `${API_BASE_URL}/huespedes-secundarios?limit=${limit}&page=${page}`,
  GET_BY_ID: (id: number) => `${API_BASE_URL}/huespedes-secundarios/${id}`,
  GET_BY_HUESPED_ID: (huespedId: number, limit: number, page: number) => `${API_BASE_URL}/huespedes-secundarios/huespedId/${huespedId}?limit=${limit}&page=${page}`,
  GET_BY_DOCUMENT: (numeroDocumento: string) => `${API_BASE_URL}/huespedes-secundarios/numeroDocumento/${numeroDocumento}`,
  CREATE: `${API_BASE_URL}/huespedes-secundarios`,
  UPDATE: (id: number) => `${API_BASE_URL}/huespedes-secundarios/${id}`,
  DELETE: (id: number) => `${API_BASE_URL}/huespedes-secundarios/${id}`,
} as const

// Endpoints de analíticas
export const ANALYTICS_ENDPOINTS = {
  // Analíticas de ocupación
  OCUPACION: (params?: URLSearchParams) => `${API_BASE_URL}/analytics/ocupacion${params ? `?${params.toString()}` : ''}`,
  
  // Demografia de huéspedes
  HUESPEDES_DEMOGRAFIA: (params?: URLSearchParams) => `${API_BASE_URL}/analytics/huespedes/demografia${params ? `?${params.toString()}` : ''}`,
  
  // Procedencia de huéspedes
  HUESPEDES_PROCEDENCIA: (params?: URLSearchParams) => `${API_BASE_URL}/analytics/huespedes/procedencia${params ? `?${params.toString()}` : ''}`,
  
  // Rendimiento de habitaciones
  HABITACIONES_RENDIMIENTO: (params?: URLSearchParams) => `${API_BASE_URL}/analytics/habitaciones/rendimiento${params ? `?${params.toString()}` : ''}`,
  
  // Motivos de viaje
  MOTIVOS_VIAJE: (params?: URLSearchParams) => `${API_BASE_URL}/analytics/motivos-viaje${params ? `?${params.toString()}` : ''}`,
  
  // Predicción de ocupación
  FORECAST_OCUPACION: (params?: URLSearchParams) => `${API_BASE_URL}/analytics/forecast/ocupacion${params ? `?${params.toString()}` : ''}`,
  
  // Dashboard ejecutivo
  DASHBOARD: (params?: URLSearchParams) => `${API_BASE_URL}/analytics/dashboard${params ? `?${params.toString()}` : ''}`,
} as const

