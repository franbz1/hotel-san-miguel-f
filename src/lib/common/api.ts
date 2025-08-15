// URL base de la API
// Prioriza variables de entorno de Next para cliente y servidor.
// Fallback a localhost para desarrollo si no están definidas.
export const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001'

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
  GET_ASEO: (limit: number, page: number, requerido_aseo_hoy?: boolean, requerido_desinfeccion_hoy?: boolean, requerido_rotacion_colchones?: boolean, ultimo_aseo_tipo?: string) => {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (page) params.append('page', page.toString());
    if (requerido_aseo_hoy !== undefined) params.append('requerido_aseo_hoy', requerido_aseo_hoy.toString());
    if (requerido_desinfeccion_hoy !== undefined) params.append('requerido_desinfeccion_hoy', requerido_desinfeccion_hoy.toString());
    if (requerido_rotacion_colchones !== undefined) params.append('requerido_rotacion_colchones', requerido_rotacion_colchones.toString());
    if (ultimo_aseo_tipo) params.append('ultimo_aseo_tipo', ultimo_aseo_tipo);
    return `${API_BASE_URL}/habitaciones/aseo?${params.toString()}`;
  },
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
  DAILY_REVENUE: (date: string) => `${API_BASE_URL}/analitics/daily-revenue/${date}`,
  MONTHLY_REVENUE: (year: number, month: number) => `${API_BASE_URL}/analitics/monthly-revenue/${year}/${month}`,
  INVOICES_RANGE: (startDate: string, endDate: string) => `${API_BASE_URL}/analitics/invoices-range?startDate=${startDate}&endDate=${endDate}`,
} as const

// Endpoints de usuarios
export const USUARIO_ENDPOINTS = {
  GET_ALL: (limit: number, page: number) => `${API_BASE_URL}/usuarios?limit=${limit}&page=${page}`,
  GET_BY_ID: (id: number) => `${API_BASE_URL}/usuarios/${id}`,
  CREATE: `${API_BASE_URL}/usuarios`,
  UPDATE: (id: number) => `${API_BASE_URL}/usuarios/${id}`,
  DELETE: (id: number) => `${API_BASE_URL}/usuarios/${id}`,
} as const

// Endpoints de configuración de aseo
export const CONFIGURACION_ASEO_ENDPOINTS = {
  GET: `${API_BASE_URL}/configuracion-aseo`,
  UPDATE: `${API_BASE_URL}/configuracion-aseo`,
} as const

// Endpoints de zonas comunes
export const ZONA_COMUN_ENDPOINTS = {
  GET_ALL: (limit: number, page: number, piso?: number, requerido_aseo_hoy?: boolean, ultimo_aseo_tipo?: string) => {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (page) params.append('page', page.toString());
    if (piso !== undefined) params.append('piso', piso.toString());
    if (requerido_aseo_hoy !== undefined) params.append('requerido_aseo_hoy', requerido_aseo_hoy.toString());
    if (ultimo_aseo_tipo) params.append('ultimo_aseo_tipo', ultimo_aseo_tipo);
    return `${API_BASE_URL}/zonas-comunes?${params.toString()}`;
  },
  GET_BY_ID: (id: number) => `${API_BASE_URL}/zonas-comunes/${id}`,
  CREATE: `${API_BASE_URL}/zonas-comunes`,
  UPDATE: (id: number) => `${API_BASE_URL}/zonas-comunes/${id}`,
  DELETE: (id: number) => `${API_BASE_URL}/zonas-comunes/${id}`,
  GET_REQUIEREN_ASEO: `${API_BASE_URL}/zonas-comunes/requieren-aseo`,
  GET_BY_PISO: (piso: number) => `${API_BASE_URL}/zonas-comunes/piso/${piso}`,
} as const

// Endpoints de registro de aseo de habitaciones
export const REGISTRO_ASEO_HABITACION_ENDPOINTS = {
  GET_ALL: (limit: number, page: number, usuarioId?: number, habitacionId?: number, fecha?: string, tipo_aseo?: string, objetos_perdidos?: boolean, rastros_de_animales?: boolean) => {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (page) params.append('page', page.toString());
    if (usuarioId) params.append('usuarioId', usuarioId.toString());
    if (habitacionId) params.append('habitacionId', habitacionId.toString());
    if (fecha) params.append('fecha', fecha);
    if (tipo_aseo) params.append('tipo_aseo', tipo_aseo);
    if (objetos_perdidos !== undefined) params.append('objetos_perdidos', objetos_perdidos.toString());
    if (rastros_de_animales !== undefined) params.append('rastros_de_animales', rastros_de_animales.toString());
    return `${API_BASE_URL}/registro-aseo-habitaciones?${params.toString()}`;
  },
  GET_BY_ID: (id: number) => `${API_BASE_URL}/registro-aseo-habitaciones/${id}`,
  CREATE: `${API_BASE_URL}/registro-aseo-habitaciones`,
  UPDATE: (id: number) => `${API_BASE_URL}/registro-aseo-habitaciones/${id}`,
  DELETE: (id: number) => `${API_BASE_URL}/registro-aseo-habitaciones/${id}`,
  GET_BY_HABITACION: (id: number) => `${API_BASE_URL}/registro-aseo-habitaciones/habitacion/${id}`,
  GET_BY_USUARIO: (id: number) => `${API_BASE_URL}/registro-aseo-habitaciones/usuario/${id}`,
  GET_BY_FECHA: (fecha: string) => `${API_BASE_URL}/registro-aseo-habitaciones/fecha/${fecha}`,
} as const

// Endpoints de registro de aseo de zonas comunes
export const REGISTRO_ASEO_ZONA_COMUN_ENDPOINTS = {
  GET_ALL: (limit: number, page: number, usuarioId?: number, zonaComunId?: number, fecha?: string, tipo_aseo?: string, objetos_perdidos?: boolean, rastros_de_animales?: boolean) => {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (page) params.append('page', page.toString());
    if (usuarioId) params.append('usuarioId', usuarioId.toString());
    if (zonaComunId) params.append('zonaComunId', zonaComunId.toString());
    if (fecha) params.append('fecha', fecha);
    if (tipo_aseo) params.append('tipo_aseo', tipo_aseo);
    if (objetos_perdidos !== undefined) params.append('objetos_perdidos', objetos_perdidos.toString());
    if (rastros_de_animales !== undefined) params.append('rastros_de_animales', rastros_de_animales.toString());
    return `${API_BASE_URL}/registro-aseo-zonas-comunes?${params.toString()}`;
  },
  GET_BY_ID: (id: number) => `${API_BASE_URL}/registro-aseo-zonas-comunes/${id}`,
  CREATE: `${API_BASE_URL}/registro-aseo-zonas-comunes`,
  UPDATE: (id: number) => `${API_BASE_URL}/registro-aseo-zonas-comunes/${id}`,
  DELETE: (id: number) => `${API_BASE_URL}/registro-aseo-zonas-comunes/${id}`,
  GET_BY_ZONA_COMUN: (id: number) => `${API_BASE_URL}/registro-aseo-zonas-comunes/zona-comun/${id}`,
  GET_BY_USUARIO: (id: number) => `${API_BASE_URL}/registro-aseo-zonas-comunes/usuario/${id}`,
  GET_BY_FECHA: (fecha: string) => `${API_BASE_URL}/registro-aseo-zonas-comunes/fecha/${fecha}`,
} as const

// Endpoints de reportes de aseo
export const REPORTE_ASEO_ENDPOINTS = {
  GET_ALL: (limit: number, page: number, fecha?: string, fecha_inicio?: string, fecha_fin?: string, elemento_aseo?: string, producto_quimico?: string, elemento_proteccion?: string) => {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (page) params.append('page', page.toString());
    if (fecha) params.append('fecha', fecha);
    if (fecha_inicio) params.append('fecha_inicio', fecha_inicio);
    if (fecha_fin) params.append('fecha_fin', fecha_fin);
    if (elemento_aseo) params.append('elemento_aseo', elemento_aseo);
    if (producto_quimico) params.append('producto_quimico', producto_quimico);
    if (elemento_proteccion) params.append('elemento_proteccion', elemento_proteccion);
    return `${API_BASE_URL}/reportes-aseo?${params.toString()}`;
  },
  GET_BY_ID: (id: number) => `${API_BASE_URL}/reportes-aseo/${id}`,
  CREATE: `${API_BASE_URL}/reportes-aseo`,
  UPDATE: (id: number) => `${API_BASE_URL}/reportes-aseo/${id}`,
  DELETE: (id: number) => `${API_BASE_URL}/reportes-aseo/${id}`,
  GET_BY_FECHA: (fecha: string) => `${API_BASE_URL}/reportes-aseo/fecha/${fecha}`,
  GENERAR: `${API_BASE_URL}/reportes-aseo/generar`,
} as const

