import { REGISTRO_FORMULARIO_ENDPOINTS } from '@/lib/common/api'
import { CreateRegistroFormulario } from '@/Types/registro-formularioDto'

// Keys para React Query
export const REGISTRO_FORMULARIO_KEYS = {
  all: ['registro-formulario'] as const,
};

/**
 * Función para crear un nuevo registro de formulario
 */
export const createRegistroFormulario = async (params: { token: string; data: CreateRegistroFormulario }) => {
  const { token, data } = params;
  
  try {
    const response = await fetch(REGISTRO_FORMULARIO_ENDPOINTS.CREATE(token), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      // Intentar extraer el mensaje de error del servidor
      let errorMessage: string;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || `Error ${response.status}: ${response.statusText}`;
      } catch {
        // Si no se puede parsear la respuesta, usar error genérico
        errorMessage = `Error al crear registro: ${response.status} ${response.statusText}`;
      }
      
      throw new Error(errorMessage);
    }

    return await response.json()
  } catch (error) {
    console.error('Error en createRegistroFormulario:', error)
    throw error
  }
}
