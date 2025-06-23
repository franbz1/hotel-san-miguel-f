import { useState } from 'react';
import { 
  useRegistrosAseoHabitacion as useRegistrosAseoHabitacionBase,
  useRegistroAseoHabitacionById as useRegistroAseoHabitacionByIdBase,
  useRegistrosPorHabitacion as useRegistrosPorHabitacionBase,
  useRegistrosHabitacionPorUsuario,
  useRegistrosHabitacionPorFecha,
  useCreateRegistroAseoHabitacion as useCreateRegistroAseoHabitacionBase,
  useUpdateRegistroAseoHabitacion as useUpdateRegistroAseoHabitacionBase,
  useDeleteRegistroAseoHabitacion as useDeleteRegistroAseoHabitacionBase,
} from '../../lib/aseo';
import { 
  CreateRegistroAseoHabitacionDto, 
  UpdateRegistroAseoHabitacionDto, 
  FiltrosRegistroAseoHabitacionDto 
} from '../../Types/aseo/RegistroAseoHabitacion';
import { TiposAseo } from '../../Types/aseo/tiposAseoEnum';

// Hook personalizado para listar registros de aseo de habitaciones
export const useRegistrosAseoHabitacion = (
  limit: number = 10, 
  page: number = 1, 
  filters?: FiltrosRegistroAseoHabitacionDto
) => {
  const query = useRegistrosAseoHabitacionBase(limit, page, filters);

  return {
    registros: query.data?.data || [],
    meta: query.data?.meta,
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error?.message,
    refetch: query.refetch,
    isSuccess: query.isSuccess,
  };
};

// Hook personalizado para obtener registro por ID
export const useRegistroAseoHabitacion = (id: number, enabled: boolean = true) => {
  const query = useRegistroAseoHabitacionByIdBase(id, enabled);

  return {
    registro: query.data,
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error?.message,
    refetch: query.refetch,
    isSuccess: query.isSuccess,
  };
};

// Hook personalizado para registros por habitación
export const useRegistrosPorHabitacion = (habitacionId: number, enabled: boolean = true) => {
  const query = useRegistrosPorHabitacionBase(habitacionId, enabled);

  return {
    registros: query.data || [],
    count: query.data?.length || 0,
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error?.message || `Error al cargar registros de la habitación ${habitacionId}`,
    refetch: query.refetch,
    isSuccess: query.isSuccess,
  };
};

// Hook personalizado para registros por usuario
export const useRegistrosPorUsuario = (usuarioId: number, enabled: boolean = true) => {
  const query = useRegistrosHabitacionPorUsuario(usuarioId, enabled);

  return {
    registros: query.data || [],
    count: query.data?.length || 0,
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error?.message || `Error al cargar registros del usuario ${usuarioId}`,
    refetch: query.refetch,
    isSuccess: query.isSuccess,
  };
};

// Hook personalizado para registros por fecha
export const useRegistrosPorFecha = (fecha: string, enabled: boolean = true) => {
  const query = useRegistrosHabitacionPorFecha(fecha, enabled);

  return {
    registros: query.data || [],
    count: query.data?.length || 0,
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error?.message || `Error al cargar registros del ${fecha}`,
    refetch: query.refetch,
    isSuccess: query.isSuccess,
  };
};

// Hook personalizado para crear registro
export const useCreateRegistroAseoHabitacion = () => {
  const mutation = useCreateRegistroAseoHabitacionBase();

  const createRegistro = (data: CreateRegistroAseoHabitacionDto) => {
    mutation.mutate(data);
  };

  return {
    createRegistro,
    isCreating: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error?.message,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
    createdRegistro: mutation.data,
  };
};

// Hook personalizado para actualizar registro
export const useUpdateRegistroAseoHabitacion = () => {
  const mutation = useUpdateRegistroAseoHabitacionBase();

  const updateRegistro = (id: number, data: UpdateRegistroAseoHabitacionDto) => {
    mutation.mutate({ id, data });
  };

  return {
    updateRegistro,
    isUpdating: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error?.message,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
    updatedRegistro: mutation.data,
  };
};

// Hook personalizado para eliminar registro
export const useDeleteRegistroAseoHabitacion = () => {
  const mutation = useDeleteRegistroAseoHabitacionBase();

  const deleteRegistro = (id: number) => {
    mutation.mutate(id);
  };

  return {
    deleteRegistro,
    isDeleting: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error?.message,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
    deletedRegistro: mutation.data,
  };
};

// Hook combinado para manejo completo de registros de aseo de habitaciones
export const useRegistrosAseoHabitacionManager = (initialLimit: number = 10) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);
  const [filters, setFilters] = useState<FiltrosRegistroAseoHabitacionDto>({});

  const listQuery = useRegistrosAseoHabitacion(limit, page, filters);
  const createMutation = useCreateRegistroAseoHabitacion();
  const updateMutation = useUpdateRegistroAseoHabitacion();
  const deleteMutation = useDeleteRegistroAseoHabitacion();

  const isLoading = listQuery.isLoading || createMutation.isCreating || 
                   updateMutation.isUpdating || deleteMutation.isDeleting;

  const hasError = listQuery.isError || createMutation.isError || 
                  updateMutation.isError || deleteMutation.isError;

  const errorMessage = listQuery.error || createMutation.error || 
                      updateMutation.error || deleteMutation.error;

  // Filtros helpers
  const filterByHabitacion = (habitacionId: number) => {
    setFilters(prev => ({ ...prev, habitacionId }));
  };

  const filterByUsuario = (usuarioId: number) => {
    setFilters(prev => ({ ...prev, usuarioId }));
  };

  const filterByFecha = (fecha: string) => {
    setFilters(prev => ({ ...prev, fecha }));
  };

  const filterByTipoAseo = (tipo_aseo: TiposAseo) => {
    setFilters(prev => ({ ...prev, tipo_aseo }));
  };

  return {
    // Datos
    registros: listQuery.registros,
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
    filterByHabitacion,
    filterByUsuario,
    filterByFecha,
    filterByTipoAseo,
    
    // Acciones
    createRegistro: createMutation.createRegistro,
    updateRegistro: updateMutation.updateRegistro,
    deleteRegistro: deleteMutation.deleteRegistro,
    refetch: listQuery.refetch,
    
    // Estados específicos
    isLoadingList: listQuery.isLoading,
    isCreating: createMutation.isCreating,
    isUpdating: updateMutation.isUpdating,
    isDeleting: deleteMutation.isDeleting,
    
    // Resultados de operaciones
    createdRegistro: createMutation.createdRegistro,
    updatedRegistro: updateMutation.updatedRegistro,
    deletedRegistro: deleteMutation.deletedRegistro,
    
    // Reset functions
    resetCreate: createMutation.reset,
    resetUpdate: updateMutation.reset,
    resetDelete: deleteMutation.reset,
  };
}; 