"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Eye, Trash2, X, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { cn } from "@/lib/common/utils"
import { BookingCard } from "@/Types/bookin-card"
import { EstadosFormulario } from "@/Types/enums/estadosFormulario"
import { regenerateLinkFormulario } from "@/lib/formulario/link-formulario-service"
import { getBookingCardByLinkId } from "@/lib/bookings/bookin-card-service"

interface BookingCardUIProps {
  booking: BookingCard
}

export default function BookingCardUI({ booking: initialBooking }: BookingCardUIProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [booking, setBooking] = useState<BookingCard>(initialBooking)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  const statusConfig: Record<EstadosFormulario, { color: string; text: string }> = {
    [EstadosFormulario.COMPLETADO]: { color: "bg-emerald-500", text: "Formulario completado" },
    [EstadosFormulario.PENDIENTE]: { color: "bg-amber-500", text: "Formulario pendiente" },
    [EstadosFormulario.EXPIRADO]: { color: "bg-red-500", text: "Formulario expirado" },
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(booking.url)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const handleRegenerateLink = async () => {
    try {
      setIsRegenerating(true)
      const regeneratedLink = await regenerateLinkFormulario(booking.link_formulario_id)
      const bookingRegenerated = await getBookingCardByLinkId(regeneratedLink.id)
      setBooking(bookingRegenerated)
    } catch (error) {
      console.error('Error al regenerar el enlace:', error)
    } finally {
      setIsRegenerating(false)
    }
  }

  return (
    <div className="border rounded-lg overflow-hidden mb-3 transition-all duration-200 hover:shadow-md">
      {/* Cabecera de la tarjeta (siempre visible) */}
      <div
        className={cn(
          "flex items-center p-4 cursor-pointer bg-white hover:bg-slate-50 transition-colors",
          isExpanded && "border-b",
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={`h-5 w-5 rounded-full ${statusConfig[booking.estado].color}`} />
            </TooltipTrigger>
            <TooltipContent>
              <p>{statusConfig[booking.estado].text}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="ml-4 flex-1">
          <div className="font-medium">{booking.nombre}</div>
          <div className="text-sm text-gray-500">Habitación: {booking.numero_habitacion}</div>
        </div>

        <div className="flex items-center gap-1 text-s text-gray-500">
          <span>{new Date(booking.fecha_inicio).toLocaleDateString()}</span>
          <span> - </span>
          <span>{new Date(booking.fecha_fin).toLocaleDateString()}</span>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="ml-1 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation()
            setIsExpanded(!isExpanded)
          }}
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      {/* Contenido expandido */}
      {isExpanded && (
        <div className="p-4 bg-white animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 w-full">
              <div className="flex-1">
                <input
                  type="text"
                  value={booking.url}
                  readOnly
                  className="w-full px-3 py-2 border rounded-lg text-sm text-gray-700 bg-gray-50"
                  placeholder="link al formulario"
                />
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="outline"
                  size="icon"
                  className={cn(
                    "cursor-pointer",
                    isRegenerating && "animate-spin"
                  )}
                  onClick={handleRegenerateLink}
                  disabled={isRegenerating}
                >
                  <RefreshCw size={12} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "cursor-pointer",
                    copySuccess && "bg-green-50 text-green-700 border-green-200"
                  )}
                  onClick={handleCopyLink}
                >
                  {copySuccess ? "Copiado!" : "Copiar"}
                </Button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="font-medium text-gray-700">TRA</span>
                  <Badge variant="outline" className={cn(
                    "rounded-full p-1",
                    booking.subido_tra ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-red-100 text-red-700 border-red-200"
                  )}>
                    {booking.subido_tra ? "✓" : <X size={12} />}
                  </Badge>
                  <span className="font-medium text-gray-700">SIRE</span>
                  <Badge variant="outline" className={cn(
                    "rounded-full p-1",
                    booking.subido_sire ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-red-100 text-red-700 border-red-200"
                  )}>
                    {booking.subido_sire ? "✓" : <X size={12} />}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-700">valor</span>
                  <span className="font-semibold">${booking.valor.toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="cursor-pointer h-8 w-8 rounded-full">
                    <Eye className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="cursor-pointer h-8 w-8 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-6 w-6" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}