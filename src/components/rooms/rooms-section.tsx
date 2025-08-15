"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, BedDouble } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useHabitaciones, getHabitacionesCambios, HabitacionesCambio } from "@/lib/rooms/habitacion-service"
import { Habitacion } from "@/Types/habitacion"
import { CreateRoomModal } from "./create-room-modal"
import { AdminOnly } from "@/components/auth/permission-guard"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { 
  getRoomBorderClass, 
  getRoomTextClass, 
  getRoomStatusText 
} from "@/lib/common/constants/room-constants"

const RoomCard = ({ room, isAnimated = false }: { room: Habitacion, isAnimated?: boolean }) => {
  const router = useRouter()

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      router.push(`/dashboard/room/${room.numero_habitacion}`)
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            role="button"
            tabIndex={0}
            aria-label={`Ir a habitación ${room.numero_habitacion}. Estado: ${getRoomStatusText(room.estado)}`}
            className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg min-h-[110px] w-full
              ${getRoomBorderClass(room.estado)} ${getRoomTextClass(room.estado)} cursor-pointer
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
              transition-transform duration-200 ease-in-out
              ${isAnimated ? 'motion-safe:scale-105 motion-safe:shadow-lg motion-safe:animate-pulse motion-reduce:animate-none' : ''}
            `}
            style={{
              background: isAnimated ? 'rgba(249, 250, 251, 0.95)' : '',
              // evita que el contenido se estreche en horizontal scroll
              minWidth: 140,
            }}
            onClick={() => router.push(`/dashboard/room/${room.numero_habitacion}`)}
            onKeyDown={handleKeyDown}
          >
            <BedDouble className={`mb-2 transition-all duration-300 ${getRoomTextClass(room.estado)} w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12`} />
            <span className="text-lg font-semibold break-words text-center">{room.numero_habitacion}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            Habitación {room.numero_habitacion}: {getRoomStatusText(room.estado)}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function RoomsSection() {
  const [currentPage, setCurrentPage] = useState(1)
  const [animatedRooms, setAnimatedRooms] = useState<number[]>([])
  const limitPerPage = 6

  // Usar el hook de TanStack Query
  const { 
    data: response, 
    isLoading, 
    error,
    refetch
  } = useHabitaciones(currentPage, limitPerPage)

  const habitaciones = response?.data || []
  const totalPages = response?.meta?.lastPage || 1

  const handlePreviousPage = () => {
    if (currentPage > 1 && !isLoading) {
      setCurrentPage(prev => prev - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages && !isLoading) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const handleRoomCreated = async () => {
    await refetch()
  }

  // Actualizaciones en tiempo real con SSE
  useEffect(() => {
    const handleHabitacionesCambios = (cambios: HabitacionesCambio[]) => {
      const changedRoomIds = cambios.map(c => c.habitacionId);
      if (cambios.length > 0) {
        toast.info(`Actualización de habitaciones`, {
          description: (
            <div className="mt-2">
              <p className="text-sm text-black">
                {cambios.length} {cambios.length === 1 ? 'habitación ha cambiado' : 'habitaciones han cambiado'} de estado.
              </p>
            </div>
          ),
          duration: 10000,
        });

        refetch();
      }

      setAnimatedRooms(changedRoomIds);

      setTimeout(() => {
        setAnimatedRooms([]);
      }, 1500);
    };

    let eventSource: EventSource | undefined;
    try {
      eventSource = getHabitacionesCambios(handleHabitacionesCambios);
    } catch (err) {
      console.error('Error al iniciar la conexión SSE:', err);
    }

    return () => {
      if (eventSource) {
        eventSource.close()
      }
    };
  }, [refetch]);

  const hasHabitaciones = habitaciones.length > 0
  const showEmptyState = !isLoading && !error && !hasHabitaciones

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg sm:text-xl font-semibold">Habitaciones</h2>
        </div>
        <div className="flex items-center space-x-2">
          <AdminOnly>
            <CreateRoomModal onRoomCreated={handleRoomCreated} />
          </AdminOnly>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2 md:gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-xs text-gray-600">Libre</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-xs text-gray-600">Reservada</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-xs text-gray-600">Ocupada</span>
        </div>
      </div>

      {/* Contenedor responsive: horizontal scroll en móviles, grid en md+ */}
      <div className="mb-4">
        {/* Mobile: horizontal scroll */}
        <div className="md:hidden">
          {isLoading ? (
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2">
              {/* Skeletons */}
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="min-w-[140px] w-[140px] flex-shrink-0 p-4 border rounded-lg animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-6">Error al cargar las habitaciones</div>
          ) : showEmptyState ? (
            <div className="text-center text-gray-500 py-12">
              <p className="text-lg mb-2">No hay habitaciones registradas</p>
              <p className="text-sm text-muted-foreground">Comienza creando tu primera habitación</p>
            </div>
          ) : (
            <div className="overflow-x-auto pb-2 -mx-2 px-2">
              <div className="flex gap-4">
                {habitaciones.map((room) => (
                  <div key={room.id} className="min-w-[140px] w-[140px] flex-shrink-0">
                    <RoomCard room={room} isAnimated={animatedRooms.includes(room.id)} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Desktop / Tablet: grid */}
        <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {isLoading ? (
            <div className="col-span-full flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="col-span-full text-center text-red-500">Error al cargar las habitaciones</div>
          ) : showEmptyState ? (
            <div className="col-span-full text-center text-gray-500 py-12">
              <p className="text-lg mb-2">No hay habitaciones registradas</p>
              <p className="text-sm text-muted-foreground">Comienza creando tu primera habitación</p>
            </div>
          ) : (
            habitaciones.map((room) => (
              <RoomCard key={room.id} room={room} isAnimated={animatedRooms.includes(room.id)} />
            ))
          )}
        </div>
      </div>

      {/* Pagination - Solo mostrar si hay habitaciones */}
      {hasHabitaciones && (
        <div className="flex justify-center items-center space-x-2">
          <Button
            className="cursor-pointer"
            variant="outline"
            size="icon"
            onClick={handlePreviousPage}
            disabled={currentPage <= 1 || isLoading}
            aria-label="Página anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Texto visible en sm+ */}
          <span className="text-sm hidden sm:inline">
            Página {currentPage} de {totalPages}
          </span>

          {/* Texto compacto en xs */}
          <span className="text-sm sm:hidden">
            {currentPage}/{totalPages}
          </span>

          <Button
            className="cursor-pointer"
            variant="outline"
            size="icon"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages || isLoading}
            aria-label="Página siguiente"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
