import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  generateLinkFormularioFn,
  fetchLinksFormulario,
  fetchLinksFormularioByHabitacion,
  fetchLinkFormularioById,
  regenerateLinkFormularioFn,
  validateLinkFormularioFn,
  LINK_FORMULARIO_KEYS
} from '@/lib/formulario/link-formulario-service';

// Hook para generar link de formulario
export const useGenerateLinkFormulario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generateLinkFormularioFn,
    onSuccess: () => {
      // Invalidar listas de links
      queryClient.invalidateQueries({ queryKey: LINK_FORMULARIO_KEYS.lists() });
    },
  });
};

// Hook para obtener links de formulario
export const useLinksFormulario = (limit: number, page: number) => {
  return useQuery({
    queryKey: LINK_FORMULARIO_KEYS.list(limit, page),
    queryFn: () => fetchLinksFormulario(limit, page),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

// Hook para obtener links por habitación
export const useLinksFormularioByHabitacion = (numeroHabitacion: number, limit: number, page: number) => {
  return useQuery({
    queryKey: LINK_FORMULARIO_KEYS.listByHabitacion(numeroHabitacion, limit, page),
    queryFn: () => fetchLinksFormularioByHabitacion(numeroHabitacion, limit, page),
    staleTime: 1000 * 60 * 5, // 5 minutos
    enabled: !!numeroHabitacion, // Solo ejecutar si hay número de habitación
  });
};

// Hook para obtener link por ID
export const useLinkFormularioById = (id: number) => {
  return useQuery({
    queryKey: LINK_FORMULARIO_KEYS.detail(id),
    queryFn: () => fetchLinkFormularioById(id),
    staleTime: 1000 * 60 * 5, // 5 minutos
    enabled: !!id, // Solo ejecutar si hay ID
  });
};

// Hook para regenerar link
export const useRegenerateLinkFormulario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: regenerateLinkFormularioFn,
    onSuccess: (data, id) => {
      // Invalidar el link específico y las listas
      queryClient.invalidateQueries({ queryKey: LINK_FORMULARIO_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: LINK_FORMULARIO_KEYS.lists() });
    },
  });
};

// Hook para validar link
export const useValidateLinkFormulario = (tokenUrl: string) => {
  return useQuery({
    queryKey: LINK_FORMULARIO_KEYS.validate(tokenUrl),
    queryFn: () => validateLinkFormularioFn(tokenUrl),
    staleTime: 1000 * 60 * 1, // 1 minuto (validación más frecuente)
    enabled: !!tokenUrl, // Solo ejecutar si hay token
    retry: false, // No reintentar en caso de error (links pueden ser inválidos)
  });
}; 