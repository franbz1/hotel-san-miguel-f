"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { DASHBOARD_ACCESS_ROLES, Role, RoleType } from "@/lib/constants"
import { Loader2 } from "lucide-react"

interface DashboardGuardProps {
  children: React.ReactNode
}

export function DashboardGuard({ children }: DashboardGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  // Función auxiliar para verificar si el rol tiene acceso al dashboard
  const hasDashboardAccess = (rol: string | undefined): boolean => {
    if (!rol) return false
    return DASHBOARD_ACCESS_ROLES.includes(rol as RoleType)
  }

  useEffect(() => {
    // Si no está cargando y no está autenticado, redirigir al login
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
      return
    }

    // Si está autenticado pero no tiene un rol con acceso al dashboard, redirigir a su ruta específica
    if (isAuthenticated && user && !hasDashboardAccess(user.rol)) {
      // Redirigir según el rol
      switch (user.rol) {
        case Role.ASEO:
          router.push("/dashboard/aseo")
          break
        case Role.REGISTRO_FORMULARIO:
          router.push("/dashboard/registro")
          break
        default:
          router.push("/login")
      }
    }
  }, [isLoading, isAuthenticated, user, router])

  // Mostrar un indicador de carga mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Si no está autenticado o no tiene acceso, no renderizar nada (la redirección se maneja en el useEffect)
  if (!isAuthenticated || !user || !hasDashboardAccess(user.rol)) {
    return null
  }

  // Si está autenticado y tiene acceso, renderizar el contenido
  return <>{children}</>
} 