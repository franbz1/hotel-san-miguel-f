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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 min-w-0">
            <FileText className="h-6 w-6 flex-shrink-0" />
            <span className="truncate">Reportes de Aseo Diario</span>
          </h1>
          <p className="text-muted-foreground break-words">
            Gestiona y consulta los reportes de aseo del hotel
          </p>
        </div>

        <div className="flex w-full sm:w-auto flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={`w-full sm:w-auto ${hasActiveFilters ? 'border-blue-500 text-blue-600' : ''}`}
            aria-pressed={showFilters}
          >
            <Filter className="h-4 w-4 mr-2" />
            <span>Filtros</span>
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
              <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)} aria-label="Cerrar filtros">
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleFilterSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                <div className="space-y-2 w-full">
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
                    className="w-full"
                  />
                </div>

                <div className="space-y-2 w-full">
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
                    className="w-full"
                  />
                </div>

                <div className="space-y-2 w-full">
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
                    className="w-full"
                  />
                </div>

                <div className="space-y-2 w-full">
                  <Label htmlFor="elemento_aseo">Elemento de Aseo</Label>
                  <Input
                    id="elemento_aseo"
                    placeholder="Ej: Escoba, Trapeador..."
                    value={tempFilters.elemento_aseo || ''}
                    onChange={(e) => setTempFilters(prev => ({ ...prev, elemento_aseo: e.target.value || undefined }))}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2 w-full">
                  <Label htmlFor="producto_quimico">Producto Químico</Label>
                  <Input
                    id="producto_quimico"
                    placeholder="Ej: Detergente, Desinfectante..."
                    value={tempFilters.producto_quimico || ''}
                    onChange={(e) => setTempFilters(prev => ({ ...prev, producto_quimico: e.target.value || undefined }))}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2 w-full">
                  <Label htmlFor="elemento_proteccion">Elemento de Protección</Label>
                  <Input
                    id="elemento_proteccion"
                    placeholder="Ej: Guantes, Mascarilla..."
                    value={tempFilters.elemento_proteccion || ''}
                    onChange={(e) => setTempFilters(prev => ({ ...prev, elemento_proteccion: e.target.value || undefined }))}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex w-full flex-col sm:flex-row justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={handleClearFilters} className="w-full sm:w-auto">
                  Limpiar Filtros
                </Button>
                <Button type="submit" className="w-full sm:w-auto">
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
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtros activos:</span>

          <div className="flex flex-wrap gap-2 items-center">
            {filters.fecha && (
              <Badge variant="secondary" className="gap-1">
                Fecha: {safeFormatDate(filters.fecha, 'dd/MM/yyyy')}
                <button onClick={() => setFilters(prev => ({ ...prev, fecha: undefined }))} className="ml-1 hover:text-red-600" aria-label="Eliminar filtro fecha">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {filters.fecha_inicio && filters.fecha_fin && (
              <Badge variant="secondary" className="gap-1">
                Rango: {safeFormatDate(filters.fecha_inicio, 'dd/MM/yyyy')} - {safeFormatDate(filters.fecha_fin, 'dd/MM/yyyy')}
                <button onClick={() => setFilters(prev => ({ ...prev, fecha_inicio: undefined, fecha_fin: undefined }))} className="ml-1 hover:text-red-600" aria-label="Eliminar rango">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {filters.elemento_aseo && (
              <Badge variant="secondary" className="gap-1">
                Elemento: {filters.elemento_aseo}
                <button onClick={() => setFilters(prev => ({ ...prev, elemento_aseo: undefined }))} className="ml-1 hover:text-red-600" aria-label="Eliminar filtro elemento">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {filters.producto_quimico && (
              <Badge variant="secondary" className="gap-1">
                Producto: {filters.producto_quimico}
                <button onClick={() => setFilters(prev => ({ ...prev, producto_quimico: undefined }))} className="ml-1 hover:text-red-600" aria-label="Eliminar filtro producto">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {filters.elemento_proteccion && (
              <Badge variant="secondary" className="gap-1">
                Protección: {filters.elemento_proteccion}
                <button onClick={() => setFilters(prev => ({ ...prev, elemento_proteccion: undefined }))} className="ml-1 hover:text-red-600" aria-label="Eliminar filtro protección">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            <Button variant="ghost" size="sm" onClick={handleClearFilters} className="text-red-600 hover:text-red-700">
              <X className="h-4 w-4 mr-1" />
              Limpiar todos
            </Button>
          </div>
        </div>
      )}

      {/* Tabla de reportes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2 w-full">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span className="font-medium">Reportes de Aseo</span>
              {meta && (
                <Badge variant="secondary" className="ml-2">
                  {meta.total} reportes
                </Badge>
              )}
            </div>

            <div>{isLoading && <LoadingSpinner />}</div>
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
                {hasActiveFilters ? 'No se encontraron reportes con los filtros aplicados' : 'Aún no se han generado reportes de aseo'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Table para md+ */}
              <div className="hidden md:block overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha del Reporte</TableHead>
                      <TableHead>Elementos de Aseo</TableHead>
                      <TableHead className="hidden lg:table-cell">Productos Químicos</TableHead>
                      <TableHead className="hidden lg:table-cell">Resumen</TableHead>
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
                            {reporte.elementos_aseo.slice(0, 3).map((elemento, index) => (
                              <Badge key={index} variant="outline" className="text-xs">{elemento}</Badge>
                            ))}
                            {reporte.elementos_aseo.length > 3 && (
                              <Badge variant="outline" className="text-xs">+{reporte.elementos_aseo.length - 3} más</Badge>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="hidden lg:table-cell">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {reporte.productos_quimicos.slice(0, 2).map((producto, index) => (
                              <Badge key={index} variant="outline" className="text-xs">{producto}</Badge>
                            ))}
                            {reporte.productos_quimicos.length > 2 && (
                              <Badge variant="outline" className="text-xs">+{reporte.productos_quimicos.length - 2} más</Badge>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="hidden lg:table-cell">
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                              <span>{reporte.datos?.resumen?.total_habitaciones_aseadas || 0} hab.</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                              <span>{reporte.datos?.resumen?.total_zonas_comunes_aseadas || 0} zonas</span>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="text-sm">
                            {safeFormatDate(reporte.createdAt, 'dd/MM/yyyy HH:mm')}
                          </div>
                        </TableCell>

                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => handleViewReport(reporte.id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalles
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile: Cards */}
              <div className="md:hidden space-y-3">
                {reportes.map((reporte) => (
                  <Card key={reporte.id} className="p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-medium truncate">
                          {safeFormatDate(reporte.fecha, "EEEE, d 'de' MMMM", { locale: es })}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {safeFormatDate(reporte.fecha, 'dd/MM/yyyy')} • {safeFormatDate(reporte.createdAt, 'HH:mm')}
                        </div>

                        <div className="mt-2 flex flex-wrap gap-2">
                          {reporte.elementos_aseo.slice(0, 2).map((el, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{el}</Badge>
                          ))}
                          {reporte.elementos_aseo.length > 2 && <Badge variant="outline" className="text-xs">+{reporte.elementos_aseo.length - 2}</Badge>}

                          {reporte.productos_quimicos.slice(0, 1).map((p, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{p}</Badge>
                          ))}
                        </div>

                        <div className="mt-2 text-xs text-muted-foreground grid grid-cols-2 gap-2">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            <span>{reporte.datos?.resumen?.total_habitaciones_aseadas || 0} hab.</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            <span>{reporte.datos?.resumen?.total_zonas_comunes_aseadas || 0} zonas</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewReport(reporte.id)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Paginación */}
              {meta && meta.total > 1 && (
                <div className="mt-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-muted-foreground">
                      Mostrando {((page - 1) * limit) + 1} a {Math.min(page * limit, meta.total)} de {meta.total} reportes
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
                      <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page <= 1} className="w-full sm:w-auto">
                        Anterior
                      </Button>

                      <span className="text-sm">Página {page} de {meta.lastPage}</span>

                      <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page >= meta.lastPage} className="w-full sm:w-auto">
                        Siguiente
                      </Button>
                    </div>
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