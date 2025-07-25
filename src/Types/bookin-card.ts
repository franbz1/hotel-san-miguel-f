import { EstadosFormulario } from "./enums/estadosFormulario"

export interface BookingCard {
  link_formulario_id: number
  nombre: string
  fecha_inicio: Date
  fecha_fin: Date
  estado: EstadosFormulario
  valor: number
  url: string
  numero_habitacion: number
  subido_sire: boolean
  subido_tra: boolean
  formulario_id: number | null
}