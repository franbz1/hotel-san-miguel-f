"use client"

import { Search, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getBookingCards } from "@/lib/bookin-card-service"

type BookingStatus = 'created' | 'filled' | 'completed'

interface Booking {
  id: string
  guestName: string
  startDate: string
  endDate: string
  status: BookingStatus
  roomNumber: string
}

const bookings: Booking[] = [
  {
    id: "1",
    guestName: "MICHAELL ROGERS",
    startDate: "12/02/2025",
    endDate: "14/02/2025",
    status: "completed",
    roomNumber: "101",
  },
  {
    id: "2",
    guestName: "MICHAELL ROGERS",
    startDate: "12/02/2025",
    endDate: "14/02/2025",
    status: "filled",
    roomNumber: "102",
  },
  {
    id: "3",
    guestName: "MICHAELL ROGERS",
    startDate: "12/02/2025",
    endDate: "14/02/2025",
    status: "created",
    roomNumber: "103",
  },
]

console.log(await getBookingCards(1, 6))

const StatusBadge = ({ status }: { status: BookingStatus }) => {
  const statusConfig: Record<BookingStatus, { color: string; text: string }> = {
    created: { color: "bg-amber-500", text: "Reserva creada" },
    filled: { color: "bg-blue-500", text: "Formulario completado" },
    completed: { color: "bg-emerald-500", text: "Reserva completada" },
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

const BookingCard = ({ booking }: { booking: Booking }) => {
  return (
    <div className="flex items-center p-4 border rounded-lg mb-3 hover:bg-slate-50 transition-colors">
      <StatusBadge status={booking.status} />
      <div className="ml-4 flex-1">
        <div className="font-medium">{booking.guestName}</div>
        <div className="text-sm text-gray-500">Habitación {booking.roomNumber}</div>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>{booking.startDate}</span>
        <ArrowRightRight />
        <span>{booking.endDate}</span>
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
          <span className="text-xs text-gray-600">Creada</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-xs text-gray-600">Formulario completado</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span className="text-xs text-gray-600">Completada</span>
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
        {bookings.map((booking) => (
          <BookingCard key={booking.id} booking={booking} />
        ))}
      </div>
    </div>
  )
} 