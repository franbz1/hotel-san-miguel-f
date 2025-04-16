import { TipoDoc } from "./enums/tiposDocumento"
import { Reserva } from "./Reserva"

export interface HuespedSecundario {
  id: number
  tipoDocumento: TipoDoc
  numeroDocumento: string
  primerApellido: string
  segundoApellido: string
  nombres: string
  paisResidencia: string
  departamentoResidencia: string
  ciudadResidencia: string
  ciudadProcedencia: string
  lugarNacimiento: string
  fechaNacimiento: Date
  nacionalidad: string
  ocupacion: string
  genero: string
  telefono: string | null
  correo: string | null
  huespedId: number
  reservas: Reserva[]

  createdAt: Date
  updatedAt: Date
}
