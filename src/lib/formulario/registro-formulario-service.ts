import { REGISTRO_FORMULARIO_ENDPOINTS } from '@/lib/common/api'
import { CreateRegistroFormulario } from '@/Types/registro-formularioDto'

// Keys para React Query
export const REGISTRO_FORMULARIO_KEYS = {
  all: ['registro-formulario'] as const,
  creates: () => [...REGISTRO_FORMULARIO_KEYS.all, 'create'] as const,
};

/**
 * Función para crear un nuevo registro de formulario
 */
export const createRegistroFormularioFn = async (params: { token: string; data: CreateRegistroFormulario }) => {
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
      console.log(await response.json())
      throw new Error(`Error al crear registro: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error en createRegistroFormulario:', error)
    throw error
  }
}

/**
 * Función legacy para compatibilidad (opcional, se puede eliminar después de migrar todos los usos)
 */
export async function createRegistroFormulario(token: string, data: CreateRegistroFormulario) {
  return createRegistroFormularioFn({ token, data });
}
