import { useQuery } from '@tanstack/react-query';
import { 
  fetchFormularios, 
  fetchFormularioById, 
  FORMULARIO_KEYS
} from '@/lib/formulario/formulario-service';

// Hook para obtener formularios paginados
export const useFormularios = (page: number = 1, limit: number = 6) => {
  return useQuery({
    queryKey: FORMULARIO_KEYS.list(page, limit),
    queryFn: () => fetchFormularios(page, limit),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

// Hook para obtener formulario por ID
export const useFormularioById = (id: number) => {
  return useQuery({
    queryKey: FORMULARIO_KEYS.detail(id),
    queryFn: () => fetchFormularioById(id),
    staleTime: 1000 * 60 * 5, // 5 minutos
    enabled: !!id, // Solo ejecutar si hay ID
  });
}; 