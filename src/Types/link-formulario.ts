export interface LinkFormulario {
  id: number
  url: string
  completado: boolean
  expirado: boolean
  vencimiento: Date
  numeroHabitacion: number
  fechaInicio: Date
  fechaFin: Date
  costo: number

  formularioId: number | null
}
