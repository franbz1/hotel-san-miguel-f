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
  lugar_nacimiento: string
  fecha_nacimiento: Date
  nacionalidad: string
  ocupacion: string
  genero: string
  telefono: string | null
  correo: string | null
  reservas: Reserva[]
  huespedes_secundarios: HuespedSecundario[]
  facturas: Factura[]
  formularios: Formulario[]

  createdAt: Date
  updatedAt: Date
}

export interface CreateHuespedDto {
  tipo_documento: TipoDoc
  numero_documento: string
  primer_apellido: string
  segundo_apellido?: string
  nombres: string
  pais_residencia: string
  ciudad_residencia: string
  pais_procedencia: string
  ciudad_procedencia: string
  lugar_nacimiento: string
  fecha_nacimiento: Date
  nacionalidad: string
  ocupacion: string
  genero: string
  telefono?: string
  correo?: string
}

export interface UpdateHuespedDto {
  tipo_documento?: TipoDoc
  numero_documento?: string
  primer_apellido?: string
  segundo_apellido?: string
  nombres?: string
  pais_residencia?: string
  ciudad_residencia?: string
  pais_procedencia?: string
  ciudad_procedencia?: string
  lugar_nacimiento?: string
  fecha_nacimiento?: Date
  nacionalidad?: string
  ocupacion?: string
  genero?: string
  telefono?: string
  correo?: string
}
