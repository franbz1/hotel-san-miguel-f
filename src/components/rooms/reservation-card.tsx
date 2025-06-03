import { useState } from "react"
import { Reserva } from "@/Types/Reserva"
import { formatDate } from "@/lib/common/utils"
import { TipoDoc } from "@/Types/enums/tiposDocumento"
import { EstadosReserva } from "@/Types/enums/estadosReserva"
import { MotivosViajes } from "@/Types/enums/motivosViajes"
import { deleteReserva } from "@/lib/bookings/reservas-service"
import { toast } from "sonner"
import {
  Calendar,
  ChevronDown,
  FileText,
  Globe,
  UserCheck,
  Users,
  Trash2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface ReservationCardProps {
  reserva: Reserva
  onReservaDeleted?: () => void
}

export function ReservationCard({ reserva, onReservaDeleted }: ReservationCardProps) {
  const [headerExpanded, setHeaderExpanded] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const getEstadoBadgeColor = (estado: EstadosReserva) => {
    switch (estado) {
      case EstadosReserva.PENDIENTE:
        return "bg-amber-500 text-white"
      case EstadosReserva.RESERVADO:
        return "bg-blue-500 text-white"
      case EstadosReserva.FINALIZADO:
        return "bg-emerald-500 text-white"
      case EstadosReserva.CANCELADO:
        return "bg-red-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const formatDocumentType = (tipo: TipoDoc) => {
    switch(tipo) {
      case TipoDoc.CC:
        return "CC"
      case TipoDoc.CE:
        return "CE"
      case TipoDoc.PASAPORTE:
        return "Pasaporte"
      case TipoDoc.TI:
        return "TI"
      default:
        return tipo
    }
  }
  
  const formatMotivoViaje = (motivo: MotivosViajes) => {
    switch(motivo) {
      case MotivosViajes.NEGOCIOS_Y_MOTIVOS_PROFESIONALES:
        return "Negocios"
      case MotivosViajes.VACACIONES_RECREO_Y_OCIO:
        return "Recreación"
      case MotivosViajes.SALUD_Y_ATENCION_MEDICA:
        return "Salud"
      case MotivosViajes.EDUCACION_Y_FORMACION:
        return "Educación"
      case MotivosViajes.OTROS_MOTIVOS:
        return "Otros"
      default:
        return motivo
    }
  }
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      await deleteReserva(reserva.id)
      toast.success("Reserva eliminada", {
        description: "La reserva ha sido eliminada correctamente",
      })
      onReservaDeleted?.()
    } catch (error) {
      toast.error("Error al eliminar", {
        description: error instanceof Error ? error.message : "No se pudo eliminar la reserva",
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  const durationDays = Math.ceil(
    (new Date(reserva.fecha_fin).getTime() - new Date(reserva.fecha_inicio).getTime()) / 
    (1000 * 60 * 60 * 24)
  )

  return (
    <Card className="py-0 gap-0 overflow-hidden transition-all duration-300 hover:shadow-lg border-l-4 border-l-indigo-400">
      {/* Header Compacto - Solo información crítica */}
      <CardHeader 
        className={`py-3 cursor-pointer transition-all duration-500 ease-in-out ${
          headerExpanded 
            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-b' 
            : 'bg-gradient-to-r from-slate-50 to-white hover:from-slate-100 hover:to-gray-50'
        }`}
        onClick={() => setHeaderExpanded(!headerExpanded)}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 flex-1">
            <Avatar className={`border-2 transition-all duration-300 ${
              headerExpanded ? 'h-14 w-14 border-indigo-300' : 'h-11 w-11 border-slate-200'
            }`}>
              <AvatarFallback className={`font-semibold transition-all duration-300 ${
                headerExpanded ? 'bg-indigo-100 text-indigo-700 text-base' : 'bg-slate-100 text-slate-600 text-sm'
              }`}>
                {getInitials(reserva.huesped.nombres)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900 truncate">
                  {reserva.huesped.nombres} {reserva.huesped.primer_apellido}
                </h3>
                <Badge className={`${getEstadoBadgeColor(reserva.estado)} text-xs px-2 py-1`}>
                  {reserva.estado}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(new Date(reserva.fecha_inicio))}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {reserva.numero_acompaniantes + 1}
                </span>
                <span className="hidden sm:flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  {reserva.ciudad_procedencia}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-lg font-bold text-indigo-600">
                ${reserva.costo.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">
                {durationDays} {durationDays === 1 ? 'día' : 'días'}
              </p>
            </div>
            
            <div className={`transition-transform duration-300 ${headerExpanded ? 'rotate-180' : ''}`}>
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </div>
      </CardHeader>
      
      {/* Contenido Expandible */}
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
        headerExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <CardContent className="p-0">
          {/* Botón de eliminar en la sección expandida */}
          <div className="p-4 border-b bg-gradient-to-r from-red-50/30 to-orange-50/30">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-800">Acciones de reserva</p>
                <p className="text-xs text-muted-foreground">Gestionar esta reserva</p>
              </div>
              <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="destructive"
                    size="sm" 
                    className="cursor-pointer gap-2"
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Eliminar reserva</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>¿Está seguro de eliminar esta reserva?</DialogTitle>
                    <DialogDescription>
                      Esta acción no se puede deshacer. Se eliminará permanentemente la reserva de {reserva.huesped.nombres} {reserva.huesped.primer_apellido} y todos sus datos asociados.
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
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Eliminando..." : "Eliminar"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Información de contacto y detalles importantes */}
          <div className="p-4 bg-gradient-to-r from-slate-25 to-gray-25 border-b">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">CONTACTO</p>
                <p className="text-sm">{reserva.huesped.telefono || "No disponible"}</p>
                <p className="text-xs text-muted-foreground truncate">{reserva.huesped.correo || "No disponible"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">PROCEDENCIA</p>
                <p className="text-sm font-medium">{reserva.ciudad_procedencia}</p>
                <p className="text-xs text-muted-foreground">{reserva.pais_procedencia}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">MOTIVO</p>
                <p className="text-sm">{formatMotivoViaje(reserva.motivo_viaje)}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDocumentType(reserva.huesped.tipo_documento)} {reserva.huesped.numero_documento}
                </p>
              </div>
            </div>
          </div>
          
          {/* Secciones detalladas */}
          <Tabs defaultValue="huespedes" className="w-full">
            <TabsList className="w-full justify-start m-4 mb-0">
              <TabsTrigger value="huespedes" className="flex items-center gap-2 cursor-pointer">
                <UserCheck className="h-4 w-4" />
                Huéspedes ({reserva.numero_acompaniantes + 1})
              </TabsTrigger>
              {reserva.factura && (
                <TabsTrigger value="factura" className="flex items-center gap-2 cursor-pointer">
                  <FileText className="h-4 w-4" />
                  Factura
                </TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="huespedes" className="m-4 mt-4 space-y-4">
              {/* Huésped principal - Información completa */}
              <div className="rounded-lg border">
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12 border-2 border-indigo-100">
                      <AvatarFallback className="bg-indigo-50 text-indigo-600 font-semibold">
                        {getInitials(reserva.huesped.nombres)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-lg">
                          {reserva.huesped.nombres} {reserva.huesped.primer_apellido} {reserva.huesped.segundo_apellido}
                        </h4>
                        <Badge variant="outline" className="text-xs">Principal</Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground">Documento</p>
                          <p className="font-medium">{formatDocumentType(reserva.huesped.tipo_documento)} {reserva.huesped.numero_documento}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Nacionalidad</p>
                          <p>{reserva.huesped.nacionalidad}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Residencia</p>
                          <p>{reserva.huesped.ciudad_residencia}, {reserva.huesped.pais_residencia}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Huéspedes adicionales - Solo si existen */}
              {reserva.huespedes_secundarios && reserva.huespedes_secundarios.length > 0 && (
                <div className="rounded-lg border">
                  <div className="bg-slate-50 px-4 py-2 border-b">
                    <h4 className="font-medium text-sm">
                      Acompañantes ({reserva.huespedes_secundarios.length})
                    </h4>
                  </div>
                  <Accordion type="multiple" className="w-full">
                    {reserva.huespedes_secundarios.map((huesped) => (
                      <AccordionItem key={huesped.id} value={`huesped-${huesped.id}`} className="border-b-0">
                        <AccordionTrigger className="px-4 py-3 hover:bg-slate-25 text-left">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 border">
                              <AvatarFallback className="bg-slate-100 text-slate-600 text-xs">
                                {getInitials(huesped.nombres)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{huesped.nombres} {huesped.primer_apellido}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDocumentType(huesped.tipo_documento)} {huesped.numero_documento}
                              </p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-3">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm ml-11">
                            <div>
                              <p className="text-xs text-muted-foreground">Nacionalidad</p>
                              <p>{huesped.nacionalidad}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Residencia</p>
                              <p>{huesped.ciudad_residencia}, {huesped.pais_residencia}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Contacto</p>
                              <p>{huesped.telefono || "No disponible"}</p>
                              {huesped.correo && <p className="text-xs truncate">{huesped.correo}</p>}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}
            </TabsContent>
            
            {/* Información de facturación */}
            {reserva.factura && (
              <TabsContent value="factura" className="m-4 mt-4">
                <div className="rounded-lg border bg-emerald-50/30">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-emerald-600" />
                        <h4 className="font-semibold">Factura</h4>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-700">
                        Facturada
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-white rounded-md border">
                        <p className="text-xs text-muted-foreground mb-1">Fecha de emisión</p>
                        <p className="font-semibold">{formatDate(new Date(reserva.factura.fecha_factura))}</p>
                      </div>
                      <div className="text-center p-3 bg-white rounded-md border">
                        <p className="text-xs text-muted-foreground mb-1">Actualizada</p>
                        <p className="font-semibold">{formatDate(new Date(reserva.factura.updatedAt))}</p>
                      </div>
                      <div className="text-center p-3 bg-emerald-50 rounded-md border border-emerald-200">
                        <p className="text-xs text-muted-foreground mb-1">Total</p>
                        <p className="font-bold text-lg text-emerald-600">
                          ${Number(reserva.factura.total).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            )}
          </Tabs>
          
          {/* Footer con fecha de creación */}
          <div className="px-4 py-2 bg-slate-50 border-t">
            <p className="text-xs text-muted-foreground text-center">
              Reserva creada el {formatDate(new Date(reserva.createdAt))}
            </p>
          </div>
        </CardContent>
      </div>
    </Card>
  )
} 