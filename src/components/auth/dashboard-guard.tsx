"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"
import { Role, ROLE_ROUTES, DEFAULT_ROUTE, RoleType } from "@/lib/constants"

interface DashboardGuardProps {
  children: React.ReactNode
}

export function DashboardGuard({ children }: DashboardGuardProps) {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  // Función auxiliar para verificar si el rol tiene acceso al dashboard
  const hasDashboardAccess = (rol: string | undefined): boolean => {
    if (!rol) return false
    return Object.values(Role).includes(rol as RoleType)
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!user) {
          router.push('/login')
          return
        }
        
        // Si está autenticado pero no tiene un rol con acceso al dashboard, redirigir a su ruta específica
        if (!hasDashboardAccess(user.rol)) {
          // Redirigir según el rol
          const userRole = user.rol as keyof typeof Role
          const redirectPath = ROLE_ROUTES[userRole] || DEFAULT_ROUTE
          router.push(redirectPath)
        }
      } catch (error) {
        console.error('Error validating auth:', error)
        router.push('/login')
      }
    }

    checkAuth()
  }, [router, user])

  // Mostrar un indicador de carga mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Si no está autenticado o no tiene acceso, no renderizar nada (la redirección se maneja en el useEffect)
  if (!user || !hasDashboardAccess(user.rol)) {
    return null
  }

  // Si está autenticado y tiene acceso, renderizar el contenido
  return <>{children}</>
} 