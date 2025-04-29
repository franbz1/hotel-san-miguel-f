"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"
import { Role, ROLE_ROUTES, DEFAULT_ROUTE, RoleType } from "@/lib/common/constants/constants"

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
    if (isLoading) {
      return;
    }

    const checkAuthStatus = () => {
      if (!user) {
        router.push('/login');
        return;
      }

      if (!hasDashboardAccess(user.rol)) {
        const userRole = user.rol as keyof typeof Role;
        const redirectPath = ROLE_ROUTES[userRole] || DEFAULT_ROUTE;
        router.push(redirectPath);
      }
    };

    checkAuthStatus();
  }, [isLoading, user, router]);


  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user && hasDashboardAccess(user.rol)) {
    return <>{children}</>;
  }

  return null;
} 