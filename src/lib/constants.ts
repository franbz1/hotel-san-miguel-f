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
  [Role.ASEO]: '/dashboard/aseo',
  [Role.REGISTRO_FORMULARIO]: '/dashboard/registro',
}

// Ruta por defecto si no coincide ningún rol
export const DEFAULT_ROUTE = '/dashboard'

// Roles existentes en la base de datos
export const EXISTENT_ROLES = [Role.ADMINISTRADOR, Role.CAJERO, Role.ASEO, Role.REGISTRO_FORMULARIO]

// Roles que tienen acceso al dashboard principal
export const DASHBOARD_ACCESS_ROLES: RoleType[] = [Role.ADMINISTRADOR, Role.CAJERO]

// Tiempo de expiración de la cookie en días
export const COOKIE_EXPIRATION_DAYS = 7 