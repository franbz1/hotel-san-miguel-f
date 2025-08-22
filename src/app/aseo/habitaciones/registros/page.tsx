"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { FilterIcon, RefreshCcw, Search, Eye, Download } from "lucide-react"
import { useRegistrosAseoHabitacionManager } from "@/hooks/aseo/useRegistrosAseoHabitacion"
import { TiposAseo } from "@/Types/aseo/tiposAseoEnum"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import { usePermissions } from "@/hooks"

export default function RegistrosAseoHabitacionesPage() {
  const [selectedHabitacion, setSelectedHabitacion] = useState<string>("")
  const [selectedUsuario, setSelectedUsuario] = useState<string>("")
  const [selectedFecha, setSelectedFecha] = useState<string>("")
  const [selectedTipoAseo, setSelectedTipoAseo] = useState<string>("")
  const router = useRouter()
  const { isAdmin } = usePermissions()

  const {
    registros,
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
    filterByHabitacion,
    filterByUsuario,
    filterByFecha,
    filterByTipoAseo,
    refetch,
  } = useRegistrosAseoHabitacionManager(10)

  // Aplicar filtros
  const handleFilter = () => {
    if (selectedHabitacion) filterByHabitacion(parseInt(selectedHabitacion))
    if (selectedUsuario) filterByUsuario(parseInt(selectedUsuario))
    if (selectedFecha) filterByFecha(selectedFecha)
    if (selectedTipoAseo) filterByTipoAseo(selectedTipoAseo as TiposAseo)
  }

  // Limpiar filtros
  const handleClearFilters = () => {
    setSelectedHabitacion("")
    setSelectedUsuario("")
    setSelectedFecha("")
    setSelectedTipoAseo("")
    clearFilters()
  }

  // Obtener badge color por tipo de aseo
  const getTipoAseoBadgeColor = (tipo: TiposAseo) => {
    switch (tipo) {
      case TiposAseo.LIMPIEZA:
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case TiposAseo.DESINFECCION:
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case TiposAseo.ROTACION_COLCHONES:
        return "bg-purple-100 text-purple-800 hover:bg-purple-200"
      case TiposAseo.LIMPIEZA_BANIO:
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case TiposAseo.DESINFECCION_BANIO:
        return "bg-orange-100 text-orange-800 hover:bg-orange-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  // Formatear fecha UTC a local
  const formatearFechaLocal = (fechaUTC: Date) => {
    try {
      const fecha = new Date(fechaUTC)
      return fecha.toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      })
    } catch {
      return 'Fecha inválida'
    }
  }

  // Navegar a detalle del registro
  const handleViewDetails = (registroId: number) => {
    router.push(`/aseo/habitaciones/registros/${registroId}`)
  }

  if (isError) {
    return (
      <div className="container mx-auto py-6">
        <Alert className="max-w-2xl mx-auto" variant="destructive">
          <AlertDescription>
            Error al cargar los registros: {error}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold break-words">
            Registros de Aseo - Habitaciones
          </h1>
          <p className="text-muted-foreground break-words">
            Gestiona y consulta todos los registros de aseo de habitaciones
          </p>
        </div>

        <div className="flex w-full sm:w-auto flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>

          {isAdmin() && (
            <Button variant="outline" className="w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          )}
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FilterIcon className="h-5 w-5" />
            Filtros de Búsqueda
          </CardTitle>
          <CardDescription>Utiliza los filtros para encontrar registros específicos</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Habitación */}
            <div className="space-y-2 w-full">
              <label className="text-sm font-medium">Habitación</label>
              <Input
                type="number"
                placeholder="Número de habitación"
                value={selectedHabitacion}
                onChange={(e) => setSelectedHabitacion(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Usuario */}
            <div className="space-y-2 w-full">
              <label className="text-sm font-medium">Usuario ID</label>
              <Input
                type="number"
                placeholder="ID del usuario"
                value={selectedUsuario}
                onChange={(e) => setSelectedUsuario(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Fecha */}
            <div className="space-y-2 w-full">
              <label className="text-sm font-medium">Fecha</label>
              <Input
                type="date"
                value={selectedFecha}
                onChange={(e) => setSelectedFecha(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Tipo de Aseo */}
            <div className="space-y-2 w-full">
              <label className="text-sm font-medium">Tipo de Aseo</label>
              <Select value={selectedTipoAseo} onValueChange={setSelectedTipoAseo}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TiposAseo.LIMPIEZA}>Limpieza</SelectItem>
                  <SelectItem value={TiposAseo.DESINFECCION}>Desinfección</SelectItem>
                  <SelectItem value={TiposAseo.ROTACION_COLCHONES}>Rotación Colchones</SelectItem>
                  <SelectItem value={TiposAseo.LIMPIEZA_BANIO}>Limpieza Baño</SelectItem>
                  <SelectItem value={TiposAseo.DESINFECCION_BANIO}>Desinfección Baño</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <div className="flex gap-2 w-full flex-col sm:flex-row sm:w-auto">
              <Button onClick={handleFilter} disabled={isLoading} className="w-full sm:w-auto">
                <Search className="h-4 w-4 mr-2" />
                Aplicar Filtros
              </Button>
              <Button variant="outline" onClick={handleClearFilters} className="w-full sm:w-auto">
                Limpiar Filtros
              </Button>
            </div>

            <div className="mt-2 sm:mt-0 sm:ml-4">
              {Object.keys(filters).length > 0 && (
                <Badge variant="secondary">
                  {Object.keys(filters).length} filtro{Object.keys(filters).length > 1 ? 's' : ''} activo{Object.keys(filters).length > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Registros */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
            <div>
              <CardTitle>Registros Encontrados</CardTitle>
              <CardDescription>
                {meta?.total ? `${meta.total} registro${meta.total > 1 ? 's' : ''} total${meta.total > 1 ? 'es' : ''}` : 'Cargando...'}
              </CardDescription>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-sm text-muted-foreground hidden sm:inline">Mostrar:</span>
              <Select value={limit.toString()} onValueChange={(value) => setLimit(parseInt(value))}>
                <SelectTrigger className="w-full sm:w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner />
              <span className="ml-2">Cargando registros...</span>
            </div>
          ) : registros.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No se encontraron registros con los filtros aplicados</p>
              <Button variant="outline" onClick={handleClearFilters} className="mt-4">Limpiar Filtros</Button>
            </div>
          ) : (
            <>
              {/* Table desktop (md+) */}
              <div className="hidden md:block overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Habitación</TableHead>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Tipo de Aseo</TableHead>
                      <TableHead className="hidden lg:table-cell">Fecha Registro</TableHead>
                      <TableHead className="hidden lg:table-cell">Observaciones</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {registros.map((registro) => (
                      <TableRow key={registro.id}>
                        <TableCell className="font-medium">#{registro.id}</TableCell>
                        <TableCell>
                          <Badge variant="outline">Hab. {registro.habitacion?.numero_habitacion || registro.habitacionId}</Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{registro.usuario?.nombre || `Usuario ${registro.usuarioId}`}</TableCell>
                        <TableCell>
                          <Badge className={getTipoAseoBadgeColor(registro.tipos_realizados[0] as TiposAseo)}>{registro.tipos_realizados[0]}</Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">{formatearFechaLocal(registro.fecha_registro)}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="max-w-xs truncate" title={registro.observaciones || "Sin observaciones"}>
                            {registro.observaciones || "Sin observaciones"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" onClick={() => handleViewDetails(registro.id)} title="Ver detalles">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile: Cards list */}
              <div className="md:hidden space-y-3">
                {registros.map((registro) => (
                  <Card key={registro.id} className="p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="font-medium">#{registro.id}</div>
                            <Badge variant="outline" className="text-xs">Hab. {registro.habitacion?.numero_habitacion || registro.habitacionId}</Badge>
                          </div>

                          <div className="text-sm text-muted-foreground">{formatearFechaLocal(registro.fecha_registro)}</div>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <Badge className={getTipoAseoBadgeColor(registro.tipos_realizados[0] as TiposAseo)}>{registro.tipos_realizados[0]}</Badge>
                          <div className="text-sm text-muted-foreground truncate max-w-[50vw]" title={registro.usuario?.nombre || `Usuario ${registro.usuarioId}`}>
                            {registro.usuario?.nombre || `Usuario ${registro.usuarioId}`}
                          </div>
                        </div>

                        <div className="mt-2 text-sm text-muted-foreground max-w-full truncate" title={registro.observaciones || "Sin observaciones"}>
                          {registro.observaciones || "Sin observaciones"}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleViewDetails(registro.id)} title="Ver detalles">
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
                      Mostrando {((page - 1) * limit) + 1} a {Math.min(page * limit, meta.total)} de {meta.total} registros
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page <= 1}>Anterior</Button>

                      <div className="flex gap-1">
                        {Array.from({ length: Math.min(5, meta.lastPage) }, (_, i) => {
                          const pageNum = Math.max(1, Math.min(meta.lastPage - 4, page - 2)) + i;
                          return (
                            <Button key={pageNum} variant={pageNum === page ? "default" : "outline"} size="sm" onClick={() => setPage(pageNum)}>
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>

                      <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page >= meta.lastPage}>Siguiente</Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>

  )
} 