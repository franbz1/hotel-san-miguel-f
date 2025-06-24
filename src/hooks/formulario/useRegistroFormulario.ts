import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  createRegistroFormularioFn,
  REGISTRO_FORMULARIO_KEYS
} from '@/lib/formulario/registro-formulario-service';

/**
 * Hook para crear un nuevo registro de formulario
 */
export const useCreateRegistroFormulario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRegistroFormularioFn,
    onSuccess: () => {
      // Invalidar consultas relacionadas si es necesario
      queryClient.invalidateQueries({ queryKey: REGISTRO_FORMULARIO_KEYS.all });
    },
  });
}; 