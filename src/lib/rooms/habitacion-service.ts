import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

export interface CreateHabitacionDto {
  numero_habitacion: number
  tipo: TipoHabitacion
  estado: EstadoHabitacion
  precio_por_noche: number
}

export interface HabitacionesCambio {
  habitacionId: number;
  nuevoEstado: EstadoHabitacion;
}

export interface FiltrosHabitacionesDisponibles {
  fechaInicio: Date;
  fechaFin: Date;
}

// Keys para React Query
export const HABITACION_KEYS = {
  all: ['habitacion'] as const,
  lists: () => [...HABITACION_KEYS.all, 'list'] as const,
  list: (page: number, limit: number) => [...HABITACION_KEYS.lists(), { page, limit }] as const,
  details: () => [...HABITACION_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...HABITACION_KEYS.details(), id] as const,
  byNumero: (numero: number) => [...HABITACION_KEYS.all, 'numero', numero] as const,
  disponibles: (filtros: FiltrosHabitacionesDisponibles) => 
    [...HABITACION_KEYS.all, 'disponibles', filtros] as const,
};

// Función para obtener habitaciones con paginación
const fetchHabitaciones = async (page: number = 1, limit: number = 6): Promise<HabitacionesResponse> => {
  const token = getCookie(COOKIE_NAMES.TOKEN);
  
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(HABITACION_ENDPOINTS.GET_ALL(limit, page), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener las habitaciones');
  }

  return response.json();
};

// Función para obtener habitación por número
const fetchHabitacionByNumero = async (numero: number): Promise<Habitacion> => {
  const token = getCookie(COOKIE_NAMES.TOKEN);
  
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(HABITACION_ENDPOINTS.GET_BY_NUMBER(numero.toString()), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener la habitación');
  }

  return response.json();
};

// Función para obtener habitaciones disponibles
const fetchHabitacionesDisponibles = async (filtros: FiltrosHabitacionesDisponibles): Promise<Habitacion[]> => {
  const token = getCookie(COOKIE_NAMES.TOKEN);
  
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(HABITACION_ENDPOINTS.POST_ALL_AVAILABLE_BY_DATE_RANGE, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      fechaInicio: filtros.fechaInicio, 
      fechaFin: filtros.fechaFin 
    })
  });

  if (!response.ok) {
    throw new Error('Error al obtener las habitaciones disponibles');
  }

  return response.json();
};

// Función para crear habitación
const createHabitacion = async (data: CreateHabitacionDto): Promise<Habitacion> => {
  const token = getCookie(COOKIE_NAMES.TOKEN);
  
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(HABITACION_ENDPOINTS.CREATE, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al crear la habitación');
  }

  return response.json();
};

// Función para actualizar habitación
const updateHabitacion = async ({ id, data }: { id: number; data: UpdateHabitacionDto }): Promise<Habitacion> => {
  const token = getCookie(COOKIE_NAMES.TOKEN);

  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(HABITACION_ENDPOINTS.UPDATE(id), {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al actualizar la habitación');
  }

  return response.json();
};

// Función para eliminar habitación
const deleteHabitacion = async (id: number): Promise<Habitacion> => {
  const token = getCookie(COOKIE_NAMES.TOKEN);

  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(HABITACION_ENDPOINTS.DELETE(id), {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al eliminar la habitación');
  }

  return response.json();
};

// Hooks

// Hook para obtener habitaciones con paginación
export const useHabitaciones = (page: number = 1, limit: number = 6) => {
  return useQuery({
    queryKey: HABITACION_KEYS.list(page, limit),
    queryFn: () => fetchHabitaciones(page, limit),
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
};

// Hook para obtener habitación por número
export const useHabitacionByNumero = (numero: number, enabled = true) => {
  return useQuery({
    queryKey: HABITACION_KEYS.byNumero(numero),
    queryFn: () => fetchHabitacionByNumero(numero),
    enabled: enabled && numero > 0,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

// Hook para obtener habitaciones disponibles
export const useHabitacionesDisponibles = (
  filtros: FiltrosHabitacionesDisponibles, 
  enabled = true
) => {
  return useQuery({
    queryKey: HABITACION_KEYS.disponibles(filtros),
    queryFn: () => fetchHabitacionesDisponibles(filtros),
    enabled: enabled && !!filtros.fechaInicio && !!filtros.fechaFin,
    staleTime: 1000 * 60 * 3, // 3 minutos
  });
};

// Hook para crear habitación
export const useCreateHabitacion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createHabitacion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HABITACION_KEYS.all });
    },
  });
};

// Hook para actualizar habitación
export const useUpdateHabitacion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateHabitacion,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: HABITACION_KEYS.all });
      queryClient.setQueryData(HABITACION_KEYS.byNumero(data.numero_habitacion), data);
    },
  });
};

// Hook para eliminar habitación
export const useDeleteHabitacion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteHabitacion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HABITACION_KEYS.all });
    },
  });
};

// Función para cambios en tiempo real (SSE) - Se mantiene como función separada
export function getHabitacionesCambios(
  onCambio: (cambios: HabitacionesCambio[]) => void
): EventSource {
  const token = getCookie(COOKIE_NAMES.TOKEN);

  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const es = new EventSource(SSE_ENDPOINTS.HABITACIONES_CAMBIOS, {withCredentials: true});

  es.onerror = (event) => {
    console.error('Error en EventSource', event);
  };

  es.onmessage = (event) => {
    try {
      const cambios: HabitacionesCambio[] = JSON.parse(event.data);
      onCambio(cambios);
    } catch (error) {
      console.error('Error al procesar el mensaje SSE:', error);
    }
  };

  return es;
}

// Funciones legacy para compatibilidad (opcional - pueden removerse gradualmente)
export async function getHabitaciones(page: number = 1, limit: number = 6): Promise<HabitacionesResponse> {
  console.warn('getHabitaciones está deprecated. Usa useHabitaciones hook en su lugar.');
  return fetchHabitaciones(page, limit);
}

export async function getHabitacionByNumero(numero: number): Promise<Habitacion> {
  console.warn('getHabitacionByNumero está deprecated. Usa useHabitacionByNumero hook en su lugar.');
  return fetchHabitacionByNumero(numero);
}

export async function getHabitacionesDisponibles(fechaInicio: Date, fechaFin: Date): Promise<Habitacion[]> {
  console.warn('getHabitacionesDisponibles está deprecated. Usa useHabitacionesDisponibles hook en su lugar.');
  return fetchHabitacionesDisponibles({ fechaInicio, fechaFin });
}