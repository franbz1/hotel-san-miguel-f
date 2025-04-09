import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ROLE_ROUTES } from './lib/constants'

// Rutas públicas que no requieren autenticación
const PUBLIC_ROUTES = ['/login', '/forgot-password', '/reset-password']

// Rutas que requieren autenticación pero no un rol específico
const AUTH_ROUTES = ['/dashboard']

// Mapeo de rutas a roles permitidos
const ROLE_PERMISSIONS: Record<string, string[]> = {
  '/dashboard/admin': ['ADMINISTRADOR'],
  '/dashboard/cajero': ['CAJERO', 'ADMINISTRADOR'],
  '/dashboard/aseo': ['ASEO', 'ADMINISTRADOR'],
  '/dashboard/registro': ['REGISTRO_FORMULARIO', 'ADMINISTRADOR'],
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Permitir rutas públicas
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }
  
  // Verificar si el usuario está autenticado
  const token = request.cookies.get('auth_token')
  const userRole = request.cookies.get('user_role')
  
  // Si no hay token, redirigir al login
  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // Si es una ruta de autenticación general, permitir acceso
  if (AUTH_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }
  
  // Verificar permisos según el rol
  const allowedRoles = ROLE_PERMISSIONS[pathname]
  
  // Si la ruta no tiene permisos específicos, permitir acceso
  if (!allowedRoles) {
    return NextResponse.next()
  }
  
  // Si el usuario no tiene el rol requerido, redirigir a su dashboard
  if (!userRole || !allowedRoles.includes(userRole.value)) {
    const defaultRoute = ROLE_ROUTES[userRole?.value || ''] || ROLE_ROUTES.DEFAULT
    return NextResponse.redirect(new URL(defaultRoute, request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 