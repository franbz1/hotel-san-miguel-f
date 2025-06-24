import { TipoDocumentoHuespedSecundario } from "./enums/tipoDocumentoHuespedSecundario"
import { Reserva } from "./Reserva"

export interface HuespedSecundario {
  id: number
  tipo_documento: TipoDocumentoHuespedSecundario
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

export interface CreateHuespedSecundarioDto {
  tipo_documento: TipoDocumentoHuespedSecundario
  numero_documento: string
  primer_apellido: string
  segundo_apellido?: string
  nombres: string
  pais_residencia: string
  ciudad_residencia: string
  pais_procedencia: string
  ciudad_procedencia: string
  fecha_nacimiento: Date
  nacionalidad: string
  ocupacion: string
  genero: string
  telefono?: string
  correo?: string
  huespedId: number
}

export interface UpdateHuespedSecundarioDto {
  tipo_documento?: TipoDocumentoHuespedSecundario
  numero_documento?: string
  primer_apellido?: string
  segundo_apellido?: string
  nombres?: string
  pais_residencia?: string
  ciudad_residencia?: string
  pais_procedencia?: string
  ciudad_procedencia?: string
  fecha_nacimiento?: Date
  nacionalidad?: string
  ocupacion?: string
  genero?: string
  telefono?: string
  correo?: string
  huespedId?: number
}
