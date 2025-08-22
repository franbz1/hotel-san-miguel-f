"use client"

import { LogOut, LayoutDashboard, CalendarDays, Settings, Menu, ChartBar, Users, Bed, ClipboardList, SoapDispenserDroplet, Building, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import { usePermissions } from "@/hooks/usePermissions"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useIsMobile } from "@/hooks/useIsMobile"

// Componente para elementos de menú con Link
interface MenuItemProps {
  href: string
  icon: React.ReactNode
  label: string
  isActive: boolean
}

function MenuItem({ href, icon, label, isActive }: MenuItemProps) {
  return (
    <Link href={href}>
      <DropdownMenuItem className={isActive ? "bg-muted cursor-default" : "cursor-pointer"}>
        {icon}
        <span>{label}</span>
      </DropdownMenuItem>
    </Link>
  )
}

// Componente para el perfil del usuario
interface UserProfileProps {
  user: {
    nombre?: string
    rol?: string
  } | null
}

function UserProfile({ user }: UserProfileProps) {
  return (
    <DropdownMenuLabel className="font-normal">
      <div className="flex flex-col space-y-1">
        <p className="text-sm font-medium leading-none">{user?.nombre}</p>
        <p className="text-xs leading-none text-muted-foreground capitalize">
          {user?.rol?.toLowerCase()}
        </p>
      </div>
    </DropdownMenuLabel>
  )
}

// Componente para la sección principal del dashboard
interface DashboardSectionProps {
  canAccessDashboard: boolean
  canViewAnalytics: boolean
  canViewReservas: boolean
  canViewHuespedes: boolean
  isActive: (path: string) => boolean
}

function DashboardSection({ canAccessDashboard, canViewAnalytics, canViewReservas, canViewHuespedes, isActive }: DashboardSectionProps) {
  if (!canAccessDashboard && !canViewAnalytics && !canViewReservas && !canViewHuespedes) return null

  return (
    <DropdownMenuGroup>
      {canAccessDashboard && (
        <MenuItem
          href="/dashboard"
          icon={<LayoutDashboard className="mr-2 h-4 w-4" />}
          label="Dashboard Principal"
          isActive={isActive("/dashboard")}
        />
      )}
      {canViewAnalytics && (
        <MenuItem
          href="/dashboard/analytics"
          icon={<ChartBar className="mr-2 h-4 w-4" />}
          label="Analíticas"
          isActive={isActive("/dashboard/analytics")}
        />
      )}
      {canViewReservas && (
        <MenuItem
          href="/dashboard/reservas"
          icon={<CalendarDays className="mr-2 h-4 w-4" />}
          label="Reservas"
          isActive={isActive("/dashboard/reservas")}
        />
      )}
      {canViewHuespedes && (
        <MenuItem
          href="/dashboard/huespedes"
          icon={<Users className="mr-2 h-4 w-4" />}
          label="Huéspedes"
          isActive={isActive("/dashboard/huespedes")}
        />
      )}
    </DropdownMenuGroup>
  )
}

// Componente para la sección de aseo con submenú
interface AseoSectionProps {
  canViewAseo: boolean
  isActive: (path: string) => boolean
}

function AseoSection({ canViewAseo, isActive }: AseoSectionProps) {
  const isMobile = useIsMobile()

  if (!canViewAseo) return null


  return (
    <>
      <DropdownMenuSeparator />
      <DropdownMenuSub>
        <DropdownMenuSubTrigger className="cursor-pointer">
          <SoapDispenserDroplet className="mr-2 h-4 w-4" />
          <span>Gestión de Aseo</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent className={`
            ${isMobile ? "w-full left-0 right-0 max-w-[calc(100vw-1rem)]" : "w-56"}
            overflow-auto max-h-[70vh]
          `}>
          <MenuItem
            href="/aseo"
            icon={<SoapDispenserDroplet className="mr-2 h-4 w-4" />}
            label="Panel Principal"
            isActive={isActive("/aseo")}
          />
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wide">
            Habitaciones
          </DropdownMenuLabel>
          <MenuItem
            href="/aseo/habitaciones"
            icon={<Bed className="mr-2 h-4 w-4" />}
            label="Gestión Habitaciones"
            isActive={isActive("/aseo/habitaciones")}
          />
          <MenuItem
            href="/aseo/habitaciones/registros"
            icon={<ClipboardList className="mr-2 h-4 w-4" />}
            label="Registros"
            isActive={isActive("/aseo/habitaciones/registros")}
          />
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wide">
            Zonas Comunes
          </DropdownMenuLabel>
          <MenuItem
            href="/aseo/zonas-comunes"
            icon={<Building className="mr-2 h-4 w-4" />}
            label="Gestión Zonas"
            isActive={isActive("/aseo/zonas-comunes")}
          />
          <MenuItem
            href="/aseo/zonas-comunes/registros"
            icon={<ClipboardList className="mr-2 h-4 w-4" />}
            label="Registros"
            isActive={isActive("/aseo/zonas-comunes/registros")}
          />
          <DropdownMenuSeparator />
          <MenuItem
            href="/aseo/reportes"
            icon={<FileText className="mr-2 h-4 w-4" />}
            label="Reportes y Análisis"
            isActive={isActive("/aseo/reportes")}
          />
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    </>
  )
}

// Componente para la sección de configuraciones
interface ConfigSectionProps {
  isAdmin: () => boolean
  isActive: (path: string) => boolean
}

function ConfigSection({ isAdmin, isActive }: ConfigSectionProps) {
  if (!isAdmin()) return null

  return (
    <>
      <DropdownMenuSeparator />
      <MenuItem
        href="/dashboard/configuraciones"
        icon={<Settings className="mr-2 h-4 w-4" />}
        label="Configuraciones"
        isActive={isActive("/dashboard/configuraciones")}
      />
    </>
  )
}

export function UserNav() {
  const { user, logout } = useAuth()
  const { canViewAnalytics, isAdmin, canAccessDashboard, canViewReservas, canViewHuespedes, canViewAseo } = usePermissions()
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  const handleLogout = async () => {
    await logout()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="cursor-pointer" variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menú principal</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <UserProfile user={user} />
        <DropdownMenuSeparator />

        <DashboardSection
          canAccessDashboard={canAccessDashboard}
          canViewAnalytics={canViewAnalytics}
          canViewReservas={canViewReservas}
          canViewHuespedes={canViewHuespedes}
          isActive={isActive}
        />

        <AseoSection canViewAseo={canViewAseo} isActive={isActive} />

        <ConfigSection isAdmin={isAdmin} isActive={isActive} />

        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 