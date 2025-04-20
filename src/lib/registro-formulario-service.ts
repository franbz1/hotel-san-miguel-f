import { REGISTRO_FORMULARIO_ENDPOINTS } from './api'
import { CreateRegistroFormulario } from '@/Types/registro-formularioDto'

/**
 * Crea un nuevo registro de formulario
 */
export async function createRegistroFormulario(token: string, data: CreateRegistroFormulario) {
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
