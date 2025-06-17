import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { REGISTRO_ASEO_ZONA_COMUN_ENDPOINTS } from '../common/api';
import { getCookie } from '../common/cookies';
import { 
  RegistroAseoZonaComun, 
  CreateRegistroAseoZonaComunDto, 
  UpdateRegistroAseoZonaComunDto, 
  FiltrosRegistroAseoZonaComunDto 
} from '../../Types/aseo/RegistroAseoZonaComun';
import { PaginatedResponse } from '../../Types/common/pagination';

// Keys para React Query
export const REGISTRO_ASEO_ZONA_COMUN_KEYS = {
  all: ['registro-aseo-zona-comun'] as const,
  lists: () => [...REGISTRO_ASEO_ZONA_COMUN_KEYS.all, 'list'] as const,
  list: (filters: FiltrosRegistroAseoZonaComunDto & { page: number; limit: number }) => 
    [...REGISTRO_ASEO_ZONA_COMUN_KEYS.lists(), filters] as const,
  details: () => [...REGISTRO_ASEO_ZONA_COMUN_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...REGISTRO_ASEO_ZONA_COMUN_KEYS.details(), id] as const,
  byZonaComun: (id: number) => [...REGISTRO_ASEO_ZONA_COMUN_KEYS.all, 'zona-comun', id] as const,
  byUsuario: (id: number) => [...REGISTRO_ASEO_ZONA_COMUN_KEYS.all, 'usuario', id] as const,
  byFecha: (fecha: string) => [...REGISTRO_ASEO_ZONA_COMUN_KEYS.all, 'fecha', fecha] as const,
};

// Función para obtener registros de aseo de zonas comunes
const fetchRegistrosAseoZonaComun = async (
  limit: number, 
  page: number, 
  filters?: FiltrosRegistroAseoZonaComunDto
): Promise<PaginatedResponse<RegistroAseoZonaComun>> => {
  const token = getCookie('auth-token');
  if (!token) {
    throw new Error('Token de autenticación no encontrado');
  }

  const url = REGISTRO_ASEO_ZONA_COMUN_ENDPOINTS.GET_ALL(
    limit, 
    page, 
    filters?.usuarioId,
    filters?.zonaComunId,
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
const fetchRegistroAseoZonaComunById = async (id: number): Promise<RegistroAseoZonaComun> => {
  const token = getCookie('auth-token');
  if (!token) {
    throw new Error('Token de autenticación no encontrado');
  }

  const response = await fetch(REGISTRO_ASEO_ZONA_COMUN_ENDPOINTS.GET_BY_ID(id), {
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

// Función para obtener registros por zona común
const fetchRegistrosPorZonaComun = async (id: number): Promise<RegistroAseoZonaComun[]> => {
  const token = getCookie('auth-token');
  if (!token) {
    throw new Error('Token de autenticación no encontrado');
  }

  const response = await fetch(REGISTRO_ASEO_ZONA_COMUN_ENDPOINTS.GET_BY_ZONA_COMUN(id), {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Error al obtener registros por zona común: ${response.statusText}`);
  }

  return response.json();
};

// Función para obtener registros por usuario
const fetchRegistrosPorUsuario = async (id: number): Promise<RegistroAseoZonaComun[]> => {
  const token = getCookie('auth-token');
  if (!token) {
    throw new Error('Token de autenticación no encontrado');
  }

  const response = await fetch(REGISTRO_ASEO_ZONA_COMUN_ENDPOINTS.GET_BY_USUARIO(id), {
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
const fetchRegistrosPorFecha = async (fecha: string): Promise<RegistroAseoZonaComun[]> => {
  const token = getCookie('auth-token');
  if (!token) {
    throw new Error('Token de autenticación no encontrado');
  }

  const response = await fetch(REGISTRO_ASEO_ZONA_COMUN_ENDPOINTS.GET_BY_FECHA(fecha), {
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
const createRegistroAseoZonaComun = async (data: CreateRegistroAseoZonaComunDto): Promise<RegistroAseoZonaComun> => {
  const token = getCookie('auth-token');
  if (!token) {
    throw new Error('Token de autenticación no encontrado');
  }

  const response = await fetch(REGISTRO_ASEO_ZONA_COMUN_ENDPOINTS.CREATE, {
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
const updateRegistroAseoZonaComun = async ({ id, data }: { id: number; data: UpdateRegistroAseoZonaComunDto }): Promise<RegistroAseoZonaComun> => {
  const token = getCookie('auth-token');
  if (!token) {
    throw new Error('Token de autenticación no encontrado');
  }

  const response = await fetch(REGISTRO_ASEO_ZONA_COMUN_ENDPOINTS.UPDATE(id), {
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
const deleteRegistroAseoZonaComun = async (id: number): Promise<RegistroAseoZonaComun> => {
  const token = getCookie('auth-token');
  if (!token) {
    throw new Error('Token de autenticación no encontrado');
  }

  const response = await fetch(REGISTRO_ASEO_ZONA_COMUN_ENDPOINTS.DELETE(id), {
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
export const useRegistrosAseoZonaComun = (
  limit: number, 
  page: number, 
  filters?: FiltrosRegistroAseoZonaComunDto
) => {
  return useQuery({
    queryKey: REGISTRO_ASEO_ZONA_COMUN_KEYS.list({ ...filters, page, limit }),
    queryFn: () => fetchRegistrosAseoZonaComun(limit, page, filters),
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
};

// Hook para obtener registro por ID
export const useRegistroAseoZonaComunById = (id: number, enabled = true) => {
  return useQuery({
    queryKey: REGISTRO_ASEO_ZONA_COMUN_KEYS.detail(id),
    queryFn: () => fetchRegistroAseoZonaComunById(id),
    enabled: enabled && id > 0,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

// Hook para obtener registros por zona común
export const useRegistrosPorZonaComun = (id: number, enabled = true) => {
  return useQuery({
    queryKey: REGISTRO_ASEO_ZONA_COMUN_KEYS.byZonaComun(id),
    queryFn: () => fetchRegistrosPorZonaComun(id),
    enabled: enabled && id > 0,
    staleTime: 1000 * 60 * 3, // 3 minutos
  });
};

// Hook para obtener registros por usuario
export const useRegistrosPorUsuario = (id: number, enabled = true) => {
  return useQuery({
    queryKey: REGISTRO_ASEO_ZONA_COMUN_KEYS.byUsuario(id),
    queryFn: () => fetchRegistrosPorUsuario(id),
    enabled: enabled && id > 0,
    staleTime: 1000 * 60 * 3, // 3 minutos
  });
};

// Hook para obtener registros por fecha
export const useRegistrosPorFecha = (fecha: string, enabled = true) => {
  return useQuery({
    queryKey: REGISTRO_ASEO_ZONA_COMUN_KEYS.byFecha(fecha),
    queryFn: () => fetchRegistrosPorFecha(fecha),
    enabled: enabled && fecha.length > 0,
    staleTime: 1000 * 60 * 3, // 3 minutos
  });
};

// Hook para crear registro
export const useCreateRegistroAseoZonaComun = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRegistroAseoZonaComun,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REGISTRO_ASEO_ZONA_COMUN_KEYS.all });
    },
  });
};

// Hook para actualizar registro
export const useUpdateRegistroAseoZonaComun = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRegistroAseoZonaComun,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: REGISTRO_ASEO_ZONA_COMUN_KEYS.all });
      queryClient.setQueryData(REGISTRO_ASEO_ZONA_COMUN_KEYS.detail(data.id), data);
    },
  });
};

// Hook para eliminar registro
export const useDeleteRegistroAseoZonaComun = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRegistroAseoZonaComun,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REGISTRO_ASEO_ZONA_COMUN_KEYS.all });
    },
  });
}; 