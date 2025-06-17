import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CONFIGURACION_ASEO_ENDPOINTS } from '../common/api';
import { getCookie } from '../common/cookies';
import { ConfiguracionAseo, UpdateConfiguracionAseoDto } from '../../Types/aseo/ConfiguracionAseo';

// Keys para React Query
export const CONFIGURACION_ASEO_KEYS = {
  all: ['configuracion-aseo'] as const,
  get: () => [...CONFIGURACION_ASEO_KEYS.all, 'get'] as const,
};

// Función para obtener configuración
const fetchConfiguracionAseo = async (): Promise<ConfiguracionAseo> => {
  const token = getCookie('auth-token');
  if (!token) {
    throw new Error('Token de autenticación no encontrado');
  }

  const response = await fetch(CONFIGURACION_ASEO_ENDPOINTS.GET, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Error al obtener configuración: ${response.statusText}`);
  }

  return response.json();
};

// Función para actualizar configuración
const updateConfiguracionAseo = async (data: UpdateConfiguracionAseoDto): Promise<ConfiguracionAseo> => {
  const token = getCookie('auth-token');
  if (!token) {
    throw new Error('Token de autenticación no encontrado');
  }

  const response = await fetch(CONFIGURACION_ASEO_ENDPOINTS.UPDATE, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Error al actualizar configuración: ${response.statusText}`);
  }

  return response.json();
};

// Hook para obtener configuración
export const useConfiguracionAseo = () => {
  return useQuery({
    queryKey: CONFIGURACION_ASEO_KEYS.get(),
    queryFn: fetchConfiguracionAseo,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

// Hook para actualizar configuración
export const useUpdateConfiguracionAseo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateConfiguracionAseo,
    onSuccess: () => {
      // Invalidar y refetch la configuración
      queryClient.invalidateQueries({ queryKey: CONFIGURACION_ASEO_KEYS.all });
    },
  });
}; 