import { TipoDoc } from "./enums/tiposDocumento"
import { Factura } from "./factura"
import { Formulario } from "./formulario"
import { HuespedSecundario } from "./huespedSecundario"
import { Reserva } from "./Reserva"

export interface Huesped {
  id: number
  tipoDocumento: TipoDoc
  numeroDocumento: string
  primerApellido: string
  segundoApellido: string
  nombres: string
  paisResidencia: string
  departamentoResidencia: string
  ciudadResidencia: string
  lugarNacimiento: string
  fechaNacimiento: Date
  nacionalidad: string
  ocupacion: string
  genero: string
  telefono: string | null
  correo: string | null
  reservas: Reserva[]
  huespedesSecundarios: HuespedSecundario[]
  facturas: Factura[]
  formularios: Formulario[]

  createdAt: Date
  updatedAt: Date
}
