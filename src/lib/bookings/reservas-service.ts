import { Reserva } from "@/Types/Reserva"
import { COOKIE_NAMES } from "@/lib/common/cookies"
import { getCookie } from "@/lib/common/cookies"
import { RESERVA_ENDPOINTS } from "@/lib/common/api"

export interface ReservasResponse {
  data: Reserva[]
  meta: {
    page: number
    limit: number
    totalReservas: number
    lastPage: number
  }
}
export async function getReservas(page: number = 1, limit: number = 6): Promise<ReservasResponse> {
  const token = getCookie(COOKIE_NAMES.TOKEN)

  if (!token) {
    throw new Error('No hay token de autenticación')
  }

  const response = await fetch(RESERVA_ENDPOINTS.GET_ALL(limit, page), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Error al obtener las reservas')
  }

  return response.json()
}

export async function getReservaById(id: number): Promise<Reserva> {
  const token = getCookie(COOKIE_NAMES.TOKEN)

  if (!token) {
    throw new Error('No hay token de autenticación')
  }

  const response = await fetch(RESERVA_ENDPOINTS.GET_BY_ID(id), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const errorData = await response.json()
    console.log(errorData)
    throw new Error('Error al obtener la reserva')
  }

  return response.json()
}

export async function deleteReserva(id: number): Promise<Reserva> {
  const token = getCookie(COOKIE_NAMES.TOKEN)

  if (!token) {
    throw new Error('No hay token de autenticación')
  }

  const response = await fetch(RESERVA_ENDPOINTS.DELETE(id), {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Error al eliminar la reserva')
  }

  return response.json()
}
