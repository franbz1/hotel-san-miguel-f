export const Role = {
  ADMINISTRADOR: 'ADMINISTRADOR',
  CAJERO: 'CAJERO',
  ASEO: 'ASEO',
  REGISTRO_FORMULARIO: 'REGISTRO_FORMULARIO',
} as const

export type RoleType = typeof Role[keyof typeof Role]

// Rutas de redirección según el rol
export const ROLE_ROUTES: Record<RoleType, string> = {
  [Role.ADMINISTRADOR]: '/dashboard',
  [Role.CAJERO]: '/dashboard',
  [Role.ASEO]: '/aseo',
  [Role.REGISTRO_FORMULARIO]: '/registro-formulario/:token',
}

// Ruta por defecto si no coincide ningún rol
export const DEFAULT_ROUTE = '/dashboard'

// Rutas públicas que no requieren autenticación
export const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password']

// Roles existentes en la base de datos
export const EXISTENT_ROLES = [Role.ADMINISTRADOR, Role.CAJERO, Role.ASEO, Role.REGISTRO_FORMULARIO]

// Roles que tienen acceso al dashboard principal
export const DASHBOARD_ACCESS_ROLES: RoleType[] = [Role.ADMINISTRADOR, Role.CAJERO]

// Roles que tienen acceso al módulo de aseo
export const ASEO_ACCESS_ROLES: RoleType[] = [Role.ADMINISTRADOR, Role.ASEO]

// Tiempo de expiración de la cookie en días
export const COOKIE_EXPIRATION_DAYS = 7