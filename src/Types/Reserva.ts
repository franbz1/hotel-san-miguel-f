import { EstadosReserva } from './enums/estadosReserva'
import { MotivosViajes } from './enums/motivosViajes'

export interface Reserva {
  id: number
  fechaInicio: Date
  fechaFin: Date
  estado: EstadosReserva
  paisProcedencia: string
  departamentoProcedencia: string
  ciudadProcedencia: string
  paisDestino: string
  motivoViaje: MotivosViajes
  checkIn: Date
  checkOut: Date
  costoTotal: number
  numeroAcompanantes: number
  habitacionId: number
  huespedId: number
  huespedesSecundarios: Huesped[]
  facturaId: number
  createdAt: Date
  updatedAt: Date
  deletedAt: boolean
}
