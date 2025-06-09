"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Users, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Search,
  Mail,
  Phone,
  Calendar,
  Trash2,
  AlertTriangle
} from "lucide-react"
import { Huesped } from "@/Types/huesped"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"

interface HuespedesTableProps {
  huespedes: Huesped[]
  title?: string
  emptyMessage?: string
  onHuespedDeleted?: () => void
  className?: string
  itemsPerPage?: number
  showSearch?: boolean
}

export function HuespedesTable({ 
  huespedes, 
  title = "Huéspedes", 
  emptyMessage = "No hay huéspedes disponibles",
  onHuespedDeleted,
  className = "",
  itemsPerPage = 10,
  showSearch = true
}: HuespedesTableProps) {
  const router = useRouter()
  
  // Estado para paginación
  const [currentPage, setCurrentPage] = useState(1)
  
  // Estado para búsqueda
  const [searchTerm, setSearchTerm] = useState("")
  
  // Estado para el modal de eliminación
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [huespedToDelete, setHuespedToDelete] = useState<Huesped | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Función para generar iniciales del avatar
  const getInitials = (nombres: string, primerApellido: string) => {
    const firstInitial = nombres.charAt(0).toUpperCase()
    const lastInitial = primerApellido.charAt(0).toUpperCase()
    return `${firstInitial}${lastInitial}`
  }

  // Función para generar color del avatar basado en las iniciales
  const getAvatarColor = (nombres: string, primerApellido: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500', 
      'bg-purple-500',
      'bg-orange-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
      'bg-red-500'
    ]
    const charCode = nombres.charCodeAt(0) + primerApellido.charCodeAt(0)
    return colors[charCode % colors.length]
  }

  // Filtrar huéspedes según término de búsqueda
  const filteredHuespedes = huespedes.filter(huesped => {
    if (!searchTerm) return true
    
    const searchLower = searchTerm.toLowerCase()
    return (
      huesped.nombres.toLowerCase().includes(searchLower) ||
      huesped.primer_apellido.toLowerCase().includes(searchLower) ||
      (huesped.segundo_apellido && huesped.segundo_apellido.toLowerCase().includes(searchLower)) ||
      huesped.numero_documento.includes(searchTerm) ||
      (huesped.correo && huesped.correo.toLowerCase().includes(searchLower)) ||
      (huesped.telefono && huesped.telefono.includes(searchTerm))
    )
  })

  // Ordenar los huéspedes alfabéticamente
  const sortedHuespedes = [...filteredHuespedes].sort(
    (a, b) => `${a.nombres} ${a.primer_apellido}`.localeCompare(`${b.nombres} ${b.primer_apellido}`)
  )

  // Calcular paginación
  const totalPages = Math.ceil(sortedHuespedes.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedHuespedes = sortedHuespedes.slice(startIndex, endIndex)

  // Función para ver detalles del huésped
  const handleVerHuesped = (huespedId: number) => {
    router.push(`/dashboard/huesped/${huespedId}`)
  }

  // Función para manejar eliminación
  const handleDeleteClick = (huesped: Huesped) => {
    setHuespedToDelete(huesped)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!huespedToDelete) return
    
    try {
      setIsDeleting(true)
      // Aquí iría la función de eliminar huésped
      // await deleteHuesped(huespedToDelete.id)
      
      toast.success("Huésped eliminado", {
        description: `${huespedToDelete.nombres} ${huespedToDelete.primer_apellido} ha sido eliminado correctamente`
      })
      
      if (onHuespedDeleted) {
        onHuespedDeleted()
      }
      
      setDeleteDialogOpen(false)
      setHuespedToDelete(null)
      
    } catch (error) {
      console.error('Error al eliminar huésped:', error)
      toast.error("Error al eliminar", {
        description: "No se pudo eliminar el huésped. Inténtalo de nuevo."
      })
    } finally {
      setIsDeleting(false)
    }
  }

  // Navegación de páginas
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  // Resetear página cuando cambie la búsqueda
  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  return (
    <>
      <Card className={`shadow-sm ${className}`}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              {title}
              {huespedes.length > 0 && (
                <Badge variant="outline" className="ml-2">
                  {huespedes.length}
                </Badge>
              )}
            </CardTitle>
          </div>
          
          {/* Barra de búsqueda */}
          {showSearch && (
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nombre, documento, email o teléfono..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
              />
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          {sortedHuespedes.length === 0 ? (
            <div className="text-center text-muted-foreground p-8">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{emptyMessage}</p>
              {searchTerm && (
                <p className="text-sm text-gray-500 mt-1">Intenta con otros términos de búsqueda</p>
              )}
            </div>
          ) : (
            <>
              {/* Tabla */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Huésped</TableHead>
                      <TableHead>Documento</TableHead>
                      <TableHead>Contacto</TableHead>
                      <TableHead>Reservas</TableHead>
                      <TableHead className="text-center">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedHuespedes.map((huesped) => {
                      const cantidadReservas = huesped.reservas ? huesped.reservas.length : 0
                      
                      return (
                        <TableRow key={huesped.id} className="hover:bg-blue-50/50">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm ${getAvatarColor(huesped.nombres, huesped.primer_apellido)} shadow-sm`}>
                                {getInitials(huesped.nombres, huesped.primer_apellido)}
                              </div>
                              <div>
                                <Button
                                  variant="link"
                                  onClick={() => handleVerHuesped(huesped.id)}
                                  className="h-auto p-0 font-medium text-blue-600 hover:text-blue-800 text-left cursor-pointer"
                                >
                                  {huesped.nombres} {huesped.primer_apellido}
                                  {huesped.segundo_apellido && ` ${huesped.segundo_apellido}`}
                                                                 </Button>
                                 {huesped.correo && (
                                   <p className="text-sm text-muted-foreground">
                                     {huesped.correo}
                                   </p>
                                 )}
                              </div>
                            </div>
                          </TableCell>
                          
                          <TableCell>
                            <div className="space-y-1">
                              <p className="text-sm font-medium">
                                {huesped.tipo_documento}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {huesped.numero_documento}
                              </p>
                            </div>
                          </TableCell>
                          
                                                     <TableCell>
                             <div className="space-y-1">
                               {huesped.correo && (
                                 <div className="flex items-center gap-1">
                                   <Mail className="h-3 w-3 text-muted-foreground" />
                                   <span className="text-sm">{huesped.correo}</span>
                                 </div>
                               )}
                               {huesped.telefono && (
                                 <div className="flex items-center gap-1">
                                   <Phone className="h-3 w-3 text-muted-foreground" />
                                   <span className="text-sm">{huesped.telefono}</span>
                                 </div>
                               )}
                             </div>
                           </TableCell>
                          
                          <TableCell>
                            <Badge 
                              variant={cantidadReservas > 0 ? 'default' : 'secondary'} 
                              className="flex items-center gap-1 w-fit"
                            >
                              <Calendar className="h-3 w-3" />
                              {cantidadReservas} {cantidadReservas === 1 ? 'reserva' : 'reservas'}
                            </Badge>
                          </TableCell>
                          
                          <TableCell>
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleVerHuesped(huesped.id)}
                                className="h-8 w-8 p-0 cursor-pointer"
                                title="Ver detalles del huésped"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteClick(huesped)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Paginación mejorada */}
              {totalPages > 1 && (
                <div className="border-t pt-4 mt-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <p className="text-sm text-muted-foreground">
                        Mostrando <span className="font-medium text-blue-600">{startIndex + 1}</span> a{" "}
                        <span className="font-medium text-blue-600">{Math.min(endIndex, sortedHuespedes.length)}</span> de{" "}
                        <span className="font-medium text-blue-600">{sortedHuespedes.length}</span> huéspedes
                        {searchTerm && <span> (filtrados de {huespedes.length} total)</span>}
                      </p>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Página {currentPage} de {totalPages}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(1)}
                        disabled={currentPage === 1}
                        className="px-3"
                      >
                        Primera
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1 hover:bg-blue-50 border-blue-200"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Anterior
                      </Button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum
                          
                          if (totalPages <= 5) {
                            pageNum = i + 1
                          } else if (currentPage <= 3) {
                            pageNum = i + 1
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i
                          } else {
                            pageNum = currentPage - 2 + i
                          }
                          
                          if (pageNum < 1 || pageNum > totalPages) return null
                          
                          return (
                            <Button
                              key={pageNum}
                              variant={pageNum === currentPage ? "default" : "outline"}
                              size="sm"
                              onClick={() => goToPage(pageNum)}
                              className={`min-w-[40px] ${
                                pageNum === currentPage 
                                  ? "bg-blue-600 hover:bg-blue-700 text-white" 
                                  : "hover:bg-blue-50 border-blue-200"
                              }`}
                            >
                              {pageNum}
                            </Button>
                          )
                        })}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-1 hover:bg-blue-50 border-blue-200"
                      >
                        Siguiente
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className="px-3"
                      >
                        Última
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Modal de confirmación de eliminación */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <DialogTitle>Confirmar Eliminación</DialogTitle>
            </div>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar este huésped? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          
          {huespedToDelete && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm">
                <span className="font-medium">Huésped:</span> {huespedToDelete.nombres} {huespedToDelete.primer_apellido}
              </p>
              <p className="text-sm">
                <span className="font-medium">Documento:</span> {huespedToDelete.tipo_documento} {huespedToDelete.numero_documento}
              </p>
                             {huespedToDelete.correo && (
                 <p className="text-sm">
                   <span className="font-medium">Email:</span> {huespedToDelete.correo}
                 </p>
               )}
              {huespedToDelete.reservas && huespedToDelete.reservas.length > 0 && (
                <p className="text-sm text-orange-600 mt-2">
                  <span className="font-medium">Advertencia:</span> Este huésped tiene {huespedToDelete.reservas.length} reserva(s) asociada(s).
                </p>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Eliminando..." : "Eliminar Huésped"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 