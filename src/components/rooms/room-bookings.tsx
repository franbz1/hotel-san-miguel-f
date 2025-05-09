import { Habitacion } from "@/Types/habitacion"
import { BookingsSection } from "@/components/bookings/bookings-section"

interface RoomBookingsProps {
  habitacion?: Habitacion | null
  loading: boolean
}

export function RoomBookings({ habitacion, loading }: RoomBookingsProps) {
  if (!habitacion && !loading) {
    return (
      <div className="text-center text-muted-foreground p-4">
        No se pudo cargar la información de reservas
      </div>
    )
  }

  return (
    <BookingsSection 
      roomNumber={habitacion?.numero_habitacion} 
      height="250px" 
      title="Reservas de la habitación" 
      showFilters={false}
      createButton={false}
    />
  )
} 