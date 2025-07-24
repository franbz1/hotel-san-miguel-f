import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  createRegistroFormulario,
  REGISTRO_FORMULARIO_KEYS
} from '@/lib/formulario/registro-formulario-service';

// Hook para crear registro
export const useCreateRegistroFormulario = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createRegistroFormulario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REGISTRO_FORMULARIO_KEYS.all });
    },
  });

  // Función para resetear el estado de la mutación
  const resetMutation = () => {
    mutation.reset();
  };

  return {
    ...mutation,
    resetMutation,
  };
};