import { TipoDoc } from "./enums/tiposDocumento"
import { Factura } from "./factura"
import { Formulario } from "./formulario"
import { HuespedSecundario } from "./huespedSecundario"
import { Reserva } from "./Reserva"

export interface Huesped {
  id: number
  tipo_documento: TipoDoc
  numero_documento: string
  primer_apellido: string
  segundo_apellido: string
  nombres: string
  pais_residencia: string
  departamento_residencia: string
  ciudad_residencia: string
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
