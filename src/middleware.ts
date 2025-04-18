import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { COOKIE_NAMES } from './lib/cookies'
import { getValidatedUser } from './lib/auth-service'
import { Role, ROLE_ROUTES, DEFAULT_ROUTE } from './lib/constants'
import { validateLinkFormulario } from './lib/link-formulario-service'

// Rutas públicas que no requieren autenticación
const publicRoutes = ['/login', '/register', '/forgot-password']

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Permitir acceso a rutas públicas
  if (publicRoutes.includes(path)) {
    return NextResponse.next()
  }

  // Verificar si es una ruta de registro de formulario
  if (path.startsWith('/registro-formulario/')) {
    const token = path.split('/').pop()
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      return NextResponse.next()
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Verificar token para rutas protegidas
  const token = request.cookies.get(COOKIE_NAMES.TOKEN)?.value
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    // Validar token y obtener información del usuario
    const user = await getValidatedUser(token)
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    // Verificar acceso a rutas según rol
    const userRole = user.rol as keyof typeof Role
    const defaultRoute = ROLE_ROUTES[userRole] || DEFAULT_ROUTE
    
    // Si la ruta actual no coincide con la ruta por defecto del rol, redirigir
    if (!path.startsWith(defaultRoute)) {
      return NextResponse.redirect(new URL(defaultRoute, request.url))
    }
    
    return NextResponse.next()
  } catch (error) {
    console.error('Error in middleware:', error)
    return NextResponse.redirect(new URL('/login', request.url))
  }
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