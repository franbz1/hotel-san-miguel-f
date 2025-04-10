import { COOKIE_EXPIRATION_DAYS } from './constants'
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
export function setCookie(name: string, value: string, days: number = COOKIE_EXPIRATION_DAYS): void {
  const date = new Date()
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
  const expires = `expires=${date.toUTCString()}`
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict`
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
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
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

  Cookies.set("auth_token", token, { expires: expirationDays })
  Cookies.set("user_id", userId, { expires: expirationDays })
  Cookies.set("user_name", username, { expires: expirationDays })
  Cookies.set("user_role", role, { expires: expirationDays })
}

/**
 * Elimina todas las cookies de autenticación
 */
export function removeAuthCookies() {
  Cookies.remove("auth_token")
  Cookies.remove("user_id")
  Cookies.remove("user_name")
  Cookies.remove("user_role")
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