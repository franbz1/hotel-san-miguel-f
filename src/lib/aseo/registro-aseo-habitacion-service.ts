import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { REGISTRO_ASEO_HABITACION_ENDPOINTS } from '../common/api';
import { getCookie } from '../common/cookies';
import { COOKIE_NAMES } from '../common/cookies';
import { 
  RegistroAseoHabitacion, 
  CreateRegistroAseoHabitacionDto, 
  UpdateRegistroAseoHabitacionDto, 
  FiltrosRegistroAseoHabitacionDto 
} from '../../Types/aseo/RegistroAseoHabitacion';
import { PaginatedResponse } from '../../Types/common/pagination';

// Keys para React Query
export const REGISTRO_ASEO_HABITACION_KEYS = {
  all: ['registro-aseo-habitacion'] as const,
  lists: () => [...REGISTRO_ASEO_HABITACION_KEYS.all, 'list'] as const,
  list: (filters: FiltrosRegistroAseoHabitacionDto & { page: number; limit: number }) => 
    [...REGISTRO_ASEO_HABITACION_KEYS.lists(), filters] as const,
  details: () => [...REGISTRO_ASEO_HABITACION_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...REGISTRO_ASEO_HABITACION_KEYS.details(), id] as const,
  byHabitacion: (id: number) => [...REGISTRO_ASEO_HABITACION_KEYS.all, 'habitacion', id] as const,
  byUsuario: (id: number) => [...REGISTRO_ASEO_HABITACION_KEYS.all, 'usuario', id] as const,
  byFecha: (fecha: string) => [...REGISTRO_ASEO_HABITACION_KEYS.all, 'fecha', fecha] as const,
};

// Función para obtener registros de aseo de habitaciones
const fetchRegistrosAseoHabitacion = async (
  limit: number, 
  page: number, 
  filters?: FiltrosRegistroAseoHabitacionDto
): Promise<PaginatedResponse<RegistroAseoHabitacion>> => {
  const token = getCookie(COOKIE_NAMES.TOKEN);
  if (!token) {
    throw new Error('Token de autenticación no encontrado');
  }

  const url = REGISTRO_ASEO_HABITACION_ENDPOINTS.GET_ALL(
    limit, 
    page, 
    filters?.usuarioId,
    filters?.habitacionId,
    filters?.fecha,
    filters?.tipo_aseo,
    filters?.objetos_perdidos,
    filters?.rastros_de_animales
  );

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Error al obtener registros de aseo: ${response.statusText}`);
  }

  return response.json();
};

// Función para obtener registro por ID
const fetchRegistroAseoHabitacionById = async (id: number): Promise<RegistroAseoHabitacion> => {
  const token = getCookie(COOKIE_NAMES.TOKEN);
  if (!token) {
    throw new Error('Token de autenticación no encontrado');
  }

  const response = await fetch(REGISTRO_ASEO_HABITACION_ENDPOINTS.GET_BY_ID(id), {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Error al obtener registro de aseo: ${response.statusText}`);
  }

  return response.json();
};

// Función para obtener registros por habitación
const fetchRegistrosPorHabitacion = async (id: number): Promise<RegistroAseoHabitacion[]> => {
  const token = getCookie(COOKIE_NAMES.TOKEN);
  if (!token) {
    throw new Error('Token de autenticación no encontrado');
  }

  const response = await fetch(REGISTRO_ASEO_HABITACION_ENDPOINTS.GET_BY_HABITACION(id), {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Error al obtener registros por habitación: ${response.statusText}`);
  }

  return response.json();
};

// Función para obtener registros por usuario
const fetchRegistrosPorUsuario = async (id: number): Promise<RegistroAseoHabitacion[]> => {
  const token = getCookie(COOKIE_NAMES.TOKEN);
  if (!token) {
    throw new Error('Token de autenticación no encontrado');
  }

  const response = await fetch(REGISTRO_ASEO_HABITACION_ENDPOINTS.GET_BY_USUARIO(id), {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Error al obtener registros por usuario: ${response.statusText}`);
  }

  return response.json();
};

// Función para obtener registros por fecha
const fetchRegistrosPorFecha = async (fecha: string): Promise<RegistroAseoHabitacion[]> => {
  const token = getCookie(COOKIE_NAMES.TOKEN);
  if (!token) {
    throw new Error('Token de autenticación no encontrado');
  }

  const response = await fetch(REGISTRO_ASEO_HABITACION_ENDPOINTS.GET_BY_FECHA(fecha), {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Error al obtener registros por fecha: ${response.statusText}`);
  }

  return response.json();
};

// Función para crear registro
const createRegistroAseoHabitacion = async (data: CreateRegistroAseoHabitacionDto): Promise<RegistroAseoHabitacion> => {
  const token = getCookie(COOKIE_NAMES.TOKEN);
  if (!token) {
    throw new Error('Token de autenticación no encontrado');
  }

  const response = await fetch(REGISTRO_ASEO_HABITACION_ENDPOINTS.CREATE, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Error al crear registro de aseo: ${response.statusText}`);
  }

  return response.json();
};

// Función para actualizar registro
const updateRegistroAseoHabitacion = async ({ id, data }: { id: number; data: UpdateRegistroAseoHabitacionDto }): Promise<RegistroAseoHabitacion> => {
  const token = getCookie(COOKIE_NAMES.TOKEN);
  if (!token) {
    throw new Error('Token de autenticación no encontrado');
  }

  const response = await fetch(REGISTRO_ASEO_HABITACION_ENDPOINTS.UPDATE(id), {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Error al actualizar registro de aseo: ${response.statusText}`);
  }

  return response.json();
};

// Función para eliminar registro
const deleteRegistroAseoHabitacion = async (id: number): Promise<RegistroAseoHabitacion> => {
  const token = getCookie(COOKIE_NAMES.TOKEN);
  if (!token) {
    throw new Error('Token de autenticación no encontrado');
  }

  const response = await fetch(REGISTRO_ASEO_HABITACION_ENDPOINTS.DELETE(id), {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Error al eliminar registro de aseo: ${response.statusText}`);
  }

  return response.json();
};

// Hooks

// Hook para obtener registros de aseo
export const useRegistrosAseoHabitacion = (
  limit: number, 
  page: number, 
  filters?: FiltrosRegistroAseoHabitacionDto
) => {
  return useQuery({
    queryKey: REGISTRO_ASEO_HABITACION_KEYS.list({ ...filters, page, limit }),
    queryFn: () => fetchRegistrosAseoHabitacion(limit, page, filters),
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
};

// Hook para obtener registro por ID
export const useRegistroAseoHabitacionById = (id: number, enabled = true) => {
  return useQuery({
    queryKey: REGISTRO_ASEO_HABITACION_KEYS.detail(id),
    queryFn: () => fetchRegistroAseoHabitacionById(id),
    enabled: enabled && id > 0,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

// Hook para obtener registros por habitación
export const useRegistrosPorHabitacion = (id: number, enabled = true) => {
  return useQuery({
    queryKey: REGISTRO_ASEO_HABITACION_KEYS.byHabitacion(id),
    queryFn: () => fetchRegistrosPorHabitacion(id),
    enabled: enabled && id > 0,
    staleTime: 1000 * 60 * 3, // 3 minutos
  });
};

// Hook para obtener registros por usuario
export const useRegistrosPorUsuario = (id: number, enabled = true) => {
  return useQuery({
    queryKey: REGISTRO_ASEO_HABITACION_KEYS.byUsuario(id),
    queryFn: () => fetchRegistrosPorUsuario(id),
    enabled: enabled && id > 0,
    staleTime: 1000 * 60 * 3, // 3 minutos
  });
};

// Hook para obtener registros por fecha
export const useRegistrosPorFecha = (fecha: string, enabled = true) => {
  return useQuery({
    queryKey: REGISTRO_ASEO_HABITACION_KEYS.byFecha(fecha),
    queryFn: () => fetchRegistrosPorFecha(fecha),
    enabled: enabled && fecha.length > 0,
    staleTime: 1000 * 60 * 3, // 3 minutos
  });
};

// Hook para crear registro
export const useCreateRegistroAseoHabitacion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRegistroAseoHabitacion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REGISTRO_ASEO_HABITACION_KEYS.all });
    },
  });
};

// Hook para actualizar registro
export const useUpdateRegistroAseoHabitacion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRegistroAseoHabitacion,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: REGISTRO_ASEO_HABITACION_KEYS.all });
      queryClient.setQueryData(REGISTRO_ASEO_HABITACION_KEYS.detail(data.id), data);
    },
  });
};

// Hook para eliminar registro
export const useDeleteRegistroAseoHabitacion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRegistroAseoHabitacion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REGISTRO_ASEO_HABITACION_KEYS.all });
    },
  });
}; 