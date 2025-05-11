import { TipoDoc } from "./enums/tiposDocumento"
import { Reserva } from "./Reserva"

export interface HuespedSecundario {
  id: number
  tipo_documento: TipoDoc
  numero_documento: string
  primer_apellido: string
  segundo_apellido: string
  nombres: string
  pais_residencia: string
  departamento_residencia: string
  ciudad_residencia: string
  ciudad_procedencia: string
  lugar_nacimiento: string
  fecha_nacimiento: Date
  nacionalidad: string
  ocupacion: string
  genero: string
  telefono: string | null
  correo: string | null
  huesped_id: number
  reservas: Reserva[]

  createdAt: Date
  updatedAt: Date
}
