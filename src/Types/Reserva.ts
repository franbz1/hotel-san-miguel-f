import { EstadosReserva } from './enums/estadosReserva'
import { MotivosViajes } from './enums/motivosViajes'
import { Huesped } from './huesped'

export interface Reserva {
  id: number
  fecha_inicio: Date
  fecha_fin: Date
  estado: EstadosReserva
  pais_procedencia: string
  departamento_procedencia: string
  ciudad_procedencia: string
  pais_destino: string
  motivoViaje: MotivosViajes
  checkIn: Date
  checkOut: Date
  costo: number
  numeroAcompanantes: number
  habitacionId: number
  huespedId: number
  huespedesSecundarios: Huesped[]
  facturaId: number
  createdAt: Date
  updatedAt: Date
}
