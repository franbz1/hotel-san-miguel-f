import { COOKIE_EXPIRATION_DAYS } from '@/lib/common/constants/constants'
import Cookies from "js-cookie"

// Nombres de las cookies
export const COOKIE_NAMES = {
  TOKEN: 'auth_token',
  USER_ID: 'user_id',
  USER_NAME: 'user_name',
  USER_ROLE: 'user_role',
}

/**
 * Establece una cookie con el nombre, valor y tiempo de expiración especificados
 */
export function setCookie(name: string, value: string, days: number = COOKIE_EXPIRATION_DAYS, options?: Cookies.CookieAttributes): void {
  Cookies.set(name, value, { expires: days, ...options })
}

/**
 * Obtiene el valor de una cookie por su nombre
 */
export function getCookie(name: string): string | null {
  return Cookies.get(name) || null
}

/**
 * Elimina una cookie por su nombre
 */
export function deleteCookie(name: string): void {
  Cookies.remove(name)
}

/**
 * Guarda la información de autenticación en cookies
 */
export function saveAuthCookies(
  token: string,
  userId: string,
  username: string,
  role: string,
  rememberMe: boolean = false
) {
  const expirationDays = rememberMe ? COOKIE_EXPIRATION_DAYS : 1

  const options = {
    secure: true,
    sameSite: 'None' as const
  }

  setCookie(COOKIE_NAMES.TOKEN, token, expirationDays, options)
  setCookie(COOKIE_NAMES.USER_ID, userId, expirationDays)
  setCookie(COOKIE_NAMES.USER_NAME, username, expirationDays)
  setCookie(COOKIE_NAMES.USER_ROLE, role, expirationDays)
}

/**
 * Elimina todas las cookies de autenticación
 */
export function removeAuthCookies() {
  deleteCookie(COOKIE_NAMES.TOKEN)
  deleteCookie(COOKIE_NAMES.USER_ID)
  deleteCookie(COOKIE_NAMES.USER_NAME)
  deleteCookie(COOKIE_NAMES.USER_ROLE)
}

/**
 * Verifica si el usuario está autenticado
 */
export function isAuthenticated(): boolean {
  return !!getCookie(COOKIE_NAMES.TOKEN)
}

/**
 * Obtiene el rol del usuario actual
 */
export function getUserRole(): string | null {
  return getCookie(COOKIE_NAMES.USER_ROLE)
} 