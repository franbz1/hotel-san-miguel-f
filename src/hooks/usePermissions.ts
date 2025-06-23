"use client"

import { useAuth } from '@/contexts/auth-context'
import { getRolePermissions, hasSpecificPermission, PERMISSIONS } from '@/lib/permissions/permissions-config'
import { RoleType, DASHBOARD_ACCESS_ROLES, ASEO_ACCESS_ROLES } from '@/lib/common/constants/constants'

/**
 * Hook personalizado para manejar permisos de usuario
 * Proporciona una interfaz simple para verificar permisos en componentes
 */
export function usePermissions() {
  const { user } = useAuth()
  const userRole = user?.rol as RoleType | undefined
  
  // Obtener todos los permisos del rol actual
  const permissions = getRolePermissions(userRole)
  
  /**
   * Verifica si el usuario tiene un permiso específico
   * @param category - Categoría del permiso (ej: 'RESERVAS', 'HUESPEDES')
   * @param action - Acción específica (ej: 'VIEW', 'CREATE', 'DELETE')
   * @returns true si tiene permiso, false en caso contrario
   */
  const checkPermission = (category: keyof typeof PERMISSIONS, action: string): boolean => {
    return hasSpecificPermission(userRole, category, action)
  }
  
  /**
   * Verifica si el usuario tiene al menos uno de los roles especificados
   * @param allowedRoles - Array de roles permitidos
   * @returns true si el usuario tiene uno de los roles, false en caso contrario
   */
  const hasAnyRole = (allowedRoles: RoleType[]): boolean => {
    if (!userRole) return false
    return allowedRoles.includes(userRole)
  }
  
  /**
   * Verifica si el usuario es administrador
   * @returns true si es administrador, false en caso contrario
   */
  const isAdmin = (): boolean => {
    return userRole === 'ADMINISTRADOR'
  }
  
  /**
   * Verifica si el usuario es cajero
   * @returns true si es cajero, false en caso contrario
   */
  const isCajero = (): boolean => {
    return userRole === 'CAJERO'
  }
  
  /**
   * Verifica si el usuario es personal de aseo
   * @returns true si es personal de aseo, false en caso contrario
   */
  const isAseo = (): boolean => {
    return userRole === 'ASEO'
  }
  
  /**
   * Verifica si el usuario es de registro de formulario
   * @returns true si es de registro de formulario, false en caso contrario
   */
  const isRegistroFormulario = (): boolean => {
    return userRole === 'REGISTRO_FORMULARIO'
  }
  
  return {
    // Información del usuario
    user,
    userRole,
    
    // Funciones de verificación de roles
    isAdmin,
    isCajero,
    isAseo,
    isRegistroFormulario,
    hasAnyRole,
    
    // Función para verificar permisos específicos
    checkPermission,
    
    // Todos los permisos como propiedades booleanas
    ...permissions,
    
    // Aliases para permisos más utilizados (para facilidad de uso)
    canDelete: permissions.canDeleteReservas || permissions.canDeleteHuespedes,
    canExport: permissions.canExportReservas || permissions.canExportHuespedes || permissions.canExportAnalytics,
    canManage: isAdmin(),
    hasFullAccess: isAdmin(),
    
    // Permisos de navegación
    canAccessAnalytics: permissions.canViewAnalytics,
    canAccessUserManagement: permissions.canViewUsuarios,
    canAccessFinances: permissions.canViewFinanzas,
    canAccessConfiguration: permissions.canViewConfiguracion,
    canAccessDashboard: userRole ? DASHBOARD_ACCESS_ROLES.includes(userRole) : false,
    canAccessAseo: userRole ? ASEO_ACCESS_ROLES.includes(userRole) : false,
  }
}

/**
 * Tipo que define la estructura de retorno del hook usePermissions
 * Útil para TypeScript y documentación
 */
export type PermissionsType = ReturnType<typeof usePermissions> 