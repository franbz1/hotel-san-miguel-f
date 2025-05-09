import { Habitacion, UpdateHabitacionDto } from '@/Types/habitacion'
import { HABITACION_ENDPOINTS, SSE_ENDPOINTS } from '@/lib/common/api'
import { COOKIE_NAMES, getCookie } from '@/lib/common/cookies'
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
    const errorData = await response.json()
    throw new Error(errorData.message || 'Error al crear la habitación')
  }

  return response.json()
}

export async function updateHabitacion(id: number, data: UpdateHabitacionDto): Promise<Habitacion> {
  const token = getCookie(COOKIE_NAMES.TOKEN)

  if (!token) {
    throw new Error('No hay token de autenticación')
  }

  const response = await fetch(HABITACION_ENDPOINTS.UPDATE(id), {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Error al actualizar la habitación')
  }

  return response.json()
}

export async function getHabitacionesDisponibles(fechaInicio: Date, fechaFin: Date): Promise<Habitacion[]> {
  const token = getCookie(COOKIE_NAMES.TOKEN)
  
  if (!token) {
    throw new Error('No hay token de autenticación')
  }

  const response = await fetch(HABITACION_ENDPOINTS.POST_ALL_AVAILABLE_BY_DATE_RANGE, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fechaInicio: fechaInicio, fechaFin: fechaFin })
  })

  if (!response.ok) {
    throw new Error('Error al obtener las habitaciones disponibles')
  }

  return response.json()
}

export async function getHabitacionByNumero(numero: number): Promise<Habitacion> {
  const token = getCookie(COOKIE_NAMES.TOKEN)
  
  if (!token) {
    throw new Error('No hay token de autenticación')
  }

  const response = await fetch(HABITACION_ENDPOINTS.GET_BY_NUMBER(numero.toString()), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Error al obtener la habitación')
  }

  return response.json()
}

export interface HabitacionesCambio {
  habitacionId: number;
  nuevoEstado: EstadoHabitacion;
}

export function getHabitacionesCambios(
  onCambio: (cambios: HabitacionesCambio[]) => void
): EventSource {
  const token = getCookie(COOKIE_NAMES.TOKEN)

  if (!token) {
    throw new Error('No hay token de autenticación')
  }

  const es = new EventSource(SSE_ENDPOINTS.HABITACIONES_CAMBIOS, {withCredentials: true})

  es.onerror = (event) => {
    console.error('Error en EventSource', event)
  }

  es.onmessage = (event) => {
    try {
      const cambios: HabitacionesCambio[] = JSON.parse(event.data)
      onCambio(cambios)
    } catch (error) {
      console.error('Error al procesar el mensaje SSE:', error)
    }
  }

  return es
}