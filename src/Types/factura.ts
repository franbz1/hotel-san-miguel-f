import { Huesped } from "./huesped"

export interface Factura {
  id: number
  total: number
  fecha_factura: Date
  huespedId: number
  huesped: Huesped
  createdAt: Date
  updatedAt: Date
}

