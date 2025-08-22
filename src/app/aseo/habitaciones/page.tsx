'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RefreshCw, Filter, X, Plus } from 'lucide-react';
import Link from 'next/link';
import { useHabitacionesAseoManager } from '@/hooks/aseo/useHabitacionesAseo';
import { TiposAseo } from '@/Types/aseo/tiposAseoEnum';
import { EstadoHabitacion } from '@/Types/enums/estadosHabitacion';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useAuth } from '@/contexts/auth-context';

export default function HabitacionesAseoPage() {
  const { user } = useAuth();
  const {
    habitaciones,
    meta,
    isLoading,
    isError,
    error,
    page,
    limit,
    setPage,
    setLimit,
    filters,
    clearFilters,
    filterByRequiereAseoHoy,
    filterByRequiereDesinfeccionHoy,
    filterByRequiereRotacionColchones,
    filterByUltimoAseoTipo,
    refetch
  } = useHabitacionesAseoManager(10);

  const [showFilters, setShowFilters] = useState(false);

  const handleClearFilters = () => {
    clearFilters();
    setShowFilters(false);
  };

  const getBadgeVariant = (estado: EstadoHabitacion) => {
    switch (estado) {
      case EstadoHabitacion.LIBRE:
        return 'default';
      case EstadoHabitacion.OCUPADO:
        return 'destructive';
      case EstadoHabitacion.EN_MANTENIMIENTO:
        return 'secondary';
      case EstadoHabitacion.RESERVADO:
        return 'outline';
      case EstadoHabitacion.EN_LIMPIEZA:
        return 'secondary';
      case EstadoHabitacion.EN_DESINFECCION:
        return 'secondary';
      default:
        return 'default';
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAseoStatusBadge = (requiere: boolean, tipo: string) => {
    if (requiere) {
      return <Badge variant="destructive">Requiere {tipo}</Badge>;
    }
    return <Badge variant="default">OK</Badge>;
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Habitaciones para Aseo</h1>
          <p className="text-muted-foreground">
            Gestiona y monitorea el estado de aseo de las habitaciones
          </p>
        </div>

        <div className="flex w-full sm:w-auto flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="w-full sm:w-auto"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Filtros */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtros de Búsqueda</CardTitle>
            <CardDescription>Filtra las habitaciones según criterios de aseo</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Wrapper con full width para cada select */}
              <div className="space-y-2 w-full">
                <label className="text-sm font-medium">Requiere Aseo Hoy</label>
                <Select
                  value={filters.requerido_aseo_hoy?.toString() || 'all'}
                  onValueChange={(value) => {
                    if (value === 'all') clearFilters()
                    else filterByRequiereAseoHoy(value === 'true')
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="true">Sí requiere</SelectItem>
                    <SelectItem value="false">No requiere</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 w-full">
                <label className="text-sm font-medium">Requiere Desinfección Hoy</label>
                <Select
                  value={filters.requerido_desinfeccion_hoy?.toString() || 'all'}
                  onValueChange={(value) => {
                    if (value === 'all') clearFilters()
                    else filterByRequiereDesinfeccionHoy(value === 'true')
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="true">Sí requiere</SelectItem>
                    <SelectItem value="false">No requiere</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 w-full">
                <label className="text-sm font-medium">Requiere Rotación Colchones</label>
                <Select
                  value={filters.requerido_rotacion_colchones?.toString() || 'all'}
                  onValueChange={(value) => {
                    if (value === 'all') clearFilters()
                    else filterByRequiereRotacionColchones(value === 'true')
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="true">Sí requiere</SelectItem>
                    <SelectItem value="false">No requiere</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 w-full">
                <label className="text-sm font-medium">Último Tipo de Aseo</label>
                <Select
                  value={filters.ultimo_aseo_tipo || 'all'}
                  onValueChange={(value) => {
                    if (value === 'all') clearFilters()
                    else filterByUltimoAseoTipo(value as TiposAseo)
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value={TiposAseo.LIMPIEZA}>Limpieza</SelectItem>
                    <SelectItem value={TiposAseo.DESINFECCION}>Desinfección</SelectItem>
                    <SelectItem value={TiposAseo.ROTACION_COLCHONES}>Rotación de Colchones</SelectItem>
                    <SelectItem value={TiposAseo.LIMPIEZA_BANIO}>Limpieza de Baño</SelectItem>
                    <SelectItem value={TiposAseo.DESINFECCION_BANIO}>Desinfección de Baño</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClearFilters}>
                <X className="h-4 w-4 mr-2" />
                Limpiar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Habitaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{meta?.total || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Requieren Aseo Hoy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{habitaciones.filter(h => h.requerido_aseo_hoy).length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Página Actual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{page} de {meta?.lastPage || 1}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de habitaciones: Desktop (md+) */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Habitaciones</CardTitle>
          <CardDescription>Estado actual de aseo de todas las habitaciones</CardDescription>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <LoadingSpinner />
              <span className="ml-2">Cargando habitaciones...</span>
            </div>
          ) : isError ? (
            <div className="text-center py-8">
              <p className="text-destructive">Error al cargar habitaciones: {error}</p>
              <Button variant="outline" onClick={() => refetch()} className="mt-2">Reintentar</Button>
            </div>
          ) : habitaciones.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No se encontraron habitaciones</p>
            </div>
          ) : (
            <>
              {/* Table para pantallas md+ */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Habitación</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Aseo Hoy</TableHead>
                      <TableHead>Desinfección</TableHead>
                      <TableHead>Rotación</TableHead>
                      <TableHead className="hidden lg:table-cell">Último Aseo</TableHead>
                      <TableHead className="hidden lg:table-cell">Fecha Último Aseo</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {habitaciones.map((habitacion) => (
                      <TableRow key={habitacion.id}>
                        <TableCell className="font-medium">{habitacion.numero_habitacion}</TableCell>
                        <TableCell><Badge variant="outline">{habitacion.tipo}</Badge></TableCell>
                        <TableCell><Badge variant={getBadgeVariant(habitacion.estado)}>{habitacion.estado}</Badge></TableCell>
                        <TableCell>{getAseoStatusBadge(habitacion.requerido_aseo_hoy, 'Aseo')}</TableCell>
                        <TableCell>{getAseoStatusBadge(habitacion.requerido_desinfeccion_hoy, 'Desinfección')}</TableCell>
                        <TableCell>{getAseoStatusBadge(habitacion.requerido_rotacion_colchones, 'Rotación')}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {habitacion.ultimo_aseo_tipo ? <Badge variant="secondary">{habitacion.ultimo_aseo_tipo}</Badge> : <span className="text-muted-foreground">N/A</span>}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{formatDate(habitacion.ultimo_aseo_fecha)}</TableCell>
                        <TableCell>
                          <Link href={`/aseo/habitaciones/registrar?habitacionId=${habitacion.id}&usuarioId=${user?.id || 1}&usuarioNombre=${user?.nombre || ''}&numeroHabitacion=${habitacion.numero_habitacion}`}>
                            <Button size="sm" variant="outline">
                              <Plus className="h-4 w-4 mr-1" />
                              Registrar
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile: cards list (mejor usabilidad que una tabla comprimida) */}
              <div className="md:hidden space-y-3">
                {habitaciones.map((habitacion) => (
                  <Card key={habitacion.id} className="p-3">
                    <div className="flex justify-between items-start gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="font-medium truncate">{habitacion.numero_habitacion}</div>
                          <div className="text-xs text-muted-foreground truncate">{habitacion.tipo}</div>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-2">
                          <div>{getAseoStatusBadge(habitacion.requerido_aseo_hoy, 'Aseo')}</div>
                          <div>{getAseoStatusBadge(habitacion.requerido_desinfeccion_hoy, 'Desinfección')}</div>
                          <div>{getAseoStatusBadge(habitacion.requerido_rotacion_colchones, 'Rotación')}</div>
                          {habitacion.ultimo_aseo_tipo && (
                            <Badge variant="secondary" className="text-xs">{habitacion.ultimo_aseo_tipo}</Badge>
                          )}
                        </div>

                        <div className="mt-2 text-sm text-muted-foreground">{formatDate(habitacion.ultimo_aseo_fecha)}</div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <Link href={`/aseo/habitaciones/registrar?habitacionId=${habitacion.id}&usuarioId=${user?.id || 1}&usuarioNombre=${user?.nombre || ''}&numeroHabitacion=${habitacion.numero_habitacion}`}>
                          <Button size="sm" variant="outline" className="whitespace-nowrap">
                            <Plus className="h-4 w-4 mr-1" />
                            Registrar
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Paginación */}
      {meta && meta.lastPage > 1 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Mostrando {((page - 1) * limit) + 1} a {Math.min(page * limit, meta.total)} de {meta.total} resultados
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Select value={limit.toString()} onValueChange={(value) => setLimit(parseInt(value))}>
                  <SelectTrigger className="w-full sm:w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-1 flex-wrap">
                  <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page <= 1}>Anterior</Button>

                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, meta.lastPage) }, (_, i) => {
                      const pageNumber = Math.max(1, Math.min(meta.lastPage - 4, page - 2)) + i;
                      return (
                        <Button key={pageNumber} variant={pageNumber === page ? "default" : "outline"} size="sm" onClick={() => setPage(pageNumber)}>
                          {pageNumber}
                        </Button>
                      );
                    })}
                  </div>

                  <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page >= meta.lastPage}>Siguiente</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>

  );
} 