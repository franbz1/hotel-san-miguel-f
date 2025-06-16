"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { usePermissions } from "@/hooks/usePermissions"
import { Loader2 } from "lucide-react"
import { ROLE_ROUTES, DEFAULT_ROUTE } from "@/lib/common/constants/constants"

interface DashboardGuardProps {
  children: React.ReactNode
}

export function DashboardGuard({ children }: DashboardGuardProps) {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const { userRole, canAccessDashboard } = usePermissions()

  useEffect(() => {
    if (isLoading) {
      return
    }

    const checkAuthStatus = () => {
      if (!user) {
        router.push('/login')
        return
      }

      // Verificar si el usuario tiene acceso al dashboard (solo ADMINISTRADOR y CAJERO)
      if (!canAccessDashboard) {
        const redirectPath = ROLE_ROUTES[userRole!] || DEFAULT_ROUTE
        router.push(redirectPath)
        return
      }
    }

    checkAuthStatus()
  }, [isLoading, user, canAccessDashboard, userRole, router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (user && canAccessDashboard) {
    return <>{children}</>
  }

  return null
} 