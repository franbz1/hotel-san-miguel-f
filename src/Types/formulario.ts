import { LinkFormulario } from "./link-formulario"

export interface Formulario {
  id: number
  huespedId: number
  reservaId: number
  SubidoATra: boolean
  SubidoASire: boolean
  traId: number
  LinkFormulario: LinkFormulario

  createdAt: Date
  updatedAt: Date
}
