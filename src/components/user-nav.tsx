"use client"

import { LogOut, LayoutDashboard, CalendarDays, BedDouble, Settings, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function UserNav() {
  const { user, logout } = useAuth()
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
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.nombre}</p>
            <p className="text-xs leading-none text-muted-foreground capitalize">{user?.rol?.toLowerCase()}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/dashboard">
            <DropdownMenuItem className={isActive("/dashboard") ? "bg-muted cursor-default" : "cursor-pointer"}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/dashboard/rooms">
            <DropdownMenuItem className={isActive("/dashboard/rooms") ? "bg-muted cursor-default" : "cursor-pointer"}>
              <BedDouble className="mr-2 h-4 w-4" />
              <span>Habitaciones</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/dashboard/reservas">
            <DropdownMenuItem className={isActive("/dashboard/reservas") ? "bg-muted cursor-default" : "cursor-pointer"}>
              <CalendarDays className="mr-2 h-4 w-4" />
              <span>Reservas</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <Link href="/settings">
          <DropdownMenuItem className={isActive("/settings") ? "bg-muted cursor-default" : "cursor-pointer"}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Ajustes</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 