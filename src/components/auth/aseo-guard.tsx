"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { usePermissions } from "@/hooks/usePermissions"
import { Loader2 } from "lucide-react"
import { ROLE_ROUTES, DEFAULT_ROUTE } from "@/lib/common/constants/constants"

interface AseoGuardProps {
  children: React.ReactNode
}

export function AseoGuard({ children }: AseoGuardProps) {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const { userRole, canAccessAseo } = usePermissions()

  useEffect(() => {
    if (isLoading) {
      return
    }

    const checkAuthStatus = () => {
      if (!user) {
        router.push('/login')
        return
      }

      // Verificar si el usuario tiene acceso al módulo de aseo (solo ADMINISTRADOR y ASEO)
      if (!canAccessAseo) {
        const redirectPath = ROLE_ROUTES[userRole!] || DEFAULT_ROUTE
        router.push(redirectPath)
        return
      }
    }

    checkAuthStatus()
  }, [isLoading, user, canAccessAseo, userRole, router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Verificando permisos de aseo...</p>
        </div>
      </div>
    )
  }

  if (user && canAccessAseo) {
    return <>{children}</>
  }

  return null
} 