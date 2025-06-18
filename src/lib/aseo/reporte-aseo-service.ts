import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { REPORTE_ASEO_ENDPOINTS } from '../common/api';
import { getCookie } from '../common/cookies';
import { COOKIE_NAMES } from '../common/cookies';
import { 
  ReporteAseoDiario, 
  CreateReporteAseoDiarioDto, 
  UpdateReporteAseoDiarioDto, 
  FiltrosReportesAseoDto 
} from '../../Types/aseo/ReporteAseoDiario';
import { PaginatedResponse } from '../../Types/common/pagination';

// Keys para React Query
export const REPORTE_ASEO_KEYS = {
  all: ['reporte-aseo'] as const,
  lists: () => [...REPORTE_ASEO_KEYS.all, 'list'] as const,
  list: (filters: FiltrosReportesAseoDto & { page: number; limit: number }) => 
    [...REPORTE_ASEO_KEYS.lists(), filters] as const,
  details: () => [...REPORTE_ASEO_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...REPORTE_ASEO_KEYS.details(), id] as const,
  byFecha: (fecha: string) => [...REPORTE_ASEO_KEYS.all, 'fecha', fecha] as const,
};

// Función para obtener reportes de aseo
const fetchReportesAseo = async (
  limit: number, 
  page: number, 
  filters?: FiltrosReportesAseoDto
): Promise<PaginatedResponse<ReporteAseoDiario>> => {
  const token = getCookie(COOKIE_NAMES.TOKEN);
  if (!token) {
    throw new Error('Token de autenticación no encontrado');
  }

  const url = REPORTE_ASEO_ENDPOINTS.GET_ALL(
    limit, 
    page, 
    filters?.fecha,
    filters?.fecha_inicio,
    filters?.fecha_fin,
    filters?.elemento_aseo,
    filters?.producto_quimico,
    filters?.elemento_proteccion
  );

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Error al obtener reportes de aseo: ${response.statusText}`);
  }

  return response.json();
};

// Función para obtener reporte por ID
const fetchReporteAseoById = async (id: number): Promise<ReporteAseoDiario> => {
  const token = getCookie(COOKIE_NAMES.TOKEN);
  if (!token) {
    throw new Error('Token de autenticación no encontrado');
  }

  const response = await fetch(REPORTE_ASEO_ENDPOINTS.GET_BY_ID(id), {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Error al obtener reporte de aseo: ${response.statusText}`);
  }

  return response.json();
};

// Función para obtener reporte por fecha
const fetchReportePorFecha = async (fecha: string): Promise<ReporteAseoDiario | null> => {
  const token = getCookie(COOKIE_NAMES.TOKEN);
  if (!token) {
    throw new Error('Token de autenticación no encontrado');
  }

  const response = await fetch(REPORTE_ASEO_ENDPOINTS.GET_BY_FECHA(fecha), {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Error al obtener reporte por fecha: ${response.statusText}`);
  }

  return response.json();
};

// Función para crear reporte
const createReporteAseo = async (data: CreateReporteAseoDiarioDto): Promise<ReporteAseoDiario> => {
  const token = getCookie(COOKIE_NAMES.TOKEN);
  if (!token) {
    throw new Error('Token de autenticación no encontrado');
  }

  const response = await fetch(REPORTE_ASEO_ENDPOINTS.CREATE, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Error al crear reporte de aseo: ${response.statusText}`);
  }

  return response.json();
};

// Función para actualizar reporte
const updateReporteAseo = async ({ id, data }: { id: number; data: UpdateReporteAseoDiarioDto }): Promise<ReporteAseoDiario> => {
  const token = getCookie(COOKIE_NAMES.TOKEN);
  if (!token) {
    throw new Error('Token de autenticación no encontrado');
  }

  const response = await fetch(REPORTE_ASEO_ENDPOINTS.UPDATE(id), {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Error al actualizar reporte de aseo: ${response.statusText}`);
  }

  return response.json();
};

// Función para eliminar reporte
const deleteReporteAseo = async (id: number): Promise<ReporteAseoDiario> => {
  const token = getCookie(COOKIE_NAMES.TOKEN);
  if (!token) {
    throw new Error('Token de autenticación no encontrado');
  }

  const response = await fetch(REPORTE_ASEO_ENDPOINTS.DELETE(id), {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Error al eliminar reporte de aseo: ${response.statusText}`);
  }

  return response.json();
};

// Función para generar reporte automático
const generarReporteAseo = async (fecha: string): Promise<ReporteAseoDiario> => {
  const token = getCookie(COOKIE_NAMES.TOKEN);
  if (!token) {
    throw new Error('Token de autenticación no encontrado');
  }

  const response = await fetch(REPORTE_ASEO_ENDPOINTS.GENERAR, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fecha }),
  });

  if (!response.ok) {
    throw new Error(`Error al generar reporte de aseo: ${response.statusText}`);
  }

  return response.json();
};

// Hooks

// Hook para obtener reportes de aseo
export const useReportesAseo = (
  limit: number, 
  page: number, 
  filters?: FiltrosReportesAseoDto
) => {
  return useQuery({
    queryKey: REPORTE_ASEO_KEYS.list({ ...filters, page, limit }),
    queryFn: () => fetchReportesAseo(limit, page, filters),
    staleTime: 1000 * 60 * 5, // 5 minutos (reportes cambian menos frecuentemente)
  });
};

// Hook para obtener reporte por ID
export const useReporteAseoById = (id: number, enabled = true) => {
  return useQuery({
    queryKey: REPORTE_ASEO_KEYS.detail(id),
    queryFn: () => fetchReporteAseoById(id),
    enabled: enabled && id > 0,
    staleTime: 1000 * 60 * 10, // 10 minutos
  });
};

// Hook para obtener reporte por fecha
export const useReportePorFecha = (fecha: string, enabled = true) => {
  return useQuery({
    queryKey: REPORTE_ASEO_KEYS.byFecha(fecha),
    queryFn: () => fetchReportePorFecha(fecha),
    enabled: enabled && fecha.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

// Hook para crear reporte
export const useCreateReporteAseo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReporteAseo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REPORTE_ASEO_KEYS.all });
    },
  });
};

// Hook para actualizar reporte
export const useUpdateReporteAseo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateReporteAseo,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: REPORTE_ASEO_KEYS.all });
      queryClient.setQueryData(REPORTE_ASEO_KEYS.detail(data.id), data);
    },
  });
};

// Hook para eliminar reporte
export const useDeleteReporteAseo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReporteAseo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REPORTE_ASEO_KEYS.all });
    },
  });
};

// Hook para generar reporte automático
export const useGenerarReporteAseo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generarReporteAseo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REPORTE_ASEO_KEYS.all });
    },
  });
}; 