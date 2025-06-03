import { useMemo } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Habitacion } from "@/Types/habitacion"
import { ReservationCard } from "./reservation-card"

interface ReservasHabitacionProps {
  habitacion: Habitacion
  onReservaDeleted?: () => void
}

export function ReservasHabitacion({ habitacion, onReservaDeleted }: ReservasHabitacionProps) {
  const reservas = useMemo(() => 
    // Ordenar las reservas desde la más reciente a la más antigua
    habitacion.reservas?.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ) || []
  , [habitacion.reservas])

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-xl font-semibold mb-6">Reservas de la habitación {habitacion.numero_habitacion}</h2>
      
      {reservas.length === 0 ? (
        <div className="text-center text-muted-foreground p-4">
          No hay reservas para esta habitación
        </div>
      ) : (
        <ScrollArea className="h-[300px] rounded-md pr-4">
          <div className="space-y-6">
            {reservas.map((reserva) => (
              <ReservationCard 
                key={reserva.id} 
                reserva={reserva} 
                onReservaDeleted={onReservaDeleted}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
} 