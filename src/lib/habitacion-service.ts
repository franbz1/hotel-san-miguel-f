import { HABITACION_ENDPOINTS } from './api'
import { COOKIE_NAMES, getCookie } from './cookies'


export enum TipoHabitacion {
  APARTAMENTO = 'APARTAMENTO',
  HAMACA = 'HAMACA',
  CAMPING = 'CAMPING',
  MÚLTIPLE = 'MÚLTIPLE',
  CASA = 'CASA',
  FINCA = 'FINCA',
  CAMA = 'CAMA',
  PLAZA = 'PLAZA',
  SENCILLA = 'SENCILLA',
  SUITE = 'SUITE',
  DOBLE = 'DOBLE',
  OTRO = 'OTRO',
}

export enum EstadoHabitacion {
  LIBRE = 'LIBRE',
  OCUPADO = 'OCUPADO',
  RESERVADO = 'RESERVADO',
  EN_DESINFECCION = 'EN_DESINFECCION',
  EN_MANTENIMIENTO = 'EN_MANTENIMIENTO',
  EN_LIMPIEZA = 'EN_LIMPIEZA',
}

export interface Habitacion {
  id: number;

  numero_habitacion: number;

  tipo: TipoHabitacion;

  estado: EstadoHabitacion;

  precio_por_noche: number;

  created_at: string;

  updated_at: string;

  deleted_at: boolean;
}


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