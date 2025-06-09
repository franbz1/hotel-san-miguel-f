"use client"

import React from 'react'
import { usePermissions } from '@/hooks/usePermissions'
import { RoleType } from '@/lib/common/constants/constants'
import { PERMISSIONS } from '@/lib/permissions/permissions-config'

interface PermissionGuardProps {
  /**
   * Contenido a mostrar si el usuario tiene permisos
   */
  children: React.ReactNode
  
  /**
   * Roles específicos permitidos (opcional)
   * Si se proporciona, verificará si el usuario tiene uno de estos roles
   */
  allowedRoles?: RoleType[]
  
  /**
   * Verificación por categoría y acción específica (opcional)
   * Alternativa a allowedRoles para verificar permisos más granulares
   */
  permission?: {
    category: keyof typeof PERMISSIONS
    action: string
  }
  
  /**
   * Contenido a mostrar si el usuario NO tiene permisos (opcional)
   * Si no se proporciona, no se muestra nada
   */
  fallback?: React.ReactNode
  
  /**
   * Si es true, se invierte la lógica (muestra el contenido si NO tiene permisos)
   * Útil para mostrar mensajes de "no autorizado"
   */
  inverse?: boolean
  
  /**
   * Función personalizada de verificación de permisos (opcional)
   * Recibe el hook usePermissions como parámetro
   */
  customCheck?: (permissions: ReturnType<typeof usePermissions>) => boolean
}

/**
 * Componente guard que muestra contenido basado en permisos de usuario
 * 
 * Ejemplos de uso:
 * 
 * 1. Por roles específicos:
 * <PermissionGuard allowedRoles={['ADMINISTRADOR', 'CAJERO']}>
 *   <AdminPanel />
 * </PermissionGuard>
 * 
 * 2. Por categoría y acción:
 * <PermissionGuard permission={{ category: 'RESERVAS', action: 'DELETE' }}>
 *   <DeleteButton />
 * </PermissionGuard>
 * 
 * 3. Con fallback:
 * <PermissionGuard allowedRoles={['ADMINISTRADOR']} fallback={<div>No autorizado</div>}>
 *   <AdminFeature />
 * </PermissionGuard>
 * 
 * 4. Con verificación personalizada:
 * <PermissionGuard customCheck={(perms) => perms.isAdmin() && perms.canExport}>
 *   <ExportButton />
 * </PermissionGuard>
 */
export function PermissionGuard({
  children,
  allowedRoles,
  permission,
  fallback = null,
  inverse = false,
  customCheck
}: PermissionGuardProps) {
  const permissions = usePermissions()
  
  let hasAccess = false
  
  // Verificación personalizada tiene prioridad
  if (customCheck) {
    hasAccess = customCheck(permissions)
  }
  // Verificación por categoría y acción específica
  else if (permission) {
    hasAccess = permissions.checkPermission(permission.category, permission.action)
  }
  // Verificación por roles
  else if (allowedRoles) {
    hasAccess = permissions.hasAnyRole(allowedRoles)
  }
  // Si no se especifica ninguna verificación, denegar acceso por defecto
  else {
    hasAccess = false
  }
  
  // Aplicar lógica inversa si está habilitada
  if (inverse) {
    hasAccess = !hasAccess
  }
  
  // Mostrar contenido si tiene acceso, fallback en caso contrario
  return hasAccess ? <>{children}</> : <>{fallback}</>
}

/**
 * Componente especializado para mostrar contenido solo a administradores
 */
export function AdminOnly({ 
  children, 
  fallback = null 
}: { 
  children: React.ReactNode
  fallback?: React.ReactNode 
}) {
  return (
    <PermissionGuard allowedRoles={['ADMINISTRADOR']} fallback={fallback}>
      {children}
    </PermissionGuard>
  )
}

/**
 * Componente especializado para mostrar contenido a administradores y cajeros
 */
export function StaffOnly({ 
  children, 
  fallback = null 
}: { 
  children: React.ReactNode
  fallback?: React.ReactNode 
}) {
  return (
    <PermissionGuard allowedRoles={['ADMINISTRADOR', 'CAJERO']} fallback={fallback}>
      {children}
    </PermissionGuard>
  )
}

/**
 * Componente especializado para mostrar contenido relacionado con funciones de eliminación
 */
export function DeletePermission({ 
  children, 
  fallback = null 
}: { 
  children: React.ReactNode
  fallback?: React.ReactNode 
}) {
  return (
    <PermissionGuard allowedRoles={['ADMINISTRADOR']} fallback={fallback}>
      {children}
    </PermissionGuard>
  )
}

/**
 * Componente especializado para mostrar contenido relacionado con exportaciones
 */
export function ExportPermission({ 
  children, 
  fallback = null 
}: { 
  children: React.ReactNode
  fallback?: React.ReactNode 
}) {
  return (
    <PermissionGuard 
      customCheck={(perms) => perms.canExport}
      fallback={fallback}
    >
      {children}
    </PermissionGuard>
  )
}

/**
 * HOC para envolver componentes con verificación de permisos
 * @param Component - Componente a envolver
 * @param guardProps - Props del PermissionGuard
 * @returns Componente envuelto con verificación de permisos
 */
export function withPermissions<T extends object>(
  Component: React.ComponentType<T>,
  guardProps: Omit<PermissionGuardProps, 'children'>
) {
  return function WrappedComponent(props: T) {
    return (
      <PermissionGuard {...guardProps}>
        <Component {...props} />
      </PermissionGuard>
    )
  }
}

export default PermissionGuard 