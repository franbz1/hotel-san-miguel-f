export interface Room {
  id: number
  numero_habitacion: string
  tipo: string
  precio_por_noche: number
  capacidad: number
  estado: 'disponible' | 'ocupada' | 'mantenimiento'
  created_at: string
  updated_at: string
} 