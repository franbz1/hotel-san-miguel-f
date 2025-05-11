import { useState } from "react"
import { Reserva } from "@/Types/Reserva"
import { formatDate } from "@/lib/common/utils"
import { TipoDoc } from "@/Types/enums/tiposDocumento"
import { EstadosReserva } from "@/Types/enums/estadosReserva"
import { MotivosViajes } from "@/Types/enums/motivosViajes"
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  CreditCard,
  FileText,
  Globe,
  Plane,
  UserCheck,
  Users,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
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
}

export function ReservationCard({ reserva }: ReservationCardProps) {
  const [expanded, setExpanded] = useState(false)

  console.log(reserva)

  const getEstadoBadgeColor = (estado: EstadosReserva) => {
    switch (estado) {
      case EstadosReserva.PENDIENTE:
        return "bg-amber-500 hover:bg-amber-600 text-white"
      case EstadosReserva.RESERVADO:
        return "bg-blue-500 hover:bg-blue-600 text-white"
      case EstadosReserva.FINALIZADO:
        return "bg-emerald-500 hover:bg-emerald-600 text-white"
      case EstadosReserva.CANCELADO:
        return "bg-red-500 hover:bg-red-600 text-white"
      default:
        return "bg-gray-500 hover:bg-gray-600 text-white"
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

  const durationDays = Math.ceil(
    (new Date(reserva.fecha_fin).getTime() - new Date(reserva.fecha_inicio).getTime()) / 
    (1000 * 60 * 60 * 24)
  )

  return (
    <Card className={`overflow-hidden transition-all duration-300 ${expanded ? 'shadow-md' : 'hover:shadow-sm'}`}>
      <CardHeader className="pb-3 bg-gradient-to-r from-slate-50 to-white border-b">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <Avatar className="h-12 w-12 border-2">
                <AvatarFallback className="bg-slate-100 text-slate-500">
                  {getInitials(reserva.huesped.nombres)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h3 className="text-lg font-semibold flex items-center">
                {reserva.huesped.nombres} {reserva.huesped.primer_apellido} {reserva.huesped.segundo_apellido}
                <Badge className={`ml-3 ${getEstadoBadgeColor(reserva.estado)}`}>
                  {reserva.estado}
                </Badge>
              </h3>
              <p className="text-sm text-muted-foreground">
                Creada: {formatDate(new Date(reserva.createdAt))}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-indigo-500" />
              <span className="font-medium">Fecha de reserva:</span>
              <span>{formatDate(new Date(reserva.fecha_inicio))} - {formatDate(new Date(reserva.fecha_fin))}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-indigo-500" />
              <span className="font-medium">Huéspedes:</span>
              <span>{reserva.numero_acompaniantes + 1} personas ({reserva.numero_acompaniantes} acompañantes)</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4 text-indigo-500" />
              <span className="font-medium">Procedencia:</span>
              <span>{reserva.ciudad_procedencia}, {reserva.pais_procedencia}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Plane className="h-4 w-4 text-indigo-500" />
              <span className="font-medium">Motivo:</span>
              <span>{formatMotivoViaje(reserva.motivo_viaje)}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <CreditCard className="h-4 w-4 text-indigo-500" />
              <span className="font-medium">Costo total:</span>
              <span className="font-semibold">${reserva.costo.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground">
                ({durationDays} {durationDays === 1 ? 'día' : 'días'})
              </span>
            </div>
          </div>
        </div>
        
        <button 
          className="mt-4 w-full flex items-center justify-center p-2 bg-slate-100 hover:bg-slate-200 rounded-md text-sm font-medium transition-colors"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>Ocultar detalles <ChevronUp className="ml-2 h-4 w-4" /></>
          ) : (
            <>Ver detalles <ChevronDown className="ml-2 h-4 w-4" /></>
          )}
        </button>
        
        {expanded && (
          <div className="mt-4 pt-4 border-t">
            <Tabs defaultValue="huespedes">
              <TabsList className="w-full justify-start mb-4">
                <TabsTrigger value="huespedes">Huéspedes</TabsTrigger>
                {reserva.factura && <TabsTrigger value="factura">Facturación</TabsTrigger>}
              </TabsList>
              
              <TabsContent value="huespedes" className="space-y-4">
                <div className="rounded-md border overflow-hidden">
                  <div className="bg-slate-50 p-3 border-b">
                    <h4 className="font-medium">Huésped principal</h4>
                  </div>
                  <div className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                      <Avatar className="h-16 w-16 border-2">
                        <AvatarFallback className="bg-slate-100 text-slate-500 text-lg">
                          {getInitials(reserva.huesped.nombres)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h5 className="text-lg font-medium">{reserva.huesped.nombres} {reserva.huesped.primer_apellido} {reserva.huesped.segundo_apellido}</h5>
                        <p className="text-sm text-muted-foreground">
                          {formatDocumentType(reserva.huesped.tipo_documento)} {reserva.huesped.numero_documento}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Nacionalidad</p>
                        <p>{reserva.huesped.nacionalidad}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Residencia</p>
                        <p>{reserva.huesped.ciudad_residencia}, {reserva.huesped.pais_residencia}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Contacto</p>
                        <p>{reserva.huesped.telefono || "No disponible"}</p>
                        <p className="text-xs">{reserva.huesped.correo || "No disponible"}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {reserva.huespedes_secundarios && reserva.huespedes_secundarios.length > 0 && (
                  <div className="rounded-md border overflow-hidden">
                    <div className="bg-slate-50 p-3 border-b">
                      <h4 className="font-medium">Huéspedes adicionales ({reserva.huespedes_secundarios.length})</h4>
                    </div>
                    <div className="p-0">
                      <Accordion type="multiple" className="w-full">
                        {reserva.huespedes_secundarios.map((huesped) => (
                          <AccordionItem key={huesped.id} value={`huesped-${huesped.id}`} className="border-b last:border-b-0">
                            <AccordionTrigger className="px-4 py-2 hover:bg-slate-50">
                              <div className="flex items-center text-left">
                                <UserCheck className="h-4 w-4 text-muted-foreground mr-2" />
                                <span>{huesped.nombres} {huesped.primer_apellido}</span>
                                <span className="text-xs text-muted-foreground ml-2">
                                  {formatDocumentType(huesped.tipo_documento)} {huesped.numero_documento}
                                </span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-3">
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">Nacionalidad</p>
                                  <p>{huesped.nacionalidad}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">Residencia</p>
                                  <p>{huesped.ciudad_residencia}, {huesped.pais_residencia}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">Contacto</p>
                                  <p>{huesped.telefono || "No disponible"}</p>
                                  <p className="text-xs">{huesped.correo || "No disponible"}</p>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              {reserva.factura && (
                <TabsContent value="factura">
                  <div className="rounded-md border overflow-hidden">
                    <div className="bg-slate-50 p-3 border-b flex justify-between items-center">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        Factura
                      </Badge>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Fecha de emisión</p>
                          <p>{formatDate(new Date(reserva.factura.fecha_factura))}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Fecha de actualización</p>
                          <p>{formatDate(new Date(reserva.factura.updatedAt))}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Total</p>
                          <p className="font-medium">${Number(reserva.factura.total).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 