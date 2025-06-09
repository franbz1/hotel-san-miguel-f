"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  MapPin, 
  User,
  Trash2,
  AlertTriangle
} from "lucide-react"
import { Reserva } from "@/Types/Reserva"
import { EstadosReserva } from "@/Types/enums/estadosReserva"
import { Huesped } from "@/Types/huesped"
import { HuespedSecundario } from "@/Types/huespedSecundario"
import { Factura } from "@/Types/factura"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { deleteReserva } from "@/lib/bookings/reservas-service"
import { toast } from "sonner"

interface ReservasTableProps {
  reservas: Reserva[]
  title?: string
  emptyMessage?: string
  onReservaDeleted?: () => void
  className?: string
  huesped?: Huesped
  huespedesSecundarios?: HuespedSecundario[]
  facturas?: Factura[]
  itemsPerPage?: number
}

export function ReservasTable({ 
  reservas, 
  title = "Reservas", 
  emptyMessage = "No hay reservas disponibles",
  onReservaDeleted,
  className = "",
  huesped,
  itemsPerPage = 10
}: ReservasTableProps) {
  const router = useRouter()
  
  // Estado para paginación
  const [currentPage, setCurrentPage] = useState(1)
  
  // Estado para el modal de eliminación
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [reservaToDelete, setReservaToDelete] = useState<Reserva | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Ordenar las reservas desde la más reciente a la más antigua
  const sortedReservas = [...reservas].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  // Calcular paginación
  const totalPages = Math.ceil(sortedReservas.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedReservas = sortedReservas.slice(startIndex, endIndex)

  // Función para obtener color del badge de estado
  const getEstadoBadgeVariant = (estado: EstadosReserva) => {
    switch (estado) {
      case EstadosReserva.PENDIENTE:
        return "secondary"
      case EstadosReserva.RESERVADO:
        return "default"
      case EstadosReserva.FINALIZADO:
        return "outline"
      case EstadosReserva.CANCELADO:
        return "destructive"
      default:
        return "secondary"
    }
  }

  // Función para formatear fecha
  const formatearFecha = (fecha: Date) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  // Función para formatear moneda
  const formatearMoneda = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  // Función para calcular duración de estadía
  const calcularDuracion = (fechaInicio: Date, fechaFin: Date) => {
    const inicio = new Date(fechaInicio)
    const fin = new Date(fechaFin)
    const duracion = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24))
    return duracion
  }

  // Función para ver detalles de la reserva
  const handleVerReserva = (reservaId: number) => {
    router.push(`/dashboard/reserva/${reservaId}`)
  }

  // Función para ir al huésped
  const handleVerHuesped = (huespedId: number) => {
    router.push(`/dashboard/huesped/${huespedId}`)
  }

  // Función para manejar eliminación
  const handleDeleteClick = (reserva: Reserva) => {
    setReservaToDelete(reserva)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!reservaToDelete) return
    
    try {
      setIsDeleting(true)
      await deleteReserva(reservaToDelete.id)
      
      toast.success("Reserva eliminada", {
        description: `La reserva #${reservaToDelete.id} ha sido eliminada correctamente`
      })
      
      if (onReservaDeleted) {
        onReservaDeleted()
      }
      
      setDeleteDialogOpen(false)
      setReservaToDelete(null)
      
    } catch (error) {
      console.error('Error al eliminar reserva:', error)
      toast.error("Error al eliminar", {
        description: "No se pudo eliminar la reserva. Inténtalo de nuevo."
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

  return (
    <>
      <Card className={`shadow-sm ${className}`}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              {title}
              {reservas.length > 0 && (
                <Badge variant="outline" className="ml-2">
                  {reservas.length}
                </Badge>
              )}
            </CardTitle>
          </div>
        </CardHeader>
        
        <CardContent>
          {sortedReservas.length === 0 ? (
            <div className="text-center text-muted-foreground p-8">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{emptyMessage}</p>
            </div>
          ) : (
            <>
              {/* Tabla */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Huésped</TableHead>
                      <TableHead>Fechas</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Procedencia</TableHead>
                      <TableHead>Duración</TableHead>
                      <TableHead className="text-right">Costo</TableHead>
                      <TableHead className="text-center">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedReservas.map((reserva) => {
                      const huespedReserva = reserva.huesped || huesped
                      const duracion = calcularDuracion(reserva.fecha_inicio, reserva.fecha_fin)
                      
                      return (
                        <TableRow key={reserva.id} className="hover:bg-blue-50/50">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <User className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <Button
                                  variant="link"
                                  onClick={() => handleVerHuesped(huespedReserva?.id || reserva.huespedId)}
                                  className="h-auto p-0 font-medium text-blue-600 hover:text-blue-800 text-left cursor-pointer"
                                >
                                  {huespedReserva?.nombres} {huespedReserva?.primer_apellido}
                                </Button>
                                <p className="text-sm text-muted-foreground">
                                  {huespedReserva?.numero_documento}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          
                          <TableCell>
                            <div className="space-y-1">
                              <p className="text-sm font-medium">
                                {formatearFecha(reserva.fecha_inicio)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                hasta {formatearFecha(reserva.fecha_fin)}
                              </p>
                            </div>
                          </TableCell>
                          
                          <TableCell>
                            <Badge variant={getEstadoBadgeVariant(reserva.estado)}>
                              {reserva.estado.toLowerCase()}
                            </Badge>
                          </TableCell>
                          
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">
                                {reserva.ciudad_procedencia}, {reserva.pais_procedencia}
                              </span>
                            </div>
                          </TableCell>
                          
                          <TableCell>
                            <span className="text-sm font-medium">
                              {duracion} {duracion === 1 ? 'día' : 'días'}
                            </span>
                          </TableCell>
                          
                          <TableCell className="text-right">
                            <span className="font-medium">
                              {formatearMoneda(reserva.costo)}
                            </span>
                          </TableCell>
                          
                          <TableCell>
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleVerReserva(reserva.id)}
                                className="h-8 w-8 p-0 cursor-pointer"
                                title="Ver detalles de la reserva"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteClick(reserva)}
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
                        <span className="font-medium text-blue-600">{Math.min(endIndex, sortedReservas.length)}</span> de{" "}
                        <span className="font-medium text-blue-600">{sortedReservas.length}</span> reservas
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
              ¿Estás seguro de que deseas eliminar esta reserva? Esta acción no se puede deshacer.
              {reservaToDelete && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm">
                    <span className="font-medium">Reserva:</span> #{reservaToDelete.id}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Huésped:</span> {reservaToDelete.huesped?.nombres} {reservaToDelete.huesped?.primer_apellido}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Fechas:</span> {formatearFecha(reservaToDelete.fecha_inicio)} - {formatearFecha(reservaToDelete.fecha_fin)}
                  </p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
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
              {isDeleting ? "Eliminando..." : "Eliminar Reserva"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 