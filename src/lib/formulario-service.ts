import { Formulario } from "@/Types/formulario"
import { getCookie } from "./cookies"
import { COOKIE_NAMES } from "./cookies"
import { FORMULARIO_ENDPOINTS } from "./api"

export interface FormulariosResponse {
  data: Formulario[]
  meta: {
    page: number
    limit: number
    totalFormularios: number
  }
}

export async function getFormularios(page: number = 1, limit: number = 6): Promise<FormulariosResponse> {
  const token = getCookie(COOKIE_NAMES.TOKEN)

  if (!token) {
    throw new Error('No hay token de autenticación')
  }

  const response = await fetch(FORMULARIO_ENDPOINTS.GET_ALL(limit, page), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Error al obtener los formularios')
  }

  return response.json()
}


