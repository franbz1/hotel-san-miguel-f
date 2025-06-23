"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { FilterIcon, RefreshCcw, Search, Download, Eye, Building } from "lucide-react"
import { useRegistrosAseoZonaComunManager } from "@/hooks/aseo/useRegistrosAseoZonaComun"
import { TiposAseo } from "@/Types/aseo/tiposAseoEnum"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"

export default function RegistrosAseoZonasComunesPage() {
  const [selectedZonaComun, setSelectedZonaComun] = useState<string>("")
  const [selectedUsuario, setSelectedUsuario] = useState<string>("")
  const [selectedFecha, setSelectedFecha] = useState<string>("")
  const [selectedTipoAseo, setSelectedTipoAseo] = useState<string>("")
  const router = useRouter()

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
    filterByZonaComun,
    filterByUsuario,
    filterByFecha,
    filterByTipoAseo,
    refetch,
  } = useRegistrosAseoZonaComunManager(10)

  // Aplicar filtros
  const handleFilter = () => {
    if (selectedZonaComun) filterByZonaComun(parseInt(selectedZonaComun))
    if (selectedUsuario) filterByUsuario(parseInt(selectedUsuario))
    if (selectedFecha) filterByFecha(selectedFecha)
    if (selectedTipoAseo) filterByTipoAseo(selectedTipoAseo as TiposAseo)
  }

  // Limpiar filtros
  const handleClearFilters = () => {
    setSelectedZonaComun("")
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
    router.push(`/aseo/zonas-comunes/registros/${registroId}`)
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
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Registros de Aseo - Zonas Comunes</h1>
          <p className="text-muted-foreground">
            Gestiona y consulta todos los registros de aseo de zonas comunes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FilterIcon className="h-5 w-5" />
            Filtros de Búsqueda
          </CardTitle>
          <CardDescription>
            Utiliza los filtros para encontrar registros específicos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Filtro por Zona Común */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Zona Común ID</label>
              <Input
                type="number"
                placeholder="ID de zona común"
                value={selectedZonaComun}
                onChange={(e) => setSelectedZonaComun(e.target.value)}
              />
            </div>

            {/* Filtro por Usuario */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Usuario ID</label>
              <Input
                type="number"
                placeholder="ID del usuario"
                value={selectedUsuario}
                onChange={(e) => setSelectedUsuario(e.target.value)}
              />
            </div>

            {/* Filtro por Fecha */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha</label>
              <Input
                type="date"
                value={selectedFecha}
                onChange={(e) => setSelectedFecha(e.target.value)}
              />
            </div>

            {/* Filtro por Tipo de Aseo */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Aseo</label>
              <Select value={selectedTipoAseo} onValueChange={setSelectedTipoAseo}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TiposAseo.LIMPIEZA}>Limpieza</SelectItem>
                  <SelectItem value={TiposAseo.DESINFECCION}>Desinfección</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex items-center gap-2">
            <Button onClick={handleFilter} disabled={isLoading}>
              <Search className="h-4 w-4 mr-2" />
              Aplicar Filtros
            </Button>
            <Button variant="outline" onClick={handleClearFilters}>
              Limpiar Filtros
            </Button>
            {Object.keys(filters).length > 0 && (
              <Badge variant="secondary">
                {Object.keys(filters).length} filtro{Object.keys(filters).length > 1 ? 's' : ''} activo{Object.keys(filters).length > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Registros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Registros Encontrados</CardTitle>
              <CardDescription>
                {meta?.total ? `${meta.total} registro${meta.total > 1 ? 's' : ''} total${meta.total > 1 ? 'es' : ''}` : 'Cargando...'}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Mostrar:</span>
              <Select value={limit.toString()} onValueChange={(value) => setLimit(parseInt(value))}>
                <SelectTrigger className="w-20">
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
              <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No se encontraron registros con los filtros aplicados</p>
              <Button variant="outline" onClick={handleClearFilters} className="mt-4">
                Limpiar Filtros
              </Button>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Zona Común</TableHead>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Tipo de Aseo</TableHead>
                      <TableHead>Fecha Registro</TableHead>
                      <TableHead>Hallazgos</TableHead>
                      <TableHead>Observaciones</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registros.map((registro) => (
                      <TableRow key={registro.id}>
                        <TableCell className="font-medium">#{registro.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <Badge variant="outline">
                              {registro.zonaComun?.nombre || `Zona ${registro.zonaComunId}`}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          {registro.usuario?.nombre || `Usuario ${registro.usuarioId}`}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {registro.tipos_realizados.map((tipo, index) => (
                              <Badge key={index} className={getTipoAseoBadgeColor(tipo as TiposAseo)}>
                                {tipo}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          {formatearFechaLocal(registro.fecha_registro)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {registro.objetos_perdidos && (
                              <Badge variant="destructive" className="text-xs">
                                Objetos perdidos
                              </Badge>
                            )}
                            {registro.rastros_de_animales && (
                              <Badge variant="destructive" className="text-xs">
                                Rastros animales
                              </Badge>
                            )}
                            {!registro.objetos_perdidos && !registro.rastros_de_animales && (
                              <span className="text-muted-foreground text-sm">Sin hallazgos</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate" title={registro.observaciones || "Sin observaciones"}>
                            {registro.observaciones || "Sin observaciones"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewDetails(registro.id)}
                              title="Ver detalles"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Paginación */}
              {meta && meta.lastPage > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Mostrando {((page - 1) * limit) + 1} a {Math.min(page * limit, meta.total)} de {meta.total} registros
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
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, meta.lastPage) }, (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <Button
                            key={pageNum}
                            variant={page === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setPage(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 