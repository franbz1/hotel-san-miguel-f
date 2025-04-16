import { BookingCard } from "@/Types/bookin-card"
import { Button } from "./ui/button"
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Calendar } from "lucide-react"
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

export default function BookingCardUI({ booking }: { booking: BookingCard }) {
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