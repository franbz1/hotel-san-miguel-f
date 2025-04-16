export interface LinkFormulario {
  id: number
  url: string
  completado: boolean
  expirado: boolean
  vencimiento: Date

  formularioId: number
}
