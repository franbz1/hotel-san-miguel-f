import { EstadosReserva } from './enums/estadosReserva'
import { MotivosViajes } from './enums/motivosViajes'
import { Factura } from './factura'
import { Huesped } from './huesped'
import { HuespedSecundario } from './huespedSecundario'

export interface Reserva {
  id: number
  fecha_inicio: Date
  fecha_fin: Date
  estado: EstadosReserva
  pais_procedencia: string
  departamento_procedencia: string
  ciudad_procedencia: string
  pais_destino: string
  ciudad_destino: string
  motivo_viaje: MotivosViajes
  check_in: Date
  check_out: Date
  costo: number
  numero_acompaniantes: number
  habitacionId: number
  huespedId: number
  huesped: Huesped
  huespedes_secundarios: HuespedSecundario[]
  facturaId: number
  factura: Factura
  createdAt: Date
  updatedAt: Date
}
