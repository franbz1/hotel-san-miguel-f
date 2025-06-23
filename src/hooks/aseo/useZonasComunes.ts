import { useState } from 'react';
import { 
  useZonasComunes as useZonasComunesBase,
  useZonaComunById as useZonaComunByIdBase,
  useZonasRequierenAseo as useZonasRequierenAseoBase,
  useZonasPorPiso as useZonasPorPisoBase,
  useCreateZonaComun as useCreateZonaComunBase,
  useUpdateZonaComun as useUpdateZonaComunBase,
  useDeleteZonaComun as useDeleteZonaComunBase,
} from '../../lib/aseo/zona-comun-service';
import { 
  CreateZonaComunDto, 
  UpdateZonaComunDto, 
  FiltrosZonaComunDto 
} from '../../Types/zonasComunes';

// Hook personalizado para listar zonas comunes
export const useZonasComunes = (
  limit: number = 10, 
  page: number = 1, 
  filters?: FiltrosZonaComunDto
) => {
  const query = useZonasComunesBase(limit, page, filters);

  return {
    zonas: query.data?.data || [],
    meta: query.data?.meta,
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error?.message,
    refetch: query.refetch,
    isSuccess: query.isSuccess,
  };
};

// Hook personalizado para obtener zona común por ID
export const useZonaComun = (id: number, enabled: boolean = true) => {
  const query = useZonaComunByIdBase(id, enabled);

  return {
    zona: query.data,
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error?.message,
    refetch: query.refetch,
    isSuccess: query.isSuccess,
  };
};

// Hook personalizado para zonas que requieren aseo
export const useZonasRequierenAseo = () => {
  const query = useZonasRequierenAseoBase();

  return {
    zonasRequierenAseo: query.data || [],
    count: query.data?.length || 0,
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error?.message,
    refetch: query.refetch,
    isSuccess: query.isSuccess,
  };
};

// Hook personalizado para zonas por piso
export const useZonasPorPiso = (piso: number, enabled: boolean = true) => {
  const query = useZonasPorPisoBase(piso, enabled);

  return {
    zonasPiso: query.data || [],
    count: query.data?.length || 0,
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error?.message,
    refetch: query.refetch,
    isSuccess: query.isSuccess,
  };
};

// Hook personalizado para crear zona común
export const useCreateZonaComun = () => {
  const mutation = useCreateZonaComunBase();

  const createZona = (data: CreateZonaComunDto) => {
    mutation.mutate(data);
  };

  return {
    createZona,
    isCreating: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error?.message,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
    createdZona: mutation.data,
  };
};

// Hook personalizado para actualizar zona común
export const useUpdateZonaComun = () => {
  const mutation = useUpdateZonaComunBase();

  const updateZona = (id: number, data: UpdateZonaComunDto) => {
    mutation.mutate({ id, data });
  };

  return {
    updateZona,
    isUpdating: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error?.message,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
    updatedZona: mutation.data,
  };
};

// Hook personalizado para eliminar zona común
export const useDeleteZonaComun = () => {
  const mutation = useDeleteZonaComunBase();

  const deleteZona = (id: number) => {
    mutation.mutate(id);
  };

  return {
    deleteZona,
    isDeleting: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error?.message,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
    deletedZona: mutation.data,
  };
};

// Hook combinado para manejo completo de zonas comunes
export const useZonasComunesManager = (initialLimit: number = 10) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);
  const [filters, setFilters] = useState<FiltrosZonaComunDto>({});

  const listQuery = useZonasComunes(limit, page, filters);
  const createMutation = useCreateZonaComun();
  const updateMutation = useUpdateZonaComun();
  const deleteMutation = useDeleteZonaComun();

  const isLoading = listQuery.isLoading || createMutation.isCreating || 
                   updateMutation.isUpdating || deleteMutation.isDeleting;

  const hasError = listQuery.isError || createMutation.isError || 
                  updateMutation.isError || deleteMutation.isError;

  const errorMessage = listQuery.error || createMutation.error || 
                      updateMutation.error || deleteMutation.error;

  return {
    // Datos
    zonas: listQuery.zonas,
    meta: listQuery.meta,
    
    // Estados
    isLoading,
    isError: hasError,
    error: errorMessage,
    
    // Paginación
    page,
    limit,
    setPage,
    setLimit,
    
    // Filtros
    filters,
    setFilters,
    clearFilters: () => setFilters({}),
    
    // Acciones
    createZona: createMutation.createZona,
    updateZona: updateMutation.updateZona,
    deleteZona: deleteMutation.deleteZona,
    refetch: listQuery.refetch,
    
    // Estados específicos
    isLoadingList: listQuery.isLoading,
    isCreating: createMutation.isCreating,
    isUpdating: updateMutation.isUpdating,
    isDeleting: deleteMutation.isDeleting,
    
    // Resultados de operaciones
    createdZona: createMutation.createdZona,
    updatedZona: updateMutation.updatedZona,
    deletedZona: deleteMutation.deletedZona,
    
    // Reset functions
    resetCreate: createMutation.reset,
    resetUpdate: updateMutation.reset,
    resetDelete: deleteMutation.reset,
  };
}; 