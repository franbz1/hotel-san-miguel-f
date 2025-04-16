import { LinkFormulario } from "./link-formulario"

export interface Formulario {
  id: number
  huespedId: number
  reservaId: number
  SubidoATra: boolean
  SubidoASire: boolean
  traId: number
  linkFormulario: LinkFormulario

  createdAt: Date
  updatedAt: Date
}
