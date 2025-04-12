interface ValidationResponse {
  isValid: boolean
  user?: {
    id: number
    nombre: string
    rol: string
  }
  error?: string
}

/**
 * Valida el token de autenticación con el servidor
 */
export async function validateToken(token: string): Promise<ValidationResponse> {
  if (!token) {
    return { isValid: false, error: 'No token found' }
  }

  try {
    const response = await fetch('http://localhost:3001/auth/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      return { 
        isValid: false, 
        error: response.status === 401 ? 'Token inválido o expirado' : 'Error de validación' 
      }
    }

    const data = await response.json()
    return { 
      isValid: true,
      user: {
        id: data.usuarioId,
        nombre: data.nombre,
        rol: data.rol
      }
    }
  } catch (error) {
    console.error('Error validating token:', error)
    return { 
      isValid: false, 
      error: 'Error de conexión al validar el token' 
    }
  }
}

/**
 * Verifica si el token es válido y está activo
 */
export async function isTokenValid(token: string): Promise<boolean> {
  const { isValid } = await validateToken(token)
  return isValid
}

/**
 * Obtiene la información del usuario si el token es válido
 */
export async function getValidatedUser(token: string) {
  const { user, error } = await validateToken(token)
  if (error) {
    throw new Error(error)
  }
  return user
} 