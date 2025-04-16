"use client"

import { Search, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { getBookingCards } from "@/lib/bookin-card-service"
import { useEffect, useState } from "react"
import { BookingCard } from "@/Types/bookin-card"
import { EstadosFormulario } from "@/Types/enums/estadosFormulario"

const StatusBadge = ({ status }: { status: EstadosFormulario }) => {
  const statusConfig: Record<EstadosFormulario, { color: string; text: string }> = {
    [EstadosFormulario.COMPLETADO]: { color: "bg-emerald-500", text: "Formulario completado" },
    [EstadosFormulario.PENDIENTE]: { color: "bg-amber-500", text: "Formulario pendiente" },
    [EstadosFormulario.EXPIRADO]: { color: "bg-red-500", text: "Formulario expirado" },
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`h-5 w-5 rounded-full ${statusConfig[status].color}`} />
        </TooltipTrigger>
        <TooltipContent>
          <p>{statusConfig[status].text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

const BookingCardUI = ({ booking }: { booking: BookingCard }) => {
  const fechaInicio = new Date(booking.fecha_inicio)
  const fechaFin = new Date(booking.fecha_fin)

  return (
    <div className="flex items-center p-4 border rounded-lg mb-3 hover:bg-slate-50 transition-colors">
      <StatusBadge status={booking.estado} />
      <div className="ml-4 flex-1">
        <div className="font-medium">{booking.nombre}</div>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>{fechaInicio.toLocaleDateString()}</span>
        <ArrowRightRight />
        <span>{fechaFin.toLocaleDateString()}</span>
      </div>
      <Button variant="ghost" size="icon" className="ml-2">
        <Calendar className="h-4 w-4" />
      </Button>
    </div>
  )
}

function ArrowRightRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 9l4-4" />
      <path d="M4 15l4 4" />
      <path d="M10 12h10" />
      <path d="M16 7l4 5-4 5" />
    </svg>
  )
}

export function BookingsSection() {
  const [bookings, setBookings] = useState<BookingCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getBookingCards(1, 10)
        setBookings(data)
      } catch (err) {
        setError('Error al cargar las reservas')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  if (loading) {
    return <div className="p-6">Cargando reservas...</div>
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Reservas</h2>
        <div className="flex space-x-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar reserva..." className="pl-8 w-full" />
          </div>
          <Button>
            <span className="mr-2">Crear reserva</span>
            <Calendar className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <span className="text-xs text-gray-600">Pendiente</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span className="text-xs text-gray-600">Completado</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-xs text-gray-600">Expirado</span>
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="active">Activas</TabsTrigger>
          <TabsTrigger value="upcoming">Próximas</TabsTrigger>
          <TabsTrigger value="past">Pasadas</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-2">
        {bookings.map((booking, index) => (
          <BookingCardUI key={index} booking={booking} />
        ))}
      </div>
    </div>
  )
} 