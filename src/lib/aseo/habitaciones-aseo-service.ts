import { useQuery } from '@tanstack/react-query';
import { HABITACION_ENDPOINTS } from '../common/api';
import { getCookie } from '../common/cookies';
import { COOKIE_NAMES } from '../common/cookies';
import { 
  HabitacionAseo,
  FiltrosAseoHabitacionDto 
} from '../../Types/aseo/HabitacionAseo';
import { PaginatedResponse } from '../../Types/common/pagination';

// Keys para React Query
export const HABITACIONES_ASEO_KEYS = {
  all: ['habitaciones-aseo'] as const,
  lists: () => [...HABITACIONES_ASEO_KEYS.all, 'list'] as const,
  list: (filters: FiltrosAseoHabitacionDto & { page: number; limit: number }) => 
    [...HABITACIONES_ASEO_KEYS.lists(), filters] as const,
};

// Función para obtener habitaciones para aseo
const fetchHabitacionesAseo = async (
  limit: number, 
  page: number, 
  filters?: FiltrosAseoHabitacionDto
): Promise<PaginatedResponse<HabitacionAseo>> => {
  const token = getCookie(COOKIE_NAMES.TOKEN);
  if (!token) {
    throw new Error('Token de autenticación no encontrado');
  }

  const url = HABITACION_ENDPOINTS.GET_ASEO(
    limit, 
    page, 
    filters?.requerido_aseo_hoy,
    filters?.requerido_desinfeccion_hoy,
    filters?.requerido_rotacion_colchones,
    filters?.ultimo_aseo_tipo
  );

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Error al obtener habitaciones para aseo: ${response.statusText}`);
  }

  return response.json();
};

// Hook para obtener habitaciones para aseo
export const useHabitacionesAseo = (
  limit: number, 
  page: number, 
  filters?: FiltrosAseoHabitacionDto
) => {
  return useQuery({
    queryKey: HABITACIONES_ASEO_KEYS.list({ ...filters, page, limit }),
    queryFn: () => fetchHabitacionesAseo(limit, page, filters),
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
}; 