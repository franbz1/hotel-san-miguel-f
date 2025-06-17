import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ZONA_COMUN_ENDPOINTS } from '../common/api';
import { getCookie } from '../common/cookies';
import { 
  ZonaComun, 
  CreateZonaComunDto, 
  UpdateZonaComunDto, 
  FiltrosZonaComunDto 
} from '../../Types/zonasComunes';
import { PaginatedResponse } from '../../Types/common/pagination';

// Keys para React Query
export const ZONA_COMUN_KEYS = {
  all: ['zona-comun'] as const,
  lists: () => [...ZONA_COMUN_KEYS.all, 'list'] as const,
  list: (filters: FiltrosZonaComunDto & { page: number; limit: number }) => 
    [...ZONA_COMUN_KEYS.lists(), filters] as const,
  details: () => [...ZONA_COMUN_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...ZONA_COMUN_KEYS.details(), id] as const,
  requierenAseo: () => [...ZONA_COMUN_KEYS.all, 'requieren-aseo'] as const,
  porPiso: (piso: number) => [...ZONA_COMUN_KEYS.all, 'piso', piso] as const,
};

// Función para obtener zonas comunes
const fetchZonasComunes = async (
  limit: number, 
  page: number, 
  filters?: FiltrosZonaComunDto
): Promise<PaginatedResponse<ZonaComun>> => {
  const token = getCookie('auth-token');
  if (!token) {
    throw new Error('Token de autenticación no encontrado');
  }

  const url = ZONA_COMUN_ENDPOINTS.GET_ALL(
    limit, 
    page, 
    filters?.piso, 
    filters?.requerido_aseo_hoy, 
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
    throw new Error(`Error al obtener zonas comunes: ${response.statusText}`);
  }

  return response.json();
};

// Función para obtener zona común por ID
const fetchZonaComunById = async (id: number): Promise<ZonaComun> => {
  const token = getCookie('auth-token');
  if (!token) {
    throw new Error('Token de autenticación no encontrado');
  }

  const response = await fetch(ZONA_COMUN_ENDPOINTS.GET_BY_ID(id), {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Error al obtener zona común: ${response.statusText}`);
  }

  return response.json();
};

// Función para crear zona común
const createZonaComun = async (data: CreateZonaComunDto): Promise<ZonaComun> => {
  const token = getCookie('auth-token');
  if (!token) {
    throw new Error('Token de autenticación no encontrado');
  }

  const response = await fetch(ZONA_COMUN_ENDPOINTS.CREATE, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Error al crear zona común: ${response.statusText}`);
  }

  return response.json();
};

// Función para actualizar zona común
const updateZonaComun = async ({ id, data }: { id: number; data: UpdateZonaComunDto }): Promise<ZonaComun> => {
  const token = getCookie('auth-token');
  if (!token) {
    throw new Error('Token de autenticación no encontrado');
  }

  const response = await fetch(ZONA_COMUN_ENDPOINTS.UPDATE(id), {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Error al actualizar zona común: ${response.statusText}`);
  }

  return response.json();
};

// Función para eliminar zona común
const deleteZonaComun = async (id: number): Promise<ZonaComun> => {
  const token = getCookie('auth-token');
  if (!token) {
    throw new Error('Token de autenticación no encontrado');
  }

  const response = await fetch(ZONA_COMUN_ENDPOINTS.DELETE(id), {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Error al eliminar zona común: ${response.statusText}`);
  }

  return response.json();
};

// Función para obtener zonas que requieren aseo
const fetchZonasRequierenAseo = async (): Promise<ZonaComun[]> => {
  const token = getCookie('auth-token');
  if (!token) {
    throw new Error('Token de autenticación no encontrado');
  }

  const response = await fetch(ZONA_COMUN_ENDPOINTS.GET_REQUIEREN_ASEO, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Error al obtener zonas que requieren aseo: ${response.statusText}`);
  }

  return response.json();
};

// Función para obtener zonas por piso
const fetchZonasPorPiso = async (piso: number): Promise<ZonaComun[]> => {
  const token = getCookie('auth-token');
  if (!token) {
    throw new Error('Token de autenticación no encontrado');
  }

  const response = await fetch(ZONA_COMUN_ENDPOINTS.GET_BY_PISO(piso), {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Error al obtener zonas por piso: ${response.statusText}`);
  }

  return response.json();
};

// Hooks

// Hook para obtener zonas comunes
export const useZonasComunes = (
  limit: number, 
  page: number, 
  filters?: FiltrosZonaComunDto
) => {
  return useQuery({
    queryKey: ZONA_COMUN_KEYS.list({ ...filters, page, limit }),
    queryFn: () => fetchZonasComunes(limit, page, filters),
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
};

// Hook para obtener zona común por ID
export const useZonaComunById = (id: number, enabled = true) => {
  return useQuery({
    queryKey: ZONA_COMUN_KEYS.detail(id),
    queryFn: () => fetchZonaComunById(id),
    enabled: enabled && id > 0,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

// Hook para obtener zonas que requieren aseo
export const useZonasRequierenAseo = () => {
  return useQuery({
    queryKey: ZONA_COMUN_KEYS.requierenAseo(),
    queryFn: fetchZonasRequierenAseo,
    staleTime: 1000 * 60 * 1, // 1 minuto (más frecuente)
  });
};

// Hook para obtener zonas por piso
export const useZonasPorPiso = (piso: number, enabled = true) => {
  return useQuery({
    queryKey: ZONA_COMUN_KEYS.porPiso(piso),
    queryFn: () => fetchZonasPorPiso(piso),
    enabled: enabled && piso >= 0,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

// Hook para crear zona común
export const useCreateZonaComun = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createZonaComun,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ZONA_COMUN_KEYS.all });
    },
  });
};

// Hook para actualizar zona común
export const useUpdateZonaComun = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateZonaComun,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ZONA_COMUN_KEYS.all });
      queryClient.setQueryData(ZONA_COMUN_KEYS.detail(data.id), data);
    },
  });
};

// Hook para eliminar zona común
export const useDeleteZonaComun = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteZonaComun,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ZONA_COMUN_KEYS.all });
    },
  });
}; 