import { Habitacion } from '@/Types/habitacion'
import { HABITACION_ENDPOINTS } from './api'
import { COOKIE_NAMES, getCookie } from './cookies'
import { TipoHabitacion } from '@/Types/enums/tiposHabitacion'
import { EstadoHabitacion } from '@/Types/enums/estadosHabitacion'


export interface HabitacionesResponse {
  data: Habitacion[]
  meta: {
    page: number
    limit: number
    totalHabitaciones: number
    lastPage: number
  }
}

export async function getHabitaciones(page: number = 1, limit: number = 6): Promise<HabitacionesResponse> {
  const token = getCookie(COOKIE_NAMES.TOKEN)
  
  if (!token) {
    throw new Error('No hay token de autenticación')
  }

  const response = await fetch(HABITACION_ENDPOINTS.GET_ALL(limit, page), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Error al obtener las habitaciones')
  }

  return response.json()
}

export interface CreateHabitacionDto {
  numero_habitacion: number
  tipo: TipoHabitacion
  estado: EstadoHabitacion
  precio_por_noche: number
}

export async function createHabitacion(data: CreateHabitacionDto): Promise<Habitacion> {
  const token = getCookie(COOKIE_NAMES.TOKEN)
  
  if (!token) {
    throw new Error('No hay token de autenticación')
  }

  const response = await fetch(HABITACION_ENDPOINTS.CREATE, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw new Error('Error al crear la habitación')
  }

  return response.json()
} 