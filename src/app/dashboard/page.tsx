import type React from "react"
import { Search, Menu, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { UserNav } from "@/components/user-nav"

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

// Componentes
const StatusBadge = ({ status }: { status: BookingStatus }) => {
  const statusConfig = {
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

const RoomCard = ({ room }: { room: Room }) => {
  const statusColors = {
    available: "border-emerald-500 text-emerald-600",
    occupied: "border-red-500 text-red-600",
    upcoming: "border-amber-500 text-amber-600",
  }

  const statusText = {
    available: "Libre",
    occupied: "Ocupada",
    upcoming: "Próxima reserva",
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg ${statusColors[room.status]} hover:bg-slate-50 transition-colors cursor-pointer`}
          >
            <svg
              viewBox="0 0 24 24"
              className={`w-12 h-12 mb-2 ${room.status === "available" ? "text-emerald-500" : room.status === "occupied" ? "text-red-500" : "text-amber-500"}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <path d="M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
              <path d="M2 11h20" />
            </svg>
            <span className="text-lg font-semibold">{room.number}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            Habitación {room.number}: {statusText[room.status]}
          </p>
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

const StatCard = ({ title, value, color }: { title: string; value: string; color: string }) => {
  return (
    <Card>
      <CardContent className={`p-6 flex flex-col items-center justify-center ${color}`}>
        <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
        <h3 className={`text-3xl font-bold`}>{value}</h3>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">Hotel San Miguel</h1>
          </div>
          <div className="flex items-center space-x-4">
            <UserNav />
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Habitaciones" value="127" color="text-emerald-600" />
          <StatCard title="Ocupación" value="6.5%" color="text-red-600" />
          <StatCard title="Reservas Activas" value="6+" color="text-emerald-600" />
          <StatCard title="Pendientes" value="0" color="text-gray-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Rooms Panel */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Habitaciones</h2>
              <div className="flex space-x-2">
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Buscar habitación..." className="pl-8 w-full" />
                </div>
                <Button>
                  <span className="mr-2">Añadir habitación</span>
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" />
                    <path d="M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
                    <path d="M2 11h20" />
                    <path d="M12 7v14" />
                    <path d="M2 14h20" />
                  </svg>
                </Button>
              </div>
            </div>

            <div className="mb-4 flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-xs text-gray-600">Libre</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-xs text-gray-600">Próxima reserva</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-xs text-gray-600">Ocupada</span>
              </div>
            </div>

            <Tabs defaultValue="all" className="mb-6">
              <TabsList>
                <TabsTrigger value="all">Todas</TabsTrigger>
                <TabsTrigger value="1">Piso 1</TabsTrigger>
                <TabsTrigger value="2">Piso 2</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          </div>

          {/* Bookings Panel */}
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
        </div>
      </div>
    </div>
  )
}
// Componente auxiliar para el icono de flecha
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

