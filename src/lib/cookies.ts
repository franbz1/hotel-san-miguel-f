import { COOKIE_EXPIRATION_DAYS } from './constants'

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
  const cookieName = `${name}=`
  const cookies = document.cookie.split(';')
  
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim()
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length, cookie.length)
    }
  }
  
  return null
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
export function saveAuthCookies(token: string, userId: number, userName: string, userRole: string): void {
  setCookie(COOKIE_NAMES.TOKEN, token)
  setCookie(COOKIE_NAMES.USER_ID, userId.toString())
  setCookie(COOKIE_NAMES.USER_NAME, userName)
  setCookie(COOKIE_NAMES.USER_ROLE, userRole)
}

/**
 * Elimina todas las cookies de autenticación
 */
export function clearAuthCookies(): void {
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