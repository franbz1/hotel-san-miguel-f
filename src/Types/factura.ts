import { Huesped } from "./huesped"

export interface Factura {
  id: number
  total: number
  fecha: Date
  huespedId: number

  createdAt: Date
  updatedAt: Date
}

