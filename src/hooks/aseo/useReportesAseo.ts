import { useState } from 'react';
import { 
  useReportesAseo as useReportesAseoBase,
  useReporteAseoById as useReporteAseoByIdBase,
  useReportePorFecha as useReportePorFechaBase,
  useCreateReporteAseo as useCreateReporteAseoBase,
  useUpdateReporteAseo as useUpdateReporteAseoBase,
  useDeleteReporteAseo as useDeleteReporteAseoBase,
  useGenerarReporteAseo as useGenerarReporteAseoBase,
} from '../../lib/aseo/reporte-aseo-service';
import { 
  CreateReporteAseoDiarioDto, 
  UpdateReporteAseoDiarioDto, 
  FiltrosReportesAseoDto 
} from '../../Types/aseo/ReporteAseoDiario';

// Hook personalizado para listar reportes de aseo
export const useReportesAseo = (
  limit: number = 10, 
  page: number = 1, 
  filters?: FiltrosReportesAseoDto
) => {
  const query = useReportesAseoBase(limit, page, filters);

  return {
    reportes: query.data?.data || [],
    meta: query.data?.meta,
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error?.message || 'Error al cargar los reportes de aseo',
    refetch: query.refetch,
    isSuccess: query.isSuccess,
  };
};

// Hook personalizado para obtener reporte por ID
export const useReporteAseo = (id: number, enabled: boolean = true) => {
  const query = useReporteAseoByIdBase(id, enabled);

  return {
    reporte: query.data,
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error?.message || 'Error al cargar el reporte de aseo',
    refetch: query.refetch,
    isSuccess: query.isSuccess,
  };
};

// Hook personalizado para obtener reporte por fecha
export const useReportePorFecha = (fecha: string, enabled: boolean = true) => {
  const query = useReportePorFechaBase(fecha, enabled);

  return {
    reporte: query.data,
    existe: !!query.data,
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error?.message || `Error al cargar el reporte del ${fecha}`,
    refetch: query.refetch,
    isSuccess: query.isSuccess,
  };
};

// Hook personalizado para crear reporte
export const useCreateReporteAseo = () => {
  const mutation = useCreateReporteAseoBase();

  const createReporte = (data: CreateReporteAseoDiarioDto) => {
    mutation.mutate(data);
  };

  return {
    createReporte,
    isCreating: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error?.message || 'Error al crear el reporte de aseo',
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
    createdReporte: mutation.data,
  };
};

// Hook personalizado para actualizar reporte
export const useUpdateReporteAseo = () => {
  const mutation = useUpdateReporteAseoBase();

  const updateReporte = (id: number, data: UpdateReporteAseoDiarioDto) => {
    mutation.mutate({ id, data });
  };

  return {
    updateReporte,
    isUpdating: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error?.message || 'Error al actualizar el reporte de aseo',
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
    updatedReporte: mutation.data,
  };
};

// Hook personalizado para eliminar reporte
export const useDeleteReporteAseo = () => {
  const mutation = useDeleteReporteAseoBase();

  const deleteReporte = (id: number) => {
    mutation.mutate(id);
  };

  return {
    deleteReporte,
    isDeleting: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error?.message || 'Error al eliminar el reporte de aseo',
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
    deletedReporte: mutation.data,
  };
};

// Hook personalizado para generar reporte automático
export const useGenerarReporteAseo = () => {
  const mutation = useGenerarReporteAseoBase();

  const generarReporte = (fecha: string) => {
    mutation.mutate(fecha);
  };

  return {
    generarReporte,
    isGenerating: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error?.message || 'Error al generar el reporte de aseo',
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
    generatedReporte: mutation.data,
  };
};

// Hook combinado para manejo completo de reportes de aseo
export const useReportesAseoManager = (initialLimit: number = 10) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);
  const [filters, setFilters] = useState<FiltrosReportesAseoDto>({});

  const listQuery = useReportesAseo(limit, page, filters);
  const createMutation = useCreateReporteAseo();
  const updateMutation = useUpdateReporteAseo();
  const deleteMutation = useDeleteReporteAseo();
  const generateMutation = useGenerarReporteAseo();

  const isLoading = listQuery.isLoading || createMutation.isCreating || 
                   updateMutation.isUpdating || deleteMutation.isDeleting ||
                   generateMutation.isGenerating;

  const hasError = listQuery.isError || createMutation.isError || 
                  updateMutation.isError || deleteMutation.isError ||
                  generateMutation.isError;

  const errorMessage = listQuery.error || createMutation.error || 
                      updateMutation.error || deleteMutation.error ||
                      generateMutation.error;

  // Filtros helpers
  const filterByFecha = (fecha: string) => {
    setFilters(prev => ({ ...prev, fecha }));
  };

  const filterByRangoFechas = (fecha_inicio: string, fecha_fin: string) => {
    setFilters(prev => ({ ...prev, fecha_inicio, fecha_fin, fecha: undefined }));
  };

  const filterByElementoAseo = (elemento_aseo: string) => {
    setFilters(prev => ({ ...prev, elemento_aseo }));
  };

  const filterByProductoQuimico = (producto_quimico: string) => {
    setFilters(prev => ({ ...prev, producto_quimico }));
  };

  const filterByElementoProteccion = (elemento_proteccion: string) => {
    setFilters(prev => ({ ...prev, elemento_proteccion }));
  };

  return {
    // Datos
    reportes: listQuery.reportes,
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
    filterByFecha,
    filterByRangoFechas,
    filterByElementoAseo,
    filterByProductoQuimico,
    filterByElementoProteccion,
    
    // Acciones
    createReporte: createMutation.createReporte,
    updateReporte: updateMutation.updateReporte,
    deleteReporte: deleteMutation.deleteReporte,
    generarReporte: generateMutation.generarReporte,
    refetch: listQuery.refetch,
    
    // Estados específicos
    isLoadingList: listQuery.isLoading,
    isCreating: createMutation.isCreating,
    isUpdating: updateMutation.isUpdating,
    isDeleting: deleteMutation.isDeleting,
    isGenerating: generateMutation.isGenerating,
    
    // Resultados de operaciones
    createdReporte: createMutation.createdReporte,
    updatedReporte: updateMutation.updatedReporte,
    deletedReporte: deleteMutation.deletedReporte,
    generatedReporte: generateMutation.generatedReporte,
    
    // Reset functions
    resetCreate: createMutation.reset,
    resetUpdate: updateMutation.reset,
    resetDelete: deleteMutation.reset,
    resetGenerate: generateMutation.reset,
  };
};

// Hook especializado para dashboard de reportes
export const useReportesAseoDashboard = () => {
  const today = new Date().toISOString().split('T')[0];
  const reporteHoy = useReportePorFecha(today);
  const generarMutation = useGenerarReporteAseo();

  const generarReporteHoy = () => {
    generarMutation.generarReporte(today);
  };

  return {
    // Reporte de hoy
    reporteHoy: reporteHoy.reporte,
    existeReporteHoy: reporteHoy.existe,
    isLoadingReporteHoy: reporteHoy.isLoading,
    errorReporteHoy: reporteHoy.error,
    
    // Generación automática
    generarReporteHoy,
    isGenerating: generarMutation.isGenerating,
    isSuccess: generarMutation.isSuccess,
    errorGenerar: generarMutation.error,
    reporteGenerado: generarMutation.generatedReporte,
    
    // Acciones
    refetchReporteHoy: reporteHoy.refetch,
    resetGenerar: generarMutation.reset,
    
    // Estado general
    isLoading: reporteHoy.isLoading || generarMutation.isGenerating,
    hasError: reporteHoy.isError || generarMutation.isError,
    error: reporteHoy.error || generarMutation.error,
  };
}; 