import { Huesped } from "@/Types/huesped"
import { COOKIE_NAMES } from "@/lib/common/cookies"
import { getCookie } from "@/lib/common/cookies"
import { HUESPED_ENDPOINTS } from "@/lib/common/api"

export interface HuespedesResponse {
  data: Huesped[]
  meta: {
    page: number
    limit: number
    totalHuespedes: number
  }
}

export async function getHuespedes(page: number = 1, limit: number = 6): Promise<HuespedesResponse> {
  const token = getCookie(COOKIE_NAMES.TOKEN)

  if (!token) {
    throw new Error('No hay token de autenticación')
  }

  const response = await fetch(HUESPED_ENDPOINTS.GET_ALL(limit, page), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Error al obtener los huespedes')
  }

  return response.json()
}

export async function getHuespedByDocument(document: string): Promise<Huesped> {
  const token = getCookie(COOKIE_NAMES.TOKEN)

  if (!token) {
    throw new Error('No hay token de autenticación')
  }

  const response = await fetch(HUESPED_ENDPOINTS.GET_BY_DOCUMENT(document), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Error al obtener el huesped')
  }

  return response.json()
}

export async function getHuespedById(id: number): Promise<Huesped> {
  const token = getCookie(COOKIE_NAMES.TOKEN)

  if (!token) {
    throw new Error('No hay token de autenticación')
  }

  const response = await fetch(HUESPED_ENDPOINTS.GET_BY_ID(id), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Error al obtener el huesped')
  }

  return response.json()
}
