"use client"

import { useState, useEffect } from "react"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getHabitaciones } from "@/lib/rooms/habitacion-service"
import { Habitacion } from "@/Types/habitacion"
import { EstadoHabitacion } from "@/Types/enums/estadosHabitacion"
import { CreateRoomModal } from "./create-room-modal"

const RoomCard = ({ room }: { room: Habitacion }) => {
  const statusColors: Record<EstadoHabitacion, string> = {
    [EstadoHabitacion.LIBRE]: "border-emerald-500 text-emerald-600",
    [EstadoHabitacion.OCUPADO]: "border-red-500 text-red-600",
    [EstadoHabitacion.RESERVADO]: "border-amber-500 text-amber-600",
    [EstadoHabitacion.EN_DESINFECCION]: "border-blue-500 text-blue-600",
    [EstadoHabitacion.EN_MANTENIMIENTO]: "border-purple-500 text-purple-600",
    [EstadoHabitacion.EN_LIMPIEZA]: "border-yellow-500 text-yellow-600"
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg ${statusColors[room.estado]} hover:bg-slate-50 transition-colors cursor-pointer`}
          >
            <svg
              viewBox="0 0 24 24"
              className={`w-12 h-12 mb-2 ${statusColors[room.estado]}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <path d="M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
              <path d="M2 11h20" />
            </svg>
            <span className="text-lg font-semibold">{room.numero_habitacion}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            Habitación {room.numero_habitacion}: {room.estado}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function RoomsSection() {
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchHabitaciones = async () => {
    try {
      setIsLoading(true)
      const response = await getHabitaciones(currentPage)
      setHabitaciones(response.data)
      setTotalPages(response.meta.lastPage)
      setError(null)
    } catch (err) {
      setError('Error al cargar las habitaciones')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchHabitaciones()
  }, [currentPage])

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Habitaciones</h2>
        <div className="flex space-x-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar habitación..." className="pl-8 w-full" />
          </div>
          <CreateRoomModal onRoomCreated={fetchHabitaciones} />
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

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
        {isLoading ? (
          <div className="col-span-full flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="col-span-full text-center text-red-500">
            {error}
          </div>
        ) : (
          habitaciones.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-2">
        <Button
          className="cursor-pointer"
          variant="outline"
          size="icon"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1 || isLoading}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm">
          Página {currentPage} de {totalPages}
        </span>
        <Button
          className="cursor-pointer"
          variant="outline"
          size="icon"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages || isLoading}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
} 