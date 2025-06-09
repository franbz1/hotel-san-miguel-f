"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  Phone,
  Mail,
  FileText,
  Clock,
  Users,
  Home,
  Plane,
  DollarSign,
  Edit,
  Trash2,
  AlertTriangle
} from "lucide-react"
import { getReservaById, deleteReserva } from "@/lib/bookings/reservas-service"
import { Reserva } from "@/Types/Reserva"
import { EstadosReserva } from "@/Types/enums/estadosReserva"
import { Header } from "@/components/layout/header"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function ReservaDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const reservaId = Number(params.id)

  const [reserva, setReserva] = useState<Reserva | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Cargar datos de la reserva
  useEffect(() => {
    const fetchReserva = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getReservaById(reservaId)
        setReserva(data)
      } catch (error) {
        console.error('Error al cargar reserva:', error)
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
        setError(`Error al cargar la reserva: ${errorMessage}`)
        toast.error("Error al cargar reserva", {
          description: errorMessage
        })
      } finally {
        setLoading(false)
      }
    }

    if (reservaId) {
      fetchReserva()
    }
  }, [reservaId])

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
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  // Función para formatear fecha y hora
  const formatearFechaHora = (fecha: Date) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  // Función para manejar eliminación
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!reserva) return
    
    try {
      setIsDeleting(true)
      await deleteReserva(reserva.id)
      
      toast.success("Reserva eliminada", {
        description: `La reserva #${reserva.id} ha sido eliminada correctamente`
      })
      
      router.push('/dashboard/reservas')
      
    } catch (error) {
      console.error('Error al eliminar reserva:', error)
      toast.error("Error al eliminar", {
        description: "No se pudo eliminar la reserva. Inténtalo de nuevo."
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  // Función para ir al huésped
  const goToHuesped = () => {
    if (reserva?.huesped) {
      router.push(`/dashboard/huesped/${reserva.huesped.id}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Cargando detalles de la reserva...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error || !reserva) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto p-6">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="text-center text-red-600">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Error al cargar reserva</h3>
                <p className="text-sm mb-4">{error || "No se encontró la reserva"}</p>
                <Button
                  variant="outline"
                  onClick={() => router.push('/dashboard/reservas')}
                  className="border-red-300 text-red-700 hover:bg-red-100"
                >
                  Volver a Reservas
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  const duracion = calcularDuracion(reserva.fecha_inicio, reserva.fecha_fin)
  const totalHuespedes = 1 + (reserva.numero_acompaniantes || 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver
              </Button>
              <Badge variant={getEstadoBadgeVariant(reserva.estado)} className="text-sm">
                {reserva.estado.toLowerCase()}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Calendar className="h-8 w-8 text-blue-600" />
              Reserva #{reserva.id}
            </h1>
            <p className="text-muted-foreground mt-1">
              Detalles completos de la reserva
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Editar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeleteClick}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Eliminar
            </Button>
          </div>
        </div>

        {/* Información principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información del huésped */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Huésped Principal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Nombre completo</p>
                <Button
                  variant="link"
                  onClick={goToHuesped}
                  className="h-auto p-0 text-lg font-semibold text-blue-600 hover:text-blue-800"
                >
                  {reserva.huesped.nombres} {reserva.huesped.primer_apellido} {reserva.huesped.segundo_apellido}
                </Button>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm text-muted-foreground">Documento</p>
                <p className="font-medium">{reserva.huesped.numero_documento}</p>
              </div>
              
              {reserva.huesped.telefono && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{reserva.huesped.telefono}</span>
                </div>
              )}
              
              {reserva.huesped.correo && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{reserva.huesped.correo}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Fechas y estadía */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Fechas de Estadía
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Fecha de inicio</p>
                <p className="font-medium">{formatearFecha(reserva.fecha_inicio)}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Fecha de fin</p>
                <p className="font-medium">{formatearFecha(reserva.fecha_fin)}</p>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm text-muted-foreground">Duración total</p>
                <p className="text-lg font-semibold text-blue-600">
                  {duracion} {duracion === 1 ? 'día' : 'días'}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Check-in</p>
                  <p className="text-sm font-medium">{formatearFechaHora(reserva.check_in)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Check-out</p>
                  <p className="text-sm font-medium">{formatearFechaHora(reserva.check_out)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información financiera */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-blue-600" />
                Información Financiera
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Costo total</p>
                <p className="text-2xl font-bold text-green-600">{formatearMoneda(reserva.costo)}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Costo por noche</p>
                <p className="font-medium">{formatearMoneda(reserva.costo / duracion)}</p>
              </div>
              
              <Separator />
              
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {totalHuespedes} {totalHuespedes === 1 ? 'huésped' : 'huéspedes'}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Habitación #{reserva.habitacionId}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Información de procedencia y destino */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                Procedencia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">País</p>
                <p className="font-medium">{reserva.pais_procedencia}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Departamento</p>
                <p className="font-medium">{reserva.departamento_procedencia}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ciudad</p>
                <p className="font-medium">{reserva.ciudad_procedencia}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="h-5 w-5 text-blue-600" />
                Destino y Motivo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">País de destino</p>
                <p className="font-medium">{reserva.pais_destino}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Motivo de viaje</p>
                <p className="font-medium">{reserva.motivo_viaje.replace(/_/g, ' ').toLowerCase()}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Huéspedes Secundarios (Acompañantes) */}
        {reserva.huespedes_secundarios && reserva.huespedes_secundarios.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Huéspedes Acompañantes
                <Badge variant="secondary" className="ml-2">
                  {reserva.huespedes_secundarios.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reserva.huespedes_secundarios.map((huespedSecundario, index) => (
                  <div key={huespedSecundario.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Acompañante #{index + 1}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {huespedSecundario.tipo_documento} • {huespedSecundario.numero_documento}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Nombre completo</p>
                        <p className="font-medium">
                          {huespedSecundario.nombres} {huespedSecundario.primer_apellido} {huespedSecundario.segundo_apellido}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Nacionalidad</p>
                          <p className="text-sm font-medium">{huespedSecundario.nacionalidad}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Género</p>
                          <p className="text-sm font-medium">{huespedSecundario.genero}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-xs text-muted-foreground">Residencia</p>
                        <p className="text-sm">{huespedSecundario.ciudad_residencia}, {huespedSecundario.pais_residencia}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-muted-foreground">Ocupación</p>
                        <p className="text-sm">{huespedSecundario.ocupacion}</p>
                      </div>
                      
                      {huespedSecundario.telefono && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs">{huespedSecundario.telefono}</span>
                        </div>
                      )}
                      
                      {huespedSecundario.correo && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs">{huespedSecundario.correo}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Resumen de acompañantes */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-900">Resumen de Huéspedes</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-blue-700">Total de huéspedes</p>
                    <p className="font-semibold text-blue-900">{totalHuespedes}</p>
                  </div>
                  <div>
                    <p className="text-blue-700">Huésped principal</p>
                    <p className="font-semibold text-blue-900">1</p>
                  </div>
                  <div>
                    <p className="text-blue-700">Acompañantes</p>
                    <p className="font-semibold text-blue-900">{reserva.numero_acompaniantes}</p>
                  </div>
                  <div>
                    <p className="text-blue-700">Costo por persona</p>
                    <p className="font-semibold text-blue-900">{formatearMoneda(reserva.costo / totalHuespedes)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Información de facturación */}
        {reserva.factura && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Facturación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Número de factura</p>
                  <p className="font-medium">#{reserva.factura.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fecha de factura</p>
                  <p className="font-medium">{formatearFechaHora(reserva.factura.fecha_factura)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total facturado</p>
                  <p className="font-medium text-green-600">{formatearMoneda(reserva.factura.total)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Información del sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Información del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Fecha de creación</p>
                <p className="font-medium">{formatearFechaHora(reserva.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Última actualización</p>
                <p className="font-medium">{formatearFechaHora(reserva.updatedAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

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
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm">
                  <span className="font-medium">Reserva:</span> #{reserva.id}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Huésped:</span> {reserva.huesped.nombres} {reserva.huesped.primer_apellido}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Fechas:</span> {formatearFecha(reserva.fecha_inicio)} - {formatearFecha(reserva.fecha_fin)}
                </p>
              </div>
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
    </div>
  )
} 