import { Formulario } from "@/Types/formulario"
import { getCookie } from "@/lib/common/cookies"
import { COOKIE_NAMES } from "@/lib/common/cookies"
import { FORMULARIO_ENDPOINTS } from "@/lib/common/api"

export interface FormulariosResponse {
  data: Formulario[]
  meta: {
    page: number
    limit: number
    totalFormularios: number
  }
}

// Keys para React Query
export const FORMULARIO_KEYS = {
  all: ['formularios'] as const,
  lists: () => [...FORMULARIO_KEYS.all, 'list'] as const,
  list: (page: number, limit: number) => [...FORMULARIO_KEYS.lists(), { page, limit }] as const,
  details: () => [...FORMULARIO_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...FORMULARIO_KEYS.details(), id] as const,
};

// Función para obtener formularios paginados
export const fetchFormularios = async (page: number = 1, limit: number = 6): Promise<FormulariosResponse> => {
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

// Función para obtener formulario por ID
export const fetchFormularioById = async (id: number): Promise<Formulario> => {
  const token = getCookie(COOKIE_NAMES.TOKEN)

  if (!token) {
    throw new Error('No hay token de autenticación')
  }

  const response = await fetch(FORMULARIO_ENDPOINTS.GET_BY_ID(id), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Error al obtener el formulario')
  }

  return response.json()
}

// Funciones legacy para compatibilidad (opcional, se pueden eliminar después de migrar todos los usos)
export async function getFormularios(page: number = 1, limit: number = 6): Promise<FormulariosResponse> {
  return fetchFormularios(page, limit);
}

export async function getFormularioById(id: number): Promise<Formulario> {
  return fetchFormularioById(id);
}
