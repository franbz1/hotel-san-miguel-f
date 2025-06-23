import { useState } from 'react';
import { 
  useHabitacionesAseo as useHabitacionesAseoBase,
} from '../../lib/aseo/habitaciones-aseo-service';
import { 
  FiltrosAseoHabitacionDto 
} from '../../Types/aseo/HabitacionAseo';
import { TiposAseo } from '../../Types/aseo/tiposAseoEnum';

// Hook personalizado para listar habitaciones para aseo
export const useHabitacionesAseo = (
  limit: number = 10, 
  page: number = 1, 
  filters?: FiltrosAseoHabitacionDto
) => {
  const query = useHabitacionesAseoBase(limit, page, filters);

  return {
    habitaciones: query.data?.data || [],
    meta: query.data?.meta,
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error?.message,
    refetch: query.refetch,
    isSuccess: query.isSuccess,
  };
};

// Hook combinado para manejo completo de habitaciones de aseo
export const useHabitacionesAseoManager = (initialLimit: number = 10) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);
  const [filters, setFilters] = useState<FiltrosAseoHabitacionDto>({});

  const listQuery = useHabitacionesAseo(limit, page, filters);

  // Filtros helpers
  const filterByRequiereAseoHoy = (requerido_aseo_hoy: boolean) => {
    setFilters(prev => ({ ...prev, requerido_aseo_hoy }));
  };

  const filterByRequiereDesinfeccionHoy = (requerido_desinfeccion_hoy: boolean) => {
    setFilters(prev => ({ ...prev, requerido_desinfeccion_hoy }));
  };

  const filterByRequiereRotacionColchones = (requerido_rotacion_colchones: boolean) => {
    setFilters(prev => ({ ...prev, requerido_rotacion_colchones }));
  };

  const filterByUltimoAseoTipo = (ultimo_aseo_tipo: TiposAseo) => {
    setFilters(prev => ({ ...prev, ultimo_aseo_tipo }));
  };

  return {
    // Datos
    habitaciones: listQuery.habitaciones,
    meta: listQuery.meta,
    
    // Estados
    isLoading: listQuery.isLoading,
    isError: listQuery.isError,
    error: listQuery.error,
    
    // Paginación
    page,
    limit,
    setPage,
    setLimit,
    
    // Filtros
    filters,
    setFilters,
    clearFilters: () => setFilters({}),
    filterByRequiereAseoHoy,
    filterByRequiereDesinfeccionHoy,
    filterByRequiereRotacionColchones,
    filterByUltimoAseoTipo,
    
    // Acciones
    refetch: listQuery.refetch,
  };
};

// Hook especializado para dashboard de habitaciones que requieren aseo
export const useHabitacionesAseoDashboard = () => {
  const habitacionesRequierenAseo = useHabitacionesAseo(50, 1, { 
    requerido_aseo_hoy: true 
  });
  
  const habitacionesRequierenDesinfeccion = useHabitacionesAseo(50, 1, { 
    requerido_desinfeccion_hoy: true 
  });
  
  const habitacionesRequierenRotacion = useHabitacionesAseo(50, 1, { 
    requerido_rotacion_colchones: true 
  });

  return {
    // Habitaciones que requieren aseo hoy
    habitacionesAseoHoy: habitacionesRequierenAseo.habitaciones,
    countAseoHoy: habitacionesRequierenAseo.meta?.total || 0,
    isLoadingAseoHoy: habitacionesRequierenAseo.isLoading,
    errorAseoHoy: habitacionesRequierenAseo.error,
    
    // Habitaciones que requieren desinfección hoy
    habitacionesDesinfeccionHoy: habitacionesRequierenDesinfeccion.habitaciones,
    countDesinfeccionHoy: habitacionesRequierenDesinfeccion.meta?.total || 0,
    isLoadingDesinfeccionHoy: habitacionesRequierenDesinfeccion.isLoading,
    errorDesinfeccionHoy: habitacionesRequierenDesinfeccion.error,
    
    // Habitaciones que requieren rotación de colchones
    habitacionesRotacionColchones: habitacionesRequierenRotacion.habitaciones,
    countRotacionColchones: habitacionesRequierenRotacion.meta?.total || 0,
    isLoadingRotacionColchones: habitacionesRequierenRotacion.isLoading,
    errorRotacionColchones: habitacionesRequierenRotacion.error,
    
    // Acciones
    refetchAseoHoy: habitacionesRequierenAseo.refetch,
    refetchDesinfeccionHoy: habitacionesRequierenDesinfeccion.refetch,
    refetchRotacionColchones: habitacionesRequierenRotacion.refetch,
    
    // Estado general
    isLoading: habitacionesRequierenAseo.isLoading || 
               habitacionesRequierenDesinfeccion.isLoading || 
               habitacionesRequierenRotacion.isLoading,
    hasError: habitacionesRequierenAseo.isError || 
              habitacionesRequierenDesinfeccion.isError || 
              habitacionesRequierenRotacion.isError,
    error: habitacionesRequierenAseo.error || 
           habitacionesRequierenDesinfeccion.error || 
           habitacionesRequierenRotacion.error,
  };
}; 