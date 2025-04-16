import { EstadosFormulario } from "./enums/estadosFormulario"

export interface BookingCard {
  nombre: string
  fecha_inicio: Date
  fecha_fin: Date
  estado: EstadosFormulario
  valor: number
  url: string
  subido_sire: boolean
  subido_tra: boolean
}