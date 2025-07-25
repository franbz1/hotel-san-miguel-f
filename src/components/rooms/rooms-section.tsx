"use client"

import { useState, useEffect } from "react"
import { Search, ChevronLeft, ChevronRight, BedDouble } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg ${
              getRoomBorderClass(room.estado)} ${getRoomTextClass(room.estado)} cursor-pointer ${
              isAnimated ? 'shadow-md' : ''
            }`}
            style={{
              background: isAnimated ? 'rgba(249, 250, 251, 0.95)' : '',
            }}
            onClick={() => router.push(`/dashboard/room/${room.numero_habitacion}`)}
          >
            <BedDouble className={`w-12 h-12 mb-2 ${getRoomTextClass(room.estado)} transition-all duration-500`} />
            <span className="text-lg font-semibold">{room.numero_habitacion}</span>
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
    // Manejador para los cambios recibidos por SSE
    const handleHabitacionesCambios = (cambios: HabitacionesCambio[]) => {
      // Guardar IDs de habitaciones cambiadas para animación
      const changedRoomIds = cambios.map(c => c.habitacionId);
      if (cambios.length > 0) {
        // Mostrar notificación toast
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
        
        // Refrescar los datos para obtener los cambios
        refetch();
      }
      
      // Activar animación
      setAnimatedRooms(changedRoomIds);
      
      // Desactivar animación después de un tiempo más corto
      setTimeout(() => {
        setAnimatedRooms([]);
      }, 1500);
    };

    // Iniciar la conexión SSE
    let eventSource: EventSource;
    try {
      eventSource = getHabitacionesCambios(handleHabitacionesCambios);
    } catch (err) {
      console.error('Error al iniciar la conexión SSE:', err);
    }

    // Limpiar la conexión cuando el componente se desmonte
    return () => {
      if (eventSource) {
        eventSource.close()
      }
    };
  }, [refetch]);

  // Calcular si hay habitaciones para mostrar mensaje apropiado
  const hasHabitaciones = habitaciones.length > 0
  const showEmptyState = !isLoading && !error && !hasHabitaciones

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Habitaciones</h2>
        </div>
        <div className="flex space-x-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar habitación..." className="pl-8 w-full" />
          </div>
          <AdminOnly>
            <CreateRoomModal onRoomCreated={handleRoomCreated} />
          </AdminOnly>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2 md:gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span className="text-xs text-gray-600">Libre</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <span className="text-xs text-gray-600">Reservada</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-xs text-gray-600">Ocupada</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-xs text-gray-600">En desinfección</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
          <span className="text-xs text-gray-600">En mantenimiento</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span className="text-xs text-gray-600">En limpieza</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
        {isLoading ? (
          <div className="col-span-full flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="col-span-full text-center text-red-500">
            Error al cargar las habitaciones
          </div>
        ) : showEmptyState ? (
          <div className="col-span-full text-center text-gray-500 py-12">
            <p className="text-lg mb-2">No hay habitaciones registradas</p>
            <p className="text-sm text-muted-foreground">Comienza creando tu primera habitación</p>
          </div>
        ) : (
          habitaciones.map((room) => (
            <RoomCard 
              key={room.id} 
              room={room} 
              isAnimated={animatedRooms.includes(room.id)}
            />
          ))
        )}
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
            onClick={handleNextPage}
            disabled={currentPage >= totalPages || isLoading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
} 