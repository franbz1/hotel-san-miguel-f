import { Role, RoleType } from '@/lib/common/constants/constants'

/**
 * Configuración centralizada de permisos del sistema
 * Define qué roles pueden acceder a qué funcionalidades
 */
export const PERMISSIONS = {
  // Permisos para Analytics
  ANALYTICS: {
    VIEW: [Role.ADMINISTRADOR], // Solo administradores pueden ver analytics
    EXPORT: [Role.ADMINISTRADOR], // Solo administradores pueden exportar analytics
  },
  
  // Permisos para Reservas
  RESERVAS: {
    VIEW: [Role.ADMINISTRADOR, Role.CAJERO], // Admin y cajero pueden ver reservas
    CREATE: [Role.ADMINISTRADOR, Role.CAJERO], // Admin y cajero pueden crear reservas
    EDIT: [Role.ADMINISTRADOR, Role.CAJERO], // Admin y cajero pueden editar reservas
    DELETE: [Role.ADMINISTRADOR], // Solo administradores pueden eliminar reservas
    EXPORT: [Role.ADMINISTRADOR], // Solo administradores pueden exportar reservas
  },
  
  // Permisos para Huéspedes
  HUESPEDES: {
    VIEW: [Role.ADMINISTRADOR, Role.CAJERO], // Admin y cajero pueden ver huéspedes
    CREATE: [Role.ADMINISTRADOR, Role.CAJERO], // Admin y cajero pueden crear huéspedes
    EDIT: [Role.ADMINISTRADOR, Role.CAJERO], // Admin y cajero pueden editar huéspedes
    DELETE: [Role.ADMINISTRADOR], // Solo administradores pueden eliminar huéspedes
    EXPORT: [Role.ADMINISTRADOR], // Solo administradores pueden exportar huéspedes
  },
  
  // Permisos para Usuarios (gestión de usuarios del sistema)
  USUARIOS: {
    VIEW: [Role.ADMINISTRADOR], // Solo administradores pueden ver usuarios
    CREATE: [Role.ADMINISTRADOR], // Solo administradores pueden crear usuarios
    EDIT: [Role.ADMINISTRADOR], // Solo administradores pueden editar usuarios
    DELETE: [Role.ADMINISTRADOR], // Solo administradores pueden eliminar usuarios
  },
  
  // Permisos para Habitaciones
  HABITACIONES: {
    VIEW: [Role.ADMINISTRADOR, Role.CAJERO], // Admin y cajero pueden ver habitaciones
    CREATE: [Role.ADMINISTRADOR], // Solo administradores pueden crear habitaciones
    EDIT: [Role.ADMINISTRADOR], // Solo administradores pueden editar habitaciones
    DELETE: [Role.ADMINISTRADOR], // Solo administradores pueden eliminar habitaciones
  },
  
  // Permisos para Finanzas/Facturas
  FINANZAS: {
    VIEW: [Role.ADMINISTRADOR], // Solo administradores pueden ver finanzas
    EXPORT: [Role.ADMINISTRADOR], // Solo administradores pueden exportar datos financieros
  },
  
  // Permisos para Configuración del Sistema
  CONFIGURACION: {
    VIEW: [Role.ADMINISTRADOR], // Solo administradores pueden ver configuración
    EDIT: [Role.ADMINISTRADOR], // Solo administradores pueden editar configuración
  },
  
  // Permisos para Dashboard
  DASHBOARD: {
    ACCESS: [Role.ADMINISTRADOR, Role.CAJERO], // Admin y cajero tienen acceso al dashboard
  },
  
  // Permisos para Formularios de Registro
  FORMULARIOS: {
    VIEW: [Role.ADMINISTRADOR, Role.CAJERO], // Admin y cajero pueden ver formularios
    CREATE: [Role.ADMINISTRADOR, Role.CAJERO], // Admin y cajero pueden crear formularios
    MANAGE: [Role.ADMINISTRADOR], // Solo administradores pueden gestionar formularios
  },
  
  // Permisos para Aseo/Limpieza
  ASEO: {
    VIEW: [Role.ADMINISTRADOR, Role.ASEO, Role.CAJERO], // Admin y personal de aseo pueden ver tareas
    MANAGE: [Role.ADMINISTRADOR, Role.ASEO, Role.CAJERO], // Admin y personal de aseo pueden gestionar tareas
  },
} as const

/**
 * Función helper para verificar si un rol tiene un permiso específico
 * @param userRole - Rol del usuario actual
 * @param permission - Array de roles permitidos
 * @returns true si el usuario tiene permiso, false en caso contrario
 */
export function hasPermission(userRole: RoleType | undefined, permission: readonly RoleType[]): boolean {
  if (!userRole) return false
  return permission.includes(userRole)
}

/**
 * Función helper para obtener todos los permisos de un rol específico
 * @param userRole - Rol del usuario
 * @returns objeto con todos los permisos booleanos
 */
export function getRolePermissions(userRole: RoleType | undefined) {
  return {
    // Analytics
    canViewAnalytics: hasPermission(userRole, PERMISSIONS.ANALYTICS.VIEW),
    canExportAnalytics: hasPermission(userRole, PERMISSIONS.ANALYTICS.EXPORT),
    
    // Reservas
    canViewReservas: hasPermission(userRole, PERMISSIONS.RESERVAS.VIEW),
    canCreateReservas: hasPermission(userRole, PERMISSIONS.RESERVAS.CREATE),
    canEditReservas: hasPermission(userRole, PERMISSIONS.RESERVAS.EDIT),
    canDeleteReservas: hasPermission(userRole, PERMISSIONS.RESERVAS.DELETE),
    canExportReservas: hasPermission(userRole, PERMISSIONS.RESERVAS.EXPORT),
    
    // Huéspedes
    canViewHuespedes: hasPermission(userRole, PERMISSIONS.HUESPEDES.VIEW),
    canCreateHuespedes: hasPermission(userRole, PERMISSIONS.HUESPEDES.CREATE),
    canEditHuespedes: hasPermission(userRole, PERMISSIONS.HUESPEDES.EDIT),
    canDeleteHuespedes: hasPermission(userRole, PERMISSIONS.HUESPEDES.DELETE),
    canExportHuespedes: hasPermission(userRole, PERMISSIONS.HUESPEDES.EXPORT),
    
    // Usuarios
    canViewUsuarios: hasPermission(userRole, PERMISSIONS.USUARIOS.VIEW),
    canCreateUsuarios: hasPermission(userRole, PERMISSIONS.USUARIOS.CREATE),
    canEditUsuarios: hasPermission(userRole, PERMISSIONS.USUARIOS.EDIT),
    canDeleteUsuarios: hasPermission(userRole, PERMISSIONS.USUARIOS.DELETE),
    
    // Habitaciones
    canViewHabitaciones: hasPermission(userRole, PERMISSIONS.HABITACIONES.VIEW),
    canCreateHabitaciones: hasPermission(userRole, PERMISSIONS.HABITACIONES.CREATE),
    canEditHabitaciones: hasPermission(userRole, PERMISSIONS.HABITACIONES.EDIT),
    canDeleteHabitaciones: hasPermission(userRole, PERMISSIONS.HABITACIONES.DELETE),
    
    // Finanzas
    canViewFinanzas: hasPermission(userRole, PERMISSIONS.FINANZAS.VIEW),
    canExportFinanzas: hasPermission(userRole, PERMISSIONS.FINANZAS.EXPORT),
    
    // Configuración
    canViewConfiguracion: hasPermission(userRole, PERMISSIONS.CONFIGURACION.VIEW),
    canEditConfiguracion: hasPermission(userRole, PERMISSIONS.CONFIGURACION.EDIT),
    
    // Dashboard
    canAccessDashboard: hasPermission(userRole, PERMISSIONS.DASHBOARD.ACCESS),
    
    // Formularios
    canViewFormularios: hasPermission(userRole, PERMISSIONS.FORMULARIOS.VIEW),
    canCreateFormularios: hasPermission(userRole, PERMISSIONS.FORMULARIOS.CREATE),
    canManageFormularios: hasPermission(userRole, PERMISSIONS.FORMULARIOS.MANAGE),
    
    // Aseo
    canViewAseo: hasPermission(userRole, PERMISSIONS.ASEO.VIEW),
    canManageAseo: hasPermission(userRole, PERMISSIONS.ASEO.MANAGE),
  }
}

/**
 * Función para verificar permisos específicos por categoría
 * @param userRole - Rol del usuario
 * @param category - Categoría del permiso (ej: 'RESERVAS', 'HUESPEDES')
 * @param action - Acción específica (ej: 'VIEW', 'CREATE', 'DELETE')
 * @returns true si tiene permiso, false en caso contrario
 */
export function hasSpecificPermission(
  userRole: RoleType | undefined, 
  category: keyof typeof PERMISSIONS,
  action: string
): boolean {
  const categoryPermissions = PERMISSIONS[category] as Record<string, readonly RoleType[]>
  const permission = categoryPermissions[action]
  
  if (!permission) return false
  return hasPermission(userRole, permission)
} 