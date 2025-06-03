import { ScrollArea } from "@/components/ui/scroll-area"
import { Reserva } from "@/Types/Reserva"
import { Huesped } from "@/Types/huesped"
import { HuespedSecundario } from "@/Types/huespedSecundario"
import { Factura } from "@/Types/factura"
import { ReservationCard } from "./reservation-card"
import { Calendar } from "lucide-react"

interface ReservasListProps {
  reservas: Reserva[]
  title?: string
  emptyMessage?: string
  onReservaDeleted?: () => void
  className?: string
  huesped?: Huesped
  huespedesSecundarios?: HuespedSecundario[]
  facturas?: Factura[]
}

export function ReservasList({ 
  reservas, 
  title = "Reservas", 
  emptyMessage = "No hay reservas disponibles",
  onReservaDeleted,
  className = "",
  huesped,
  huespedesSecundarios,
  facturas
}: ReservasListProps) {
  
  // Ordenar las reservas desde la más reciente a la más antigua
  const sortedReservas = [...reservas].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm border ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="h-5 w-5 text-gray-600" />
        <h2 className="text-xl font-semibold">{title}</h2>
        {reservas.length > 0 && (
          <span className="text-sm text-gray-500">({reservas.length})</span>
        )}
      </div>
      
      {sortedReservas.length === 0 ? (
        <div className="text-center text-muted-foreground p-8">
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <ScrollArea className="h-[400px] rounded-md pr-4">
          <div className="space-y-6">
            {sortedReservas.map((reserva) => (
              <ReservationCard 
                key={reserva.id} 
                reserva={reserva} 
                onReservaDeleted={onReservaDeleted}
                huespedExterno={huesped}
                huespedesSecundariosExternos={huespedesSecundarios}
                facturasExternas={facturas}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
} 