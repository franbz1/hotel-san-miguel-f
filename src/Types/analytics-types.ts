import { EstadosReserva } from "./enums/estadosReserva"

// Tipos para respuestas de ingresos diarios
export interface IngresosDiarios {
  date: string
  totalRevenue: number
  invoiceCount: number
  averagePerInvoice: number
}

// Tipos para respuestas de ingresos mensuales
export interface IngresosMensuales {
  year: number
  month: number
  totalRevenue: number
  invoiceCount: number
  averagePerInvoice: number
}

// Tipo para huésped dentro de facturas
export interface HuespedFactura {
  id: number
  nombres: string
  primer_apellido: string
  segundo_apellido: string
  numero_documento: string
  email: string
  telefono: string
  deleted: boolean
}

// Tipo para reserva dentro de facturas
export interface ReservaFactura {
  id: number
  fecha_entrada: string
  fecha_salida: string
  habitacion_id: number
  estado: EstadosReserva
  deleted: boolean
}

// Tipo para factura completa con relaciones
export interface FacturaCompleta {
  id: number
  total: number
  fecha_factura: string
  huesped_id: number
  reserva_id: number
  deleted: boolean
  created_at: string
  updated_at: string
  huesped: HuespedFactura
  reserva: ReservaFactura
}

// Tipos para parámetros de consulta
export interface RangoFechas {
  fechaInicio: string
  fechaFin: string
}

// Tipo para análisis de período personalizado
export interface AnalisisPeriodo {
  periodo: RangoFechas
  totalIngresos: number
  totalFacturas: number
  promedioPorFactura: number
  facturas: FacturaCompleta[]
}

// Tipos para estados de loading y error
export interface EstadoAnalytics {
  loading: boolean
  error: string | null
}

// Tipos para hooks personalizados
export interface UseAnalyticsReturn {
  ingresosDiarios: IngresosDiarios | null
  ingresosMensuales: IngresosMensuales | null
  facturasPorRango: FacturaCompleta[] | null
  obtenerIngresosDiarios: (fecha: string) => Promise<IngresosDiarios>
  obtenerIngresosMensuales: (año: number, mes: number) => Promise<IngresosMensuales>
  obtenerFacturasPorRango: (fechaInicio: string, fechaFin: string) => Promise<FacturaCompleta[]>
  analizarPeriodo: (fechaInicio: string, fechaFin: string) => Promise<AnalisisPeriodo>
  loading: boolean
  error: string | null
  limpiarError: () => void
} 