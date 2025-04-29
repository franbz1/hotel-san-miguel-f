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

// Tiempo de expiración de la cookie en días
export const COOKIE_EXPIRATION_DAYS = 7

// Lista de códigos de países
export const COUNTRY_CODES = [
  { code: "+57", country: "Colombia" },
  { code: "+1", country: "Estados Unidos" },
  { code: "+34", country: "España" },
  { code: "+52", country: "México" },
  { code: "+54", country: "Argentina" },
  { code: "+56", country: "Chile" },
  { code: "+55", country: "Brasil" },
  { code: "+51", country: "Perú" },
  { code: "+593", country: "Ecuador" },
  { code: "+58", country: "Venezuela" },
  { code: "+502", country: "Guatemala" },
  { code: "+503", country: "El Salvador" },
  { code: "+505", country: "Nicaragua" },
  { code: "+506", country: "Costa Rica" },
  { code: "+507", country: "Panamá" },
  { code: "+591", country: "Bolivia" },
  { code: "+595", country: "Paraguay" },
  { code: "+598", country: "Uruguay" },
  { code: "+39", country: "Italia" },
  { code: "+33", country: "Francia" },
  { code: "+49", country: "Alemania" },
  { code: "+44", country: "Reino Unido" },
  { code: "+31", country: "Países Bajos" },
  { code: "+351", country: "Portugal" },
  { code: "+86", country: "China" },
  { code: "+81", country: "Japón" },
  { code: "+82", country: "Corea del Sur" },
  { code: "+91", country: "India" },
  { code: "+61", country: "Australia" },
  { code: "+64", country: "Nueva Zelanda" },
];