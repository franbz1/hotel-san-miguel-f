export enum Role {
  ADMINISTRADOR = 'ADMINISTRADOR',
  CAJERO = 'CAJERO',
  ASEO = 'ASEO',
  REGISTRO_FORMULARIO = 'REGISTRO_FORMULARIO',
}

// Rutas de redirección según el rol
export const ROLE_ROUTES: Record<string, string> = {
  [Role.ADMINISTRADOR]: '/dashboard/admin',
  [Role.CAJERO]: '/dashboard/cajero',
  [Role.ASEO]: '/dashboard/aseo',
  [Role.REGISTRO_FORMULARIO]: '/dashboard/registro',
  // Ruta por defecto si no coincide ningún rol
  DEFAULT: '/dashboard',
}

// Tiempo de expiración de la cookie en días
export const COOKIE_EXPIRATION_DAYS = 7 