import { Habitacion } from "@/Types/habitacion"
import { ReservasHabitacion } from "./reservas-habitacion"

interface RoomBookingsProps {
  habitacion?: Habitacion | null
  loading: boolean
}

export function RoomBookings({ habitacion, loading }: RoomBookingsProps) {
  if (loading || !habitacion) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-6">Reservas de la habitación</h2>
        <div className="text-center text-muted-foreground p-4">
          {loading ? "Cargando reservas..." : "No se pudo cargar la información de reservas"}
        </div>
      </div>
    )
  }

  return (
    <ReservasHabitacion habitacion={habitacion} />
  )
} 