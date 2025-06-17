import { 
  useConfiguracionAseo as useConfiguracionAseoBase, 
  useUpdateConfiguracionAseo as useUpdateConfiguracionAseoBase 
} from '../../lib/aseo/configuracion-aseo-service';
import { UpdateConfiguracionAseoDto } from '../../Types/aseo/ConfiguracionAseo';

// Hook personalizado para obtener configuración
export const useConfiguracionAseo = () => {
  const query = useConfiguracionAseoBase();

  return {
    configuracion: query.data,
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error?.message || 'Error al cargar la configuración',
    refetch: query.refetch,
    isSuccess: query.isSuccess,
  };
};

// Hook personalizado para actualizar configuración
export const useUpdateConfiguracionAseo = () => {
  const mutation = useUpdateConfiguracionAseoBase();

  const updateConfiguracion = (data: UpdateConfiguracionAseoDto) => {
    mutation.mutate(data);
  };

  return {
    updateConfiguracion,
    isUpdating: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error?.message || 'Error al actualizar la configuración',
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
    updatedData: mutation.data,
  };
};

// Hook combinado para manejo completo de configuración
export const useConfiguracionAseoManager = () => {
  const configQuery = useConfiguracionAseo();
  const updateMutation = useUpdateConfiguracionAseo();

  const handleUpdate = (data: UpdateConfiguracionAseoDto) => {
    updateMutation.updateConfiguracion(data);
  };

  const isLoading = configQuery.isLoading || updateMutation.isUpdating;
  const hasError = configQuery.isError || updateMutation.isError;
  const errorMessage = configQuery.error || updateMutation.error;

  return {
    // Datos
    configuracion: configQuery.configuracion,
    
    // Estados
    isLoading,
    isError: hasError,
    error: errorMessage,
    isSuccess: updateMutation.isSuccess,
    
    // Acciones
    updateConfiguracion: handleUpdate,
    refetch: configQuery.refetch,
    reset: updateMutation.reset,
    
    // Estados específicos
    isLoadingConfig: configQuery.isLoading,
    isUpdating: updateMutation.isUpdating,
    configError: configQuery.error,
    updateError: updateMutation.error,
  };
}; 