"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  FilterIcon, 
  RefreshCcw, 
  Search, 
  Edit, 
  Trash2,
  Building,
  Calendar,
  AlertTriangle,
  CheckCircle,
  ClipboardList
} from "lucide-react"
import { useZonasComunesManager } from "@/hooks/aseo/useZonasComunes"
import { TiposAseo } from "@/Types/aseo/tiposAseoEnum"
import { CreateZonaComunDto, UpdateZonaComunDto, ZonaComun, FiltrosZonaComunDto } from "@/Types/zonasComunes"
import { ZonaComunDialog } from "@/components/zonas-comunes/zona-comun-dialog"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function ZonasComunesPage() {
  const router = useRouter()
  const { user } = useAuth()
  
  // Estados para filtros
  const [selectedPiso, setSelectedPiso] = useState<string>("")
  const [selectedRequiereAseo, setSelectedRequiereAseo] = useState<string>("")
  const [selectedTipoAseo, setSelectedTipoAseo] = useState<string>("")

  // Estados para modales
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedZona, setSelectedZona] = useState<ZonaComun | null>(null)

  // Hook principal de gestión
  const {
    zonas,
    meta,
    isLoading,
    isError,
    error,
    page,
    limit,
    setPage,
    setLimit,
    filters,
    setFilters,
    clearFilters,
    createZona,
    updateZona,
    deleteZona,
    refetch,
    isCreating,
    isUpdating,
    isDeleting,
    resetCreate,
    resetUpdate,
    resetDelete,
  } = useZonasComunesManager(10)

  // Aplicar filtros
  const handleFilter = () => {
    const newFilters: Partial<FiltrosZonaComunDto> = {}
    if (selectedPiso) newFilters.piso = parseInt(selectedPiso)
    if (selectedRequiereAseo) newFilters.requerido_aseo_hoy = selectedRequiereAseo === "true"
    if (selectedTipoAseo) newFilters.ultimo_aseo_tipo = selectedTipoAseo as TiposAseo
    setFilters(newFilters)
  }

  // Limpiar filtros
  const handleClearFilters = () => {
    setSelectedPiso("")
    setSelectedRequiereAseo("")
    setSelectedTipoAseo("")
    clearFilters()
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

  // Manejar creación
  const handleCreate = (data: CreateZonaComunDto) => {
    createZona(data)
  }

  // Manejar edición
  const handleEdit = (zona: ZonaComun) => {
    setSelectedZona(zona)
    setShowEditDialog(true)
  }

  // Manejar actualización
  const handleUpdate = (id: number, data: UpdateZonaComunDto) => {
    updateZona(id, data)
    setShowEditDialog(false)
    setSelectedZona(null)
  }

  // Manejar eliminación
  const handleDelete = () => {
    if (selectedZona) {
      deleteZona(selectedZona.id)
      toast.success("Zona común eliminada exitosamente")
      setShowDeleteDialog(false)
      setSelectedZona(null)
      resetDelete()
    }
  }

  // Confirmar eliminación
  const confirmDelete = (zona: ZonaComun) => {
    setSelectedZona(zona)
    setShowDeleteDialog(true)
  }

  // Manejar registro de aseo
  const handleRegistroAseo = (zona: ZonaComun) => {
    if (!user) {
      toast.error("Debes estar autenticado para registrar aseo")
      return
    }
    
    const params = new URLSearchParams({
      usuarioId: user.id.toString(),
      usuarioNombre: user.nombre,
      nombreZonaComun: zona.nombre
    })
    
    router.push(`/aseo/zonas-comunes/registrar/${zona.id}?${params.toString()}`)
  }

  if (isError) {
    return (
      <div className="container mx-auto py-6">
        <Alert className="max-w-2xl mx-auto" variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Error al cargar las zonas comunes: {error}
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
          <h1 className="text-3xl font-bold">Gestión de Zonas Comunes</h1>
          <p className="text-muted-foreground">
            Administra las zonas comunes del hotel y su estado de aseo
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <ZonaComunDialog
            onCreateZona={handleCreate}
            isCreating={isCreating}
            resetCreate={resetCreate}
          />
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
            Utiliza los filtros para encontrar zonas específicas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtro por Piso */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Piso</label>
              <Input
                type="number"
                placeholder="Número de piso"
                value={selectedPiso}
                onChange={(e) => setSelectedPiso(e.target.value)}
              />
            </div>

            {/* Filtro por Requiere Aseo */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Requiere Aseo Hoy</label>
              <Select value={selectedRequiereAseo} onValueChange={setSelectedRequiereAseo}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Sí</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por Tipo de Aseo */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Último Tipo de Aseo</label>
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

      {/* Tabla de Zonas Comunes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Zonas Comunes</CardTitle>
              <CardDescription>
                {meta?.total ? `${meta.total} zona${meta.total > 1 ? 's' : ''} encontrada${meta.total > 1 ? 's' : ''}` : 'Cargando...'}
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
              <span className="ml-2">Cargando zonas comunes...</span>
            </div>
          ) : zonas.length === 0 ? (
            <div className="text-center py-12">
              <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No se encontraron zonas comunes</p>
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
                      <TableHead>Nombre</TableHead>
                      <TableHead>Piso</TableHead>
                      <TableHead>Requiere Aseo</TableHead>
                      <TableHead>Último Aseo</TableHead>
                      <TableHead>Tipo Aseo</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {zonas.map((zona) => (
                      <TableRow key={zona.id}>
                        <TableCell className="font-medium">#{zona.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            {zona.nombre}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            Piso {zona.piso}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={zona.requerido_aseo_hoy ? "destructive" : "secondary"}>
                            {zona.requerido_aseo_hoy ? (
                              <>
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Sí
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                No
                              </>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {zona.ultimo_aseo_fecha ? (
                            <div className="flex items-center gap-1 text-sm">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              {formatearFechaLocal(zona.ultimo_aseo_fecha)}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">Sin registro</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {zona.ultimo_aseo_tipo ? (
                            <Badge className={getTipoAseoBadgeColor(zona.ultimo_aseo_tipo)}>
                              {zona.ultimo_aseo_tipo}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleRegistroAseo(zona)}
                              title="Registrar Aseo"
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <ClipboardList className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleEdit(zona)}
                              title="Editar"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-600 hover:text-red-700"
                              onClick={() => confirmDelete(zona)}
                              title="Eliminar"
                            >
                              <Trash2 className="h-4 w-4" />
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
                    Mostrando {((page - 1) * limit) + 1} a {Math.min(page * limit, meta.total)} de {meta.total} zonas
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

      {/* Modal de Edición */}
      <ZonaComunDialog
        zona={selectedZona}
        onUpdateZona={handleUpdate}
        isUpdating={isUpdating}
        resetUpdate={resetUpdate}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />

      {/* Modal de Confirmación de Eliminación */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Confirmar eliminación?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. La zona común &quot;{selectedZona?.nombre}&quot; será eliminada permanentemente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <LoadingSpinner className="mr-2 h-4 w-4" />
                  Eliminando...
                </>
              ) : (
                "Eliminar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 