'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  FileText, 
  Search, 
  Filter, 
  Calendar,
  Eye,
  RefreshCw,
  X
} from 'lucide-react';
import { format, isValid } from 'date-fns';
import { es } from 'date-fns/locale';
import { useReportesAseoManager } from '@/hooks/aseo/useReportesAseo';
import { FiltrosReportesAseoDto } from '@/Types/aseo/ReporteAseoDiario';

export default function ReportesAseoPage() {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [tempFilters, setTempFilters] = useState<FiltrosReportesAseoDto>({});

  // Helper para formatear fechas de forma segura
  const safeFormatDate = (date: string | Date, formatStr: string, options?: { locale?: typeof es }) => {
    try {
      const dateObj = new Date(date);
      if (!isValid(dateObj)) {
        return 'Fecha inválida';
      }
      return format(dateObj, formatStr, options);
    } catch {
      return 'Fecha inválida';
    }
  };

  const {
    reportes,
    meta,
    isLoading,
    isError,
    error,
    page,
    limit,
    setPage,
    filters,
    setFilters,
    clearFilters,
    refetch
  } = useReportesAseoManager(10);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(tempFilters);
    setPage(1); // Reset a la primera página
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setTempFilters({});
    clearFilters();
    setPage(1);
    setShowFilters(false);
  };

  const handleViewReport = (reporteId: number) => {
    router.push(`/aseo/reportes/${reporteId}`);
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  if (isError) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error al cargar reportes</h3>
          <p className="text-muted-foreground mb-4">
            {error || 'No se pudieron cargar los reportes de aseo'}
          </p>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Reportes de Aseo Diario
          </h1>
          <p className="text-muted-foreground">
            Gestiona y consulta los reportes de aseo del hotel
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={hasActiveFilters ? 'border-blue-500 text-blue-600' : ''}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                {Object.keys(filters).length}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Filtros */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Filtros de Búsqueda
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFilterSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fecha">Fecha Específica</Label>
                  <Input
                    id="fecha"
                    type="date"
                    value={tempFilters.fecha || ''}
                    onChange={(e) => setTempFilters(prev => ({
                      ...prev,
                      fecha: e.target.value || undefined,
                      fecha_inicio: undefined,
                      fecha_fin: undefined
                    }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fecha_inicio">Fecha Inicio</Label>
                  <Input
                    id="fecha_inicio"
                    type="date"
                    value={tempFilters.fecha_inicio || ''}
                    onChange={(e) => setTempFilters(prev => ({
                      ...prev,
                      fecha_inicio: e.target.value || undefined,
                      fecha: undefined
                    }))}
                    disabled={!!tempFilters.fecha}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fecha_fin">Fecha Fin</Label>
                  <Input
                    id="fecha_fin"
                    type="date"
                    value={tempFilters.fecha_fin || ''}
                    onChange={(e) => setTempFilters(prev => ({
                      ...prev,
                      fecha_fin: e.target.value || undefined,
                      fecha: undefined
                    }))}
                    disabled={!!tempFilters.fecha}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="elemento_aseo">Elemento de Aseo</Label>
                  <Input
                    id="elemento_aseo"
                    placeholder="Ej: Escoba, Trapeador..."
                    value={tempFilters.elemento_aseo || ''}
                    onChange={(e) => setTempFilters(prev => ({
                      ...prev,
                      elemento_aseo: e.target.value || undefined
                    }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="producto_quimico">Producto Químico</Label>
                  <Input
                    id="producto_quimico"
                    placeholder="Ej: Detergente, Desinfectante..."
                    value={tempFilters.producto_quimico || ''}
                    onChange={(e) => setTempFilters(prev => ({
                      ...prev,
                      producto_quimico: e.target.value || undefined
                    }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="elemento_proteccion">Elemento de Protección</Label>
                  <Input
                    id="elemento_proteccion"
                    placeholder="Ej: Guantes, Mascarilla..."
                    value={tempFilters.elemento_proteccion || ''}
                    onChange={(e) => setTempFilters(prev => ({
                      ...prev,
                      elemento_proteccion: e.target.value || undefined
                    }))}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={handleClearFilters}>
                  Limpiar Filtros
                </Button>
                <Button type="submit">
                  <Search className="h-4 w-4 mr-2" />
                  Aplicar Filtros
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filtros activos */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Filtros activos:</span>
          {filters.fecha && (
            <Badge variant="secondary" className="gap-1">
              Fecha: {safeFormatDate(filters.fecha, 'dd/MM/yyyy')}
              <button
                onClick={() => setFilters(prev => ({ ...prev, fecha: undefined }))}
                className="ml-1 hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.fecha_inicio && filters.fecha_fin && (
            <Badge variant="secondary" className="gap-1">
              Rango: {safeFormatDate(filters.fecha_inicio, 'dd/MM/yyyy')} - {safeFormatDate(filters.fecha_fin, 'dd/MM/yyyy')}
              <button
                onClick={() => setFilters(prev => ({ ...prev, fecha_inicio: undefined, fecha_fin: undefined }))}
                className="ml-1 hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.elemento_aseo && (
            <Badge variant="secondary" className="gap-1">
              Elemento: {filters.elemento_aseo}
              <button
                onClick={() => setFilters(prev => ({ ...prev, elemento_aseo: undefined }))}
                className="ml-1 hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.producto_quimico && (
            <Badge variant="secondary" className="gap-1">
              Producto: {filters.producto_quimico}
              <button
                onClick={() => setFilters(prev => ({ ...prev, producto_quimico: undefined }))}
                className="ml-1 hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.elemento_proteccion && (
            <Badge variant="secondary" className="gap-1">
              Protección: {filters.elemento_proteccion}
              <button
                onClick={() => setFilters(prev => ({ ...prev, elemento_proteccion: undefined }))}
                className="ml-1 hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-red-600 hover:text-red-700"
          >
            <X className="h-4 w-4 mr-1" />
            Limpiar todos
          </Button>
        </div>
      )}

      {/* Tabla de reportes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Reportes de Aseo
              {meta && (
                <Badge variant="secondary">
                  {meta.total} reportes
                </Badge>
              )}
            </span>
            {isLoading && <LoadingSpinner />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <LoadingSpinner />
                <p className="text-muted-foreground">Cargando reportes...</p>
              </div>
            </div>
          ) : reportes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay reportes</h3>
              <p className="text-muted-foreground mb-4">
                {hasActiveFilters 
                  ? 'No se encontraron reportes con los filtros aplicados'
                  : 'Aún no se han generado reportes de aseo'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha del Reporte</TableHead>
                      <TableHead>Elementos de Aseo</TableHead>
                      <TableHead>Productos Químicos</TableHead>
                      <TableHead>Resumen</TableHead>
                      <TableHead>Creado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportes.map((reporte) => (
                      <TableRow key={reporte.id}>
                        <TableCell>
                          <div className="font-medium">
                            {safeFormatDate(reporte.fecha, "EEEE, d 'de' MMMM", { locale: es })}
                          </div>
                          <div className="text-sm text-gray-500">
                            {safeFormatDate(reporte.fecha, 'dd/MM/yyyy')}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {reporte.elementos_aseo.slice(0, 2).map((elemento, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {elemento}
                              </Badge>
                            ))}
                            {reporte.elementos_aseo.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{reporte.elementos_aseo.length - 2} más
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {reporte.productos_quimicos.slice(0, 2).map((producto, index) => (
                              <Badge key={index} variant="outline" className="text-xs border-green-200 text-green-700">
                                {producto}
                              </Badge>
                            ))}
                            {reporte.productos_quimicos.length > 2 && (
                              <Badge variant="outline" className="text-xs border-green-200 text-green-700">
                                +{reporte.productos_quimicos.length - 2} más
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span>{reporte.datos?.resumen?.total_habitaciones_aseadas || 0} hab.</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span>{reporte.datos?.resumen?.total_zonas_comunes_aseadas || 0} zonas</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              <span>{reporte.datos?.resumen?.objetos_perdidos_encontrados || 0} obj.</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span>{reporte.datos?.resumen?.rastros_animales_encontrados || 0} rastros</span>
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="text-sm">
                            {safeFormatDate(reporte.createdAt, 'dd/MM/yyyy HH:mm')}
                          </div>
                        </TableCell>
                        
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewReport(reporte.id)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalles
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Paginación */}
              {meta && meta.total > 1 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Mostrando {((page - 1) * limit) + 1} a {Math.min(page * limit, meta.total)} de {meta.total} reportes
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      disabled={page <= 1}
                    >
                      Anterior
                    </Button>
                    <span className="text-sm">
                      Página {page} de {meta.lastPage}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={page >= meta.lastPage}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 